export type UISoundId = 'click' | 'pop' | 'success' | 'error';

export const UI_SOUNDS: { id: UISoundId; label: string; description: string }[] = [
  { id: 'click', label: 'Soft Click', description: 'Crisp 18ms tactile tap' },
  { id: 'pop', label: 'Bubble Pop', description: 'Warm upward pitch pop' },
  { id: 'success', label: 'Success Chime', description: 'Two-note major fifth chime' },
  { id: 'error', label: 'Error Buzz', description: 'Restrained low muted thud' },
];

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  return Ctx ? new Ctx() : null;
}

export function playUISound(id: UISoundId): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  if (id === 'click') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.025);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.03);
  } else if (id === 'pop') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(760, now + 0.065);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } else if (id === 'success') {
    const notes = [523.25, 783.99];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + idx * 0.085;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.26);
    });
  } else if (id === 'error') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(115, now + 0.14);
    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  }
}

/**
 * Generates a real downloadable 16-bit PCM .wav file for the chosen micro-sound effect.
 */
export function downloadUISoundWav(id: UISoundId): void {
  const sampleRate = 44100;
  const durationSec = id === 'success' ? 0.35 : id === 'error' ? 0.18 : 0.09;
  const numSamples = Math.floor(sampleRate * durationSec);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    if (id === 'click') {
      const freq = 920 * Math.pow(240 / 920, Math.min(1, t / 0.025));
      const env = Math.exp(-t * 140);
      sample = Math.sin(2 * Math.PI * freq * t) * env * 0.45;
    } else if (id === 'pop') {
      const freq = 340 * Math.pow(760 / 340, Math.min(1, t / 0.065));
      const env = Math.exp(-t * 48);
      sample = Math.sin(2 * Math.PI * freq * t) * env * 0.5;
    } else if (id === 'success') {
      const n1 = Math.sin(2 * Math.PI * 523.25 * t) * Math.exp(-t * 14);
      const t2 = Math.max(0, t - 0.085);
      const n2 = t >= 0.085 ? Math.sin(2 * Math.PI * 783.99 * t2) * Math.exp(-t2 * 12) : 0;
      sample = (n1 + n2) * 0.35;
    } else {
      const freq = 160 - (45 * Math.min(1, t / 0.14));
      const env = Math.exp(-t * 20);
      sample = Math.sin(2 * Math.PI * freq * t) * env * 0.4;
    }

    const clamped = Math.max(-1, Math.min(1, sample));
    view.setInt16(44 + i * 2, clamped * 0x7fff, true);
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ui-sound-${id}.wav`;
  a.click();
  URL.revokeObjectURL(url);
}
