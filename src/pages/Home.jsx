import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Layers, Beaker, Calculator, Target } from 'lucide-react';

const modules = [
  {
    title: 'DATA TERMINAL',
    subtitle: 'Cheat Sheets',
    path: '/cheatsheets',
    icon: BookOpen,
    desc: 'Access core formulas, constants, and constraints.',
    color: 'border-blue-500',
    shadow: 'shadow-blue-500/20'
  },
  {
    title: 'MEMORY BANKS',
    subtitle: 'Flashcards',
    path: '/flashcards',
    icon: Layers,
    desc: 'Interactive 3D storage for rapid factual recall.',
    color: 'border-purple-500',
    shadow: 'shadow-purple-500/20'
  },
  {
    title: 'LEXICON',
    subtitle: 'Glossary',
    path: '/glossary',
    icon: Beaker,
    desc: 'Searchable index of key chemical designations.',
    color: 'border-green-500',
    shadow: 'shadow-green-500/20'
  },
  {
    title: 'PRECISION SOLVER',
    path: '/calculators',
    subtitle: 'Calculators',
    icon: Calculator,
    desc: 'Compute complex variables with step-by-step logic tracing.',
    color: 'border-hud-neon',
    shadow: 'shadow-neon'
  },
  {
    title: 'SIMULATION LAB',
    path: '/quiz',
    subtitle: 'Quizzes',
    icon: Target,
    desc: 'Configure testing parameters and track operational proficiency.',
    color: 'border-orange-500',
    shadow: 'shadow-orange-500/20'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-8rem)]">

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16 relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-hud-neon/5 blur-[100px] -z-10 rounded-full pointer-events-none" />

        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-wide uppercase">
          Master Chemistry <br />
          <span className="neon-text block mt-2">Gas Laws</span>
        </h1>
        <p className="font-mono text-gray-400 max-w-2xl mx-auto text-sm md:text-base tracking-widest uppercase mt-6">
          Initialize learning protocols. Select a module below to begin data ingestion.
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl"
      >
        {modules.map((mod, index) => {
          const Icon = mod.icon;
          return (
            <motion.div key={mod.path} variants={itemVariants}>
              <Link to={mod.path} className="block h-full outline-none">
                <div className={`glass-panel h-full p-6 border-t-2 ${mod.color} hover:-translate-y-2 hover:${mod.shadow} transition-all duration-300 group cursor-pointer`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg bg-black/50 border ${mod.color} text-white group-hover:text-hud-neon transition-colors duration-300`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h2 className="font-mono font-bold text-lg text-white tracking-widest group-hover:text-hud-neon transition-colors duration-300">
                        {mod.title}
                      </h2>
                      <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">{mod.subtitle}</span>
                    </div>
                  </div>
                  <p className="text-gray-400 font-sans text-sm leading-relaxed">
                    {mod.desc}
                  </p>

                  {/* Decorative HUD elements */}
                  <div className="absolute bottom-2 right-2 flex gap-1 opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-1 h-1 bg-hud-neon rounded-full" />
                    <div className="w-1 h-1 bg-hud-neon rounded-full" />
                    <div className="w-1 h-1 bg-hud-neon rounded-full" />
                  </div>
                  <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

    </div>
  );
}
