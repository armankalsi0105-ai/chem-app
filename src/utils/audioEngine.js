// Self-contained audio engine for the Zuck Soundboard.
// Everything is synthesized at runtime with the Web Audio API and spoken with
// the Web Speech API, so the app ships with zero audio files and works offline.

let ctx = null;

function getCtx() {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!ctx) ctx = new AudioCtx();
  // Browsers start the context "suspended" until a user gesture.
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// Master gain so we can scale overall volume in one place.
function master(c, gain = 0.6) {
  const g = c.createGain();
  g.gain.value = gain;
  g.connect(c.destination);
  return g;
}

// A single enveloped oscillator note.
function note(c, dest, { freq = 440, type = 'sine', start = 0, dur = 0.2, peak = 0.4, glideTo = null }) {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  const t0 = c.currentTime + start;
  osc.frequency.setValueAtTime(freq, t0);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(dest);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

// Short burst of filtered noise (whooshes, sips, sweat drops, claps).
function noiseBurst(c, dest, { dur = 0.3, start = 0, type = 'lowpass', freq = 1000, q = 1, peak = 0.5, sweepTo = null }) {
  const frames = Math.floor(c.sampleRate * dur);
  const buffer = c.createBuffer(1, frames, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = type;
  filter.Q.value = q;
  const t0 = c.currentTime + start;
  filter.frequency.setValueAtTime(freq, t0);
  if (sweepTo) filter.frequency.exponentialRampToValueAtTime(sweepTo, t0 + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(filter);
  filter.connect(g);
  g.connect(dest);
  src.start(t0);
  src.stop(t0 + dur + 0.02);
}

// ---- Named sound effects -------------------------------------------------

const sfx = {
  beep(c) {
    const m = master(c);
    note(c, m, { freq: 880, type: 'square', dur: 0.12, peak: 0.25 });
    note(c, m, { freq: 1320, type: 'square', start: 0.14, dur: 0.18, peak: 0.25 });
  },
  startup(c) {
    const m = master(c);
    [261, 329, 392, 523].forEach((f, i) =>
      note(c, m, { freq: f, type: 'triangle', start: i * 0.09, dur: 0.28, peak: 0.3 })
    );
  },
  error(c) {
    const m = master(c);
    note(c, m, { freq: 200, type: 'sawtooth', dur: 0.18, peak: 0.3 });
    note(c, m, { freq: 150, type: 'sawtooth', start: 0.2, dur: 0.3, peak: 0.3 });
  },
  glitch(c) {
    const m = master(c);
    for (let i = 0; i < 8; i++) {
      note(c, m, {
        freq: 300 + Math.random() * 1800,
        type: 'square',
        start: i * 0.045,
        dur: 0.04,
        peak: 0.22,
      });
    }
  },
  pop(c) {
    const m = master(c);
    note(c, m, { freq: 520, type: 'sine', dur: 0.12, peak: 0.5, glideTo: 1100 });
  },
  like(c) {
    const m = master(c);
    note(c, m, { freq: 700, type: 'sine', dur: 0.1, peak: 0.4, glideTo: 1300 });
    noiseBurst(c, m, { dur: 0.12, type: 'highpass', freq: 4000, peak: 0.15, start: 0.02 });
  },
  whoosh(c) {
    const m = master(c);
    noiseBurst(c, m, { dur: 0.7, type: 'bandpass', freq: 300, q: 0.7, peak: 0.45, sweepTo: 4000 });
  },
  warp(c) {
    const m = master(c);
    note(c, m, { freq: 120, type: 'sawtooth', dur: 0.9, peak: 0.3, glideTo: 1600 });
    noiseBurst(c, m, { dur: 0.9, type: 'lowpass', freq: 400, peak: 0.25, sweepTo: 5000 });
  },
  sip(c) {
    const m = master(c);
    noiseBurst(c, m, { dur: 0.5, type: 'bandpass', freq: 1200, q: 6, peak: 0.3, sweepTo: 500 });
  },
  sweat(c) {
    const m = master(c);
    note(c, m, { freq: 1400, type: 'sine', dur: 0.18, peak: 0.3, glideTo: 400 });
  },
  servo(c) {
    const m = master(c);
    note(c, m, { freq: 320, type: 'sawtooth', dur: 0.5, peak: 0.18 });
    noiseBurst(c, m, { dur: 0.5, type: 'bandpass', freq: 2400, q: 8, peak: 0.12 });
  },
  punch(c) {
    const m = master(c);
    note(c, m, { freq: 160, type: 'sine', dur: 0.18, peak: 0.6, glideTo: 50 });
    noiseBurst(c, m, { dur: 0.12, type: 'lowpass', freq: 800, peak: 0.4 });
  },
  applause(c) {
    const m = master(c);
    for (let i = 0; i < 24; i++) {
      noiseBurst(c, m, {
        dur: 0.06,
        start: i * 0.05 + Math.random() * 0.02,
        type: 'highpass',
        freq: 2500,
        peak: 0.12,
      });
    }
  },
  airhorn(c) {
    const m = master(c);
    [0, 0.35, 0.7].forEach((s) => {
      note(c, m, { freq: 440, type: 'sawtooth', start: s, dur: 0.3, peak: 0.3 });
      note(c, m, { freq: 554, type: 'sawtooth', start: s, dur: 0.3, peak: 0.3 });
    });
  },
};

// ---- Speech --------------------------------------------------------------

let cachedVoices = [];

function loadVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  cachedVoices = window.speechSynthesis.getVoices();
  return cachedVoices;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

function pickVoice() {
  const voices = cachedVoices.length ? cachedVoices : loadVoices();
  if (!voices.length) return null;
  // Prefer a deep / English male voice to lean into the "robotic CEO" bit.
  const prefer = [
    /google us english/i,
    /microsoft (david|guy|mark)/i,
    /daniel/i,
    /alex/i,
    /english/i,
  ];
  for (const re of prefer) {
    const v = voices.find((vo) => re.test(vo.name) && /en/i.test(vo.lang));
    if (v) return v;
  }
  return voices.find((vo) => /en/i.test(vo.lang)) || voices[0];
}

function speak(text, { pitch = 0.45, rate = 0.85, volume = 1 } = {}) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const v = pickVoice();
  if (v) u.voice = v;
  u.pitch = pitch;
  u.rate = rate;
  u.volume = volume;
  window.speechSynthesis.speak(u);
  return true;
}

// ---- Public API ----------------------------------------------------------

export function unlock() {
  getCtx();
}

export function stopAll() {
  if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
}

export function isSpeechSupported() {
  return typeof window !== 'undefined' && !!window.speechSynthesis;
}

// Play a sound definition (see data/sounds.js).
// Returns an approximate duration (ms) so the UI can animate the bot.
export function play(sound) {
  const c = getCtx();
  let duration = 700;

  if (sound.effect && c && sfx[sound.effect]) {
    sfx[sound.effect](c);
    duration = Math.max(duration, sound.effectMs || 700);
  }

  if (sound.text) {
    const delay = sound.effect ? sound.speakDelay || 200 : 0;
    setTimeout(() => speak(sound.text, sound.voice), delay);
    // Rough estimate: ~75ms per character, scaled by speaking rate.
    const rate = (sound.voice && sound.voice.rate) || 0.85;
    duration = Math.max(duration, (sound.text.length * 75) / rate + delay);
  }

  return duration;
}
