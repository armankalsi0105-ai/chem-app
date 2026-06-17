import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Shuffle, AlertTriangle } from 'lucide-react';
import { sounds, categories } from '../data/sounds';
import { play, stopAll, unlock, isSpeechSupported } from '../utils/audioEngine';
import SoundButton from '../components/SoundButton';
import ZuckBot from '../components/ZuckBot';

const Soundboard = () => {
  const [filter, setFilter] = useState('all');
  const [activeId, setActiveId] = useState(null);
  const [talking, setTalking] = useState(false);
  const [lastLabel, setLastLabel] = useState('');
  const [speechOk] = useState(() => isSpeechSupported());
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      stopAll();
    };
  }, []);

  const visible = filter === 'all' ? sounds : sounds.filter((s) => s.category === filter);

  const trigger = (sound) => {
    unlock();
    clearTimeout(timerRef.current);
    stopAll();
    const duration = play(sound);
    setActiveId(sound.id);
    setLastLabel(sound.label);
    setTalking(true);
    timerRef.current = setTimeout(() => {
      setTalking(false);
      setActiveId(null);
    }, duration);
  };

  const random = () => {
    const pick = visible[Math.floor(Math.random() * visible.length)];
    if (pick) trigger(pick);
  };

  const stop = () => {
    clearTimeout(timerRef.current);
    stopAll();
    setTalking(false);
    setActiveId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-serif text-3xl sm:text-5xl font-bold neon-text tracking-wider">
          THE ZUCK SOUNDBOARD
        </h1>
        <p className="mt-2 font-mono text-sm text-gray-400">
          A parody CEO voice synthesizer. Tap a tile to make the bot speak.
        </p>
      </motion.div>

      {/* Bot + controls */}
      <div className="glass-panel p-6 flex flex-col items-center gap-6">
        <ZuckBot talking={talking} label={lastLabel} />

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button onClick={random} className="hud-button flex items-center gap-2 text-sm">
            <Shuffle size={16} /> RANDOM
          </button>
          <button
            onClick={stop}
            className="hud-button flex items-center gap-2 text-sm !border-hud-error !text-hud-error hover:!bg-hud-error/20"
          >
            {talking ? <Volume2 size={16} /> : <VolumeX size={16} />} STOP
          </button>
        </div>

        {!speechOk && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-xs font-mono text-amber-200">
            <AlertTriangle size={14} />
            Voice lines need the Web Speech API. Sound effects still work here.
          </div>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-all ${
              filter === c.id
                ? 'border-hud-neon bg-hud-neon/15 text-hud-neon shadow-neon'
                : 'border-hud-border text-gray-400 hover:text-white hover:border-white/40'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
      >
        {visible.map((sound) => (
          <SoundButton
            key={sound.id}
            sound={sound}
            active={activeId === sound.id}
            onPlay={trigger}
          />
        ))}
      </motion.div>

      <p className="text-center font-mono text-[0.7rem] text-gray-600 pb-4">
        Parody / satire. All audio is synthesized in your browser — no real recordings are used.
      </p>
    </div>
  );
};

export default Soundboard;
