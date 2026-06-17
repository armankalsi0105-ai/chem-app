import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Cpu, Radio, Volume2 } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-panel !rounded-none !border-l-0 !border-r-0 !border-t-0 border-b-hud-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="text-hud-neon"
            >
              <Bot size={24} />
            </motion.div>
            <span className="font-serif font-bold text-xl tracking-widest neon-text">
              ZUCK<span className="text-white/80">.FX</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-5 font-mono text-xs uppercase tracking-[0.3em] text-gray-400">
            <div className="flex items-center gap-2">
              <Radio size={14} className="text-hud-neon" />
              Live Meme Console
            </div>
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-hud-neon" />
              Synthetic Audio
            </div>
            <div className="flex items-center gap-2">
              <Volume2 size={14} className="text-hud-neon" />
              Soundboard Ready
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
