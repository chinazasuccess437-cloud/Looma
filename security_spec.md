# Looma Firestore Security Specification

## 1. Data Invariants
1. **Identity Integrity**: A `feedback` document can only be created by a verified, signed-in user (`request.auth != null && request.auth.token.email_verified == true`), and `authorId` must equal `request.auth.uid`.
2. **PII Isolation**: `feedback` documents strictly disallow email addresses or phone fields via `keys().hasOnly(...)`. Only `authorName` (1–40 chars) is stored for display.
3. **Bounded Payloads**: `rating` must be an integer `1..5`; `category` must match one of 5 enum values; `comment` is bounded to `3..800` chars; `feedbackId` must match `^[a-zA-Z0-9_-]+$` (`<= 128` chars).
4. **Temporal Integrity & Immutability**: `createdAt == request.time` and `updatedAt == request.time` on create. On update, `authorId` and `createdAt` are immutable and `updatedAt == request.time`.
5. **Action-Based Tiered Updates**:
   - **Author Edit**: Only `authorId == request.auth.uid` may update `['authorName', 'rating', 'category', 'comment', 'updatedAt']`.
   - **Owner/Admin Reply**: Only `isAdmin()` (bootstrapped verified `chinazajoseph952@gmail.com` or `/admins/$(request.auth.uid)`) may update `['ownerReply', 'updatedAt']`.
6. **Admin Lockout**: `/admins/{adminId}` cannot be written from client SDKs (preventing self-assigned admin escalation).

## 2. "Dirty Dozen" Adversarial Payloads (Must Return PERMISSION_DENIED)
1. Unauthenticated `create` on `/feedback/rev1` (fails `isVerifiedUser()`).
2. Unverified email `create` (`email_verified: false`) on `/feedback/rev1`.
3. Identity spoofing: `create` with `authorId: "other-user-uid"` != `request.auth.uid`.
4. Shadow field injection: `create` including extra ghost field `isAdmin: true` or `email: "leak@example.com"`.
5. Owner reply spoofing on create: regular user creating feedback with pre-filled `ownerReply`.
6. Out-of-bounds rating: `rating: 99` or `rating: 0` or `rating: 4.5` (float).
7. Resource exhaustion: `comment` of 5,000 characters (`> 800`), or `authorName` of 200 chars (`> 40`).
8. Path ID poisoning: document ID containing `/` or >128 chars (`isValidId` guard).
9. Timestamp spoofing: `createdAt` set to a client-chosen past date (`!= request.time`).
10. Author hijacking `ownerReply` on update (not in author's `affectedKeys().hasOnly(...)`).
11. Cross-user update/delete: User B attempting to edit or delete User A's feedback.
12. Privilege escalation: regular user attempting to write `/admins/{uid}` to grant themselves admin role.
