import { motion, AnimatePresence } from 'framer-motion';

// A parody CSS/SVG "robotic CEO" avatar. Reacts when a sound is playing.
const ZuckBot = ({ talking = false, label = '' }) => {
  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <motion.div
        className="relative"
        animate={talking ? { y: [0, -3, 0] } : { y: 0 }}
        transition={{ duration: 0.45, repeat: talking ? Infinity : 0 }}
      >
        {/* glow ring */}
        <motion.div
          className="absolute inset-0 rounded-[2rem] bg-hud-neon/20 blur-2xl"
          animate={{ opacity: talking ? [0.3, 0.7, 0.3] : 0.2 }}
          transition={{ duration: 1, repeat: Infinity }}
        />

        <svg
          width="180"
          height="200"
          viewBox="0 0 180 200"
          className="relative drop-shadow-[0_0_18px_rgba(0,255,255,0.35)]"
        >
          {/* hair / helmet */}
          <path d="M30 70 Q30 18 90 18 Q150 18 150 70 L150 84 Q150 60 90 60 Q30 60 30 84 Z" fill="#6b4f3a" />
          {/* face plate */}
          <rect x="36" y="48" width="108" height="120" rx="26" fill="#f1c9a5" stroke="rgba(0,255,255,0.5)" strokeWidth="1.5" />
          {/* circuit cheeks */}
          <line x1="46" y1="120" x2="60" y2="120" stroke="rgba(0,255,255,0.5)" strokeWidth="1.5" />
          <line x1="120" y1="120" x2="134" y2="120" stroke="rgba(0,255,255,0.5)" strokeWidth="1.5" />
          <circle cx="60" cy="120" r="2" fill="#00ffff" />
          <circle cx="120" cy="120" r="2" fill="#00ffff" />

          {/* eyes */}
          {[66, 114].map((cx) => (
            <g key={cx}>
              <rect x={cx - 16} y={92} width="32" height="22" rx="6" fill="#0a0a0f" />
              <motion.circle
                cx={cx}
                cy={103}
                r="6"
                fill="#00ffff"
                animate={
                  talking
                    ? { opacity: [1, 0.4, 1], scale: [1, 1.15, 1] }
                    : { opacity: [1, 1, 0.1, 1] }
                }
                transition={
                  talking
                    ? { duration: 0.5, repeat: Infinity }
                    : { duration: 4, repeat: Infinity, times: [0, 0.92, 0.95, 1] }
                }
              />
            </g>
          ))}

          {/* mouth: a moving waveform bar when talking, flat line when idle */}
          {talking ? (
            <g>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <motion.rect
                  key={i}
                  x={62 + i * 9}
                  y={140}
                  width="5"
                  rx="2"
                  fill="#00ffff"
                  animate={{ height: [4, 18, 8, 22, 6], y: [148, 140, 146, 138, 147] }}
                  transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.05 }}
                />
              ))}
            </g>
          ) : (
            <rect x="62" y="146" width="56" height="4" rx="2" fill="#0a0a0f" />
          )}
        </svg>
      </motion.div>

      <div className="h-6 flex items-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={talking ? label : 'idle'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="font-mono text-xs tracking-[0.3em] uppercase text-hud-neon/80"
          >
            {talking ? `> ${label}` : '> standing by'}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ZuckBot;
