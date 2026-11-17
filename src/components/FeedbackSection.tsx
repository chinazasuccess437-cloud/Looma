import React, { useEffect, useMemo, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  Check,
  Edit3,
  Loader2,
  LogOut,
  MessageSquareHeart,
  Reply,
  Send,
  Star,
  Trash2,
} from 'lucide-react';
import {
  ADMIN_EMAIL,
  db,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { trackEvent } from '../utils/analytics';

const FEEDBACK_CATEGORIES = [
  'Logo Loader',
  'Custom AI Studio',
  'States & UI Kit',
  'Design & Vibe',
  'Feature Request',
] as const;

type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

interface FeedbackItem {
  id: string;
  authorId: string;
  authorName: string;
  rating: number;
  category: FeedbackCategory;
  comment: string;
  ownerReply?: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Needs work',
  2: 'Fair',
  3: 'Good',
  4: 'Great',
  5: 'Love it!',
};

function formatRelativeDate(ts?: Timestamp | null): string {
  if (!ts || typeof ts.toDate !== 'function') return 'Just now';
  const date = ts.toDate();
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function FeedbackSection() {
  const { user, authReady, authBusy, authError, signInWithGoogle, signOutUser } = useAuth();

  const [reviews, setReviews] = useState<FeedbackItem[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [firestoreError, setFirestoreError] = useState<Error | null>(null);

  // New / Edit feedback form state
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [category, setCategory] = useState<FeedbackCategory>('Logo Loader');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Editing & Creator reply state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [filterCategory, setFilterCategory] = useState<'All' | FeedbackCategory>('All');

  useEffect(() => {
    if (user?.displayName) {
      setAuthorName((prev) => prev || user.displayName!.slice(0, 40));
    }
  }, [user]);

  useEffect(() => {
    const feedbackQuery = query(
      collection(db, 'feedback'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsub = onSnapshot(
      feedbackQuery,
      (snapshot) => {
        const items: FeedbackItem[] = snapshot.docs.map((d) => {
          const data = d.data() as Omit<FeedbackItem, 'id'>;
          return {
            id: d.id,
            authorId: data.authorId,
            authorName: data.authorName,
            rating: data.rating,
            category: data.category,
            comment: data.comment,
            ownerReply: data.ownerReply,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });
        setReviews(items);
        setLoadingReviews(false);
      },
      (err) => {
        setLoadingReviews(false);
        try {
          handleFirestoreError(err, OperationType.LIST, 'feedback');
        } catch (wrapped) {
          setFirestoreError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
        }
      }
    );

    return () => unsub();
  }, []);

  // Surface Firestore errors to the surrounding ErrorBoundary cleanly
  if (firestoreError) {
    throw firestoreError;
  }

  const isCreatorAdmin = Boolean(
    user && user.email === ADMIN_EMAIL && user.emailVerified
  );

  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) {
      return {
        total: 0,
        average: 0,
        counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
      };
    }
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    for (const r of reviews) {
      const clamped = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[clamped] = (counts[clamped] ?? 0) + 1;
      sum += r.rating;
    }
    return {
      total,
      average: sum / total,
      counts,
    };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    if (filterCategory === 'All') return reviews;
    return reviews.filter((r) => r.category === filterCategory);
  }, [reviews, filterCategory]);

  const handleGoogleSignIn = async () => {
    setFormError(null);
    await signInWithGoogle();
    if (authError) setFormError(authError);
  };

  const handleSignOut = async () => {
    await signOutUser();
    setEditingId(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setRating(5);
    setCategory('Logo Loader');
    setComment('');
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitSuccess(null);

    if (!user) {
      await handleGoogleSignIn();
      return;
    }

    if (!user.emailVerified) {
      setFormError('Please use a verified Google account to post feedback.');
      return;
    }

    const cleanName = (authorName.trim() || user.displayName || 'Looma Maker').slice(0, 40);
    const cleanComment = comment.trim();
    const cleanRating = Math.min(5, Math.max(1, Math.round(rating)));

    if (cleanComment.length < 3) {
      setFormError('Please write at least a few words (3+ characters) for your feedback.');
      return;
    }
    if (cleanComment.length > 800) {
      setFormError('Feedback must be 800 characters or fewer.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        const ref = doc(db, 'feedback', editingId);
        try {
          await updateDoc(ref, {
            authorName: cleanName,
            rating: cleanRating,
            category,
            comment: cleanComment,
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `feedback/${editingId}`);
        }
        trackEvent('feedback_updated', { rating: cleanRating, category });
        setSubmitSuccess('Your review was updated and saved.');
      } else {
        try {
          await addDoc(collection(db, 'feedback'), {
            authorId: user.uid,
            authorName: cleanName,
            rating: cleanRating,
            category,
            comment: cleanComment,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, 'feedback');
        }
        trackEvent('feedback_submitted', { rating: cleanRating, category });
        setSubmitSuccess('Thank you! Your rating and feedback are saved permanently.');
      }

      resetForm();
      window.setTimeout(() => setSubmitSuccess(null), 3500);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Unable to save feedback right now.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (item: FeedbackItem) => {
    setEditingId(item.id);
    setAuthorName(item.authorName);
    setRating(item.rating);
    setCategory(item.category);
    setComment(item.comment);
    setFormError(null);
    setSubmitSuccess(null);
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deleteDoc(doc(db, 'feedback', itemId));
      trackEvent('feedback_deleted');
      if (editingId === itemId) resetForm();
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.DELETE, `feedback/${itemId}`);
      } catch (wrapped) {
        setFormError(wrapped instanceof Error ? wrapped.message : 'Failed to delete review.');
      }
    }
  };

  const handleSaveReply = async (itemId: string) => {
    const cleanReply = replyDraft.trim();
    if (!cleanReply || cleanReply.length > 500) return;

    try {
      await updateDoc(doc(db, 'feedback', itemId), {
        ownerReply: cleanReply,
        updatedAt: serverTimestamp(),
      });
      setReplyingToId(null);
      setReplyDraft('');
      trackEvent('feedback_owner_reply');
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.UPDATE, `feedback/${itemId}`);
      } catch (wrapped) {
        setFormError(wrapped instanceof Error ? wrapped.message : 'Failed to post reply.');
      }
    }
  };

  const activeStars = hoverRating ?? rating;

  return (
    <section className="space-y-6">
      {/* Top Overview & Score Breakdown */}
      <div className="looma-floating-card rounded-2xl border border-zinc-800/90 p-5 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-center">
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-start gap-4">
            <div className="flex items-baseline gap-2.5">
              <span className="font-display text-4xl font-bold text-white tabular-nums">
                {stats.total > 0 ? stats.average.toFixed(1) : '—'}
              </span>
              <span className="text-xs text-zinc-400">out of 5</span>
            </div>

            <div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      stats.average >= star - 0.35
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-zinc-700'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-xs text-zinc-400 tabular-nums">
                {stats.total === 0
                  ? 'Be the first to rate Looma'
                  : `Based on ${stats.total} saved ${stats.total === 1 ? 'review' : 'reviews'}`}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.counts[star] ?? 0;
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="w-8 text-zinc-400 font-medium tabular-nums">
                    {star} ★
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400/90 transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-zinc-500 tabular-nums">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Split: Write Feedback + Permanent Review Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start">
        {/* Left: Interactive Rating & Feedback Form */}
        <form
          onSubmit={handleSubmit}
          className="looma-floating-card rounded-2xl border border-zinc-800/90 p-5 space-y-5"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-semibold text-white">
                {editingId ? 'Edit Your Feedback' : 'Rate & Review Looma'}
              </h2>
              <p className="mt-0.5 text-xs text-zinc-400">
                Saved permanently in Cloud Firestore for everyone to see.
              </p>
            </div>

            {user && (
              <button
                type="button"
                onClick={handleSignOut}
                title="Sign out"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign out</span>
              </button>
            )}
          </div>

          {/* 5-Star Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-zinc-300">Your Rating</span>
              <span className="text-xs font-medium text-amber-300">
                {RATING_LABELS[activeStars]} ({activeStars}/5)
              </span>
            </div>
            <div
              className="flex items-center gap-1.5"
              onMouseLeave={() => setHoverRating(null)}
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = activeStars >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    aria-label={`Rate ${star} out of 5 stars`}
                    onMouseEnter={() => setHoverRating(star)}
                    onClick={() => setRating(star)}
                    className="p-1.5 rounded-lg hover:bg-zinc-800/80 transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        filled
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-zinc-700 hover:text-zinc-500'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">
              What are you reviewing?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FEEDBACK_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                    category === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label
              htmlFor="feedback-author-name"
              className="block text-xs font-medium text-zinc-300 mb-1.5"
            >
              Display Name
            </label>
            <input
              id="feedback-author-name"
              type="text"
              maxLength={40}
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name or handle (e.g. Alex)"
              className="w-full rounded-xl border border-zinc-800 bg-[#0B0C10] px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Comment */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="feedback-comment"
                className="text-xs font-medium text-zinc-300"
              >
                Your Feedback
              </label>
              <span className="text-[11px] text-zinc-500 tabular-nums">
                {comment.length}/800
              </span>
            </div>
            <textarea
              id="feedback-comment"
              rows={4}
              maxLength={800}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What do you love about Looma, or what should we build next?"
              className="w-full rounded-xl border border-zinc-800 bg-[#0B0C10] p-3 text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {formError && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-950/35 px-3 py-2.5 text-xs text-rose-200">
              {formError}
            </div>
          )}

          {submitSuccess && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/35 px-3 py-2.5 text-xs text-emerald-200 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{submitSuccess}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {!authReady ? (
              <button
                type="button"
                disabled
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-800 text-zinc-400"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking session...</span>
              </button>
            ) : !user ? (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authBusy}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white transition-colors cursor-pointer"
              >
                {authBusy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Opening Google Sign-In...</span>
                  </>
                ) : (
                  <>
                    <MessageSquareHeart className="w-4 h-4" />
                    <span>Sign in with Google to Post Feedback</span>
                  </>
                )}
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white transition-colors cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>
                        {editingId ? 'Save Updated Review' : 'Submit & Save Forever'}
                      </span>
                    </>
                  )}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-3 py-2.5 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </>
            )}
          </div>
        </form>

        {/* Right: Community Feedback Feed */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-sm font-semibold text-white">
              Saved Community Feedback ({filteredReviews.length})
            </h3>
            <div className="flex flex-wrap items-center gap-1.5">
              {(['All', ...FEEDBACK_CATEGORIES] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-zinc-100 text-zinc-900'
                      : 'bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loadingReviews ? (
            <div className="looma-floating-card rounded-2xl border border-zinc-800/90 p-10 text-center text-xs text-zinc-400 flex flex-col items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
              <span>Loading saved feedback...</span>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="looma-floating-card rounded-2xl border border-zinc-800/90 p-10 text-center space-y-2">
              <MessageSquareHeart className="w-7 h-7 text-zinc-600 mx-auto" />
              <p className="text-sm font-medium text-zinc-300">No feedback in this category yet</p>
              <p className="text-xs text-zinc-500">
                Leave the first rating and comment on the left—it stays saved permanently.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReviews.map((item) => {
                const isOwn = Boolean(user && user.uid === item.authorId);
                return (
                  <article
                    key={item.id}
                    className="looma-floating-card rounded-2xl border border-zinc-800/90 p-4 sm:p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display text-sm font-semibold text-white">
                            {item.authorName}
                          </span>
                          <span className="text-[11px] text-zinc-500">
                            {item.category} · {formatRelativeDate(item.createdAt)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                item.rating >= star
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-zinc-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {(isOwn || isCreatorAdmin) && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isOwn && (
                            <button
                              type="button"
                              onClick={() => handleStartEdit(item)}
                              title="Edit your review"
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {isCreatorAdmin && (
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingToId(replyingToId === item.id ? null : item.id);
                                setReplyDraft(item.ownerReply ?? '');
                              }}
                              title="Reply as Looma Creator"
                              className="p-1.5 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-zinc-800 cursor-pointer"
                            >
                              <Reply className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            title="Delete review"
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {item.comment}
                    </p>

                    {item.ownerReply && (
                      <div className="rounded-xl border border-blue-500/25 bg-blue-950/20 px-3.5 py-2.5 text-xs">
                        <span className="font-semibold text-blue-300">Creator Reply · </span>
                        <span className="text-zinc-300">{item.ownerReply}</span>
                      </div>
                    )}

                    {isCreatorAdmin && replyingToId === item.id && (
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          maxLength={500}
                          value={replyDraft}
                          onChange={(e) => setReplyDraft(e.target.value)}
                          placeholder="Write an official reply..."
                          className="flex-1 rounded-xl border border-zinc-700 bg-[#0B0C10] px-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveReply(item.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                        >
                          Save Reply
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
