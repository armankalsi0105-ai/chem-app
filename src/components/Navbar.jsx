import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-panel !rounded-none !border-l-0 !border-r-0 !border-t-0 border-b-hud-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="text-hud-neon"
            >
              <Bot size={24} />
            </motion.div>
            <span className="font-serif font-bold text-xl tracking-widest neon-text">
              ZUCK<span className="text-white/80">.SND</span>
            </span>
          </Link>

          <span className="hidden sm:block px-3 py-2 text-xs font-mono tracking-[0.25em] text-gray-500 uppercase">
            parody // synthesized in-browser
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
