import { motion } from 'framer-motion';

const colorMap = {
  cyan: 'border-cyan-400/40 hover:border-cyan-300 text-cyan-200 hover:shadow-[0_0_18px_rgba(34,211,238,0.5)]',
  lime: 'border-lime-400/40 hover:border-lime-300 text-lime-200 hover:shadow-[0_0_18px_rgba(163,230,53,0.5)]',
  red: 'border-rose-500/40 hover:border-rose-400 text-rose-200 hover:shadow-[0_0_18px_rgba(244,63,94,0.5)]',
  violet: 'border-violet-400/40 hover:border-violet-300 text-violet-200 hover:shadow-[0_0_18px_rgba(167,139,250,0.5)]',
  amber: 'border-amber-400/40 hover:border-amber-300 text-amber-200 hover:shadow-[0_0_18px_rgba(251,191,36,0.5)]',
};

const activeMap = {
  cyan: 'border-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.7)]',
  lime: 'border-lime-300 shadow-[0_0_24px_rgba(163,230,53,0.7)]',
  red: 'border-rose-400 shadow-[0_0_24px_rgba(244,63,94,0.7)]',
  violet: 'border-violet-300 shadow-[0_0_24px_rgba(167,139,250,0.7)]',
  amber: 'border-amber-300 shadow-[0_0_24px_rgba(251,191,36,0.7)]',
};

const SoundButton = ({ sound, active, onPlay }) => {
  const color = colorMap[sound.color] || colorMap.cyan;
  const activeColor = activeMap[sound.color] || activeMap.cyan;

  return (
    <motion.button
      type="button"
      onClick={() => onPlay(sound)}
      whileTap={{ scale: 0.93 }}
      className={`group relative flex flex-col items-center justify-center gap-2 rounded-2xl border bg-black/40 px-3 py-5 text-center backdrop-blur-sm transition-all duration-200 ${color} ${
        active ? activeColor : ''
      }`}
    >
      <motion.span
        className="text-3xl sm:text-4xl"
        animate={active ? { scale: [1, 1.25, 1], rotate: [0, -6, 6, 0] } : { scale: 1 }}
        transition={{ duration: 0.5, repeat: active ? Infinity : 0 }}
      >
        {sound.emoji}
      </motion.span>
      <span className="font-mono text-[0.7rem] sm:text-xs font-bold uppercase tracking-wider leading-tight">
        {sound.label}
      </span>
      {active && (
        <motion.span
          layoutId="playing-dot"
          className="absolute right-2 top-2 h-2 w-2 rounded-full bg-current"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};

export default SoundButton;
