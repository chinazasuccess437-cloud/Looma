import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

export interface CustomDesignRequest {
  description?: string;
  currentStyleContext?: string;
  imageDataUrl?: string;
  previousDesignSummary?: string;
}

export interface GeneratedDesignResult {
  designName: string;
  styleSummary: string;
  palette: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
  };
  recommendedMotion: string;
  previewHtml: string;
  reactCode: string;
  aiPrompt: string;
}

function parseDataUrl(dataUrl: string): { mimeType: string; data: string } | null {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl.trim());
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

function extractReadableError(err: unknown): { message: string; statusCode: number } {
  const e = err as Error & { statusCode?: number; status?: number };
  let statusCode = e?.statusCode || e?.status || 500;
  let rawMessage = e?.message || 'Failed to generate custom design.';

  try {
    const parsed = JSON.parse(rawMessage) as {
      error?: { code?: number; message?: string; status?: string };
    };
    if (parsed?.error?.message) {
      rawMessage = parsed.error.message;
      if (parsed.error.code) statusCode = parsed.error.code;
    }
  } catch {
    // Already plain text
  }

  return { message: rawMessage, statusCode };
}

function isTransientError(statusCode: number, message: string): boolean {
  if (statusCode === 503 || statusCode === 429 || statusCode === 502 || statusCode === 504) {
    return true;
  }
  const lower = message.toLowerCase();
  return (
    lower.includes('high demand') ||
    lower.includes('unavailable') ||
    lower.includes('timeout') ||
    lower.includes('abort')
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const DESIGN_SYSTEM_INSTRUCTION = `You are an elite Staff Product Designer and Frontend Engineer.
Your job is to craft complete, visually stunning, interactive, production-grade UIs from the user's description and optional uploaded UI screenshot or logo.

Strict Quality Rules:
1. ANALYZE UPLOADED IMAGES DEEPLY: When the user attaches a UI screenshot, app screen, or logo, carefully identify its layout sections, navigation, cards, buttons, forms, copy, and visual purpose. Recreate and elevate THEIR actual screen/brand rather than inventing an unrelated generic box. Apply the exact visual/motion upgrades they ask for (e.g. "Make it feel alive" -> add drifting ambient light orbs, glassmorphic floating surfaces with specular top borders, staggered entrance motion, hover levitation, animated icons/indicators, and interactive micro-feedback).
2. COMPLETE INTERACTIVE LIVE PREVIEW (previewHtml):
   - Must be a full, self-contained HTML5 document (<!doctype html>...) with rich inline <style> CSS and working inline <script> interactivity (clickable tabs, toggles, interactive buttons, hover lift, feedback states) with ZERO external CDN links or broken image URLs.
   - Use crisp inline SVG icons instead of emoji or broken img paths.
   - Build a genuine, full-bleed layout (sidebar/header + cards/metrics/forms/hero as appropriate), generous breathing room, CSS custom properties, crisp typography (-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; tight letter-spacing on headings; tabular-nums on metrics), layered shadows, subtle gradients, and GPU-accelerated @keyframes animations.
   - Ensure high contrast between text and surfaces (never dark text on dark surfaces or faint invisible borders).
3. PRODUCTION REACT TSX (reactCode):
   - Write clean, modular TypeScript React + Tailwind CSS (and motion/react where helpful) implementing the full UI faithfully with real interactive React state (tabs, toggles, inputs, feedback).
4. PLAIN-ENGLISH AI PROMPT (aiPrompt):
   - Write a thorough, crystal-clear specification covering layout grid, exact hex colors, typography hierarchy, interactive states, and motion physics so another developer or AI coding tool can rebuild it identically.
5. REALISTIC DOMAIN COPY: Never use "Lorem ipsum" or empty boxes—use authentic, specific UI copy matching the user's request or uploaded screenshot.`;

export async function generateCustomUiDesign(
  input: CustomDesignRequest
): Promise<GeneratedDesignResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    const err = new Error(
      'GEMINI_API_KEY is not configured. Add it in Settings > Secrets (or your hosting environment variables).'
    );
    (err as Error & { statusCode?: number }).statusCode = 500;
    throw err;
  }

  const description = (input.description ?? '').trim();
  if (!description && !input.imageDataUrl) {
    const err = new Error('Please describe the style you want or upload a UI/logo image.');
    (err as Error & { statusCode?: number }).statusCode = 400;
    throw err;
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: 45000,
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

  if (input.imageDataUrl) {
    const parsedImg = parseDataUrl(input.imageDataUrl);
    if (parsedImg) {
      parts.push({
        inlineData: {
          mimeType: parsedImg.mimeType,
          data: parsedImg.data,
        },
      });
    }
  }

  const promptText = [
    `User Design Request:`,
    description ||
      'Redesign and elevate the attached UI screenshot/logo into an alive, modern interactive UI.',
    input.previousDesignSummary
      ? `\nPrevious generated design to refine/modify:\n${input.previousDesignSummary}`
      : '',
    input.currentStyleContext
      ? `\nStudio color/motion context:\n${input.currentStyleContext}`
      : '',
    `\nDeliverables:
- previewHtml: Complete, full-featured, responsive HTML5 + CSS + vanilla JS interactive UI (not a tiny stub card—build the full requested screen/component with animations, working clickable controls, and inline SVGs).
- reactCode: Complete, idiomatic React + Tailwind + motion/react TSX component matching previewHtml.
- aiPrompt: Clear plain-English specification for recreating this design.
- palette: Valid 6-digit hex strings (#RRGGBB) for primary, secondary, background, surface, text.`,
  ].join('\n');

  parts.push({ text: promptText });

  const schema = {
    type: Type.OBJECT,
    properties: {
      designName: { type: Type.STRING },
      styleSummary: { type: Type.STRING },
      palette: {
        type: Type.OBJECT,
        properties: {
          primary: { type: Type.STRING },
          secondary: { type: Type.STRING },
          background: { type: Type.STRING },
          surface: { type: Type.STRING },
          text: { type: Type.STRING },
        },
        required: ['primary', 'secondary', 'background', 'surface', 'text'],
      },
      recommendedMotion: { type: Type.STRING },
      previewHtml: { type: Type.STRING },
      reactCode: { type: Type.STRING },
      aiPrompt: { type: Type.STRING },
    },
    required: [
      'designName',
      'styleSummary',
      'palette',
      'recommendedMotion',
      'previewHtml',
      'reactCode',
      'aiPrompt',
    ],
  };

  const attempts: Array<{ model: string; thinkingLevel: ThinkingLevel }> = [
    { model: 'gemini-4-hydrogen', thinkingLevel: ThinkingLevel.MEDIUM },
    { model: 'gemini-3.1-flash-lite', thinkingLevel: ThinkingLevel.LOW },
  ];

  let lastError: { message: string; statusCode: number } = {
    message: 'Unable to reach AI design service. Please try again.',
    statusCode: 503,
  };

  for (let i = 0; i < attempts.length; i++) {
    const { model, thinkingLevel } = attempts[i];
    try {
      const response = await ai.models.generateContent({
        model,
        contents: { parts },
        config: {
          systemInstruction: DESIGN_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: schema,
          thinkingConfig: { thinkingLevel },
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        throw new Error('The AI model returned an empty response. Please try again.');
      }

      return JSON.parse(rawText) as GeneratedDesignResult;
    } catch (err) {
      lastError = extractReadableError(err);
      if (i < attempts.length - 1 && isTransientError(lastError.statusCode, lastError.message)) {
        await delay(400);
        continue;
      }
      break;
    }
  }

  const finalErr = new Error(lastError.message);
  (finalErr as Error & { statusCode?: number }).statusCode = lastError.statusCode;
  throw finalErr;
}
