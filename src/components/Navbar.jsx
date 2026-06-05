import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Beaker, BookOpen, Layers, Calculator, Target, TerminalSquare } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const links = [
    { name: 'HOME', path: '/', icon: TerminalSquare },
    { name: 'CHEATS', path: '/cheatsheets', icon: BookOpen },
    { name: 'FLASHCARDS', path: '/flashcards', icon: Layers },
    { name: 'GLOSSARY', path: '/glossary', icon: Beaker },
    { name: 'SOLVER', path: '/calculators', icon: Calculator },
    { name: 'SIMULATION', path: '/quiz', icon: Target },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-panel !rounded-none !border-l-0 !border-r-0 !border-t-0 border-b-hud-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-hud-neon"
            >
              <Beaker size={24} />
            </motion.div>
            <span className="font-serif font-bold text-xl tracking-widest neon-text">
              GAS<span className="text-white/80">.SYS</span>
            </span>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-3 py-2 rounded-md text-sm font-mono tracking-wider transition-colors duration-300 flex items-center gap-2 ${
                      isActive ? 'text-hud-neon' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-hud-neon' : ''} />
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-hud-neon shadow-neon"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
