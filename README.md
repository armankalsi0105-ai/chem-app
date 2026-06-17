# The Zuck Soundboard

A fun, parody Mark Zuckerberg–style soundboard built with React + Vite + Tailwind.

Tap a tile and a robotic "CEO" avatar speaks famous-sounding lines ("Senator, we
run ads", "Welcome to the metaverse", "I must consume water to remain human") and
fires off synthesized sound effects (beeps, whooshes, warps, airhorns, applause).

> Parody / satire. **No real audio recordings are used.** Every sound is generated
> live in your browser, so the app ships with zero audio assets and works offline.

## How it works

- **Voice lines** use the browser's [Web Speech API](https://developer.mozilla.org/docs/Web/API/SpeechSynthesis)
  (`speechSynthesis`) with a low pitch / slow rate for the deadpan robot vibe.
- **Sound effects** are synthesized with the [Web Audio API](https://developer.mozilla.org/docs/Web/API/Web_Audio_API)
  (oscillators + filtered noise) — see `src/utils/audioEngine.js`.
- Sounds are defined declaratively in `src/data/sounds.js`, so adding a new tile is
  just a new object (give it `text`, an `effect`, or both).

## Run it

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
npm run lint     # lint
```

Then open the printed local URL and start tapping tiles.

## Browser notes

- Audio only starts after a user interaction (a tap) — this is a browser
  autoplay policy, not a bug.
- Voice lines require a browser that supports `speechSynthesis` (most modern
  desktop/mobile browsers). If it's unavailable, the sound effects still play and
  the UI shows a small notice.
- Available voices vary by OS/browser, so the exact robot voice will differ
  between devices.

## Project structure

```
src/
  data/sounds.js          # sound + voice-line definitions
  utils/audioEngine.js    # Web Audio + Speech synthesis engine
  components/
    SoundButton.jsx       # a single soundboard tile
    ZuckBot.jsx           # animated robotic avatar
    Navbar.jsx
  pages/Soundboard.jsx    # main screen
  App.jsx
```
