import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

const cardsData = [
  { id: 1, front: "What is the formula for the Ideal Gas Law?", back: "PV = nRT" },
  { id: 2, front: "What does STP stand for?", back: "Standard Temperature and Pressure (0°C / 273.15 K and 1 atm)" },
  { id: 3, front: "How do you convert Celsius to Kelvin?", back: "K = °C + 273.15" },
  { id: 4, front: "What is Boyle's Law?", back: "P₁V₁ = P₂V₂ (Inverse relationship between Pressure and Volume)" },
  { id: 5, front: "What is the value of R when using atm and Liters?", back: "0.0821 L·atm/(mol·K)" },
  { id: 6, front: "What is Charles's Law?", back: "V₁/T₁ = V₂/T₂ (Direct relationship between Volume and Temperature)" },
  { id: 7, front: "In Gay-Lussac's Law, what remains constant?", back: "Volume (and moles of gas)" },
  { id: 8, front: "What is Avogadro's Law?", back: "V₁/n₁ = V₂/n₂ (Equal volumes of gases at the same T and P contain equal numbers of moles)" },
  { id: 9, front: "What is the Combined Gas Law?", back: "(P₁V₁)/T₁ = (P₂V₂)/T₂" },
  { id: 10, front: "What is the value of R when using kPa and Liters?", back: "8.314 L·kPa/(mol·K)" }
];

export default function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const nextCard = () => {
    setDirection(1);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cardsData.length);
  };

  const prevCard = () => {
    setDirection(-1);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cardsData.length) % cardsData.length);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.4 }
    })
  };

  return (
    <div className="py-8 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-serif font-bold neon-text mb-2">MEMORY BANKS</h1>
        <p className="font-mono text-gray-400 text-sm tracking-widest uppercase">
          Module {currentIndex + 1} of {cardsData.length}
        </p>
      </motion.div>

      <div className="relative w-full max-w-2xl h-80 perspective-1000">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute w-full h-full cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              initial={false}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
              className="w-full h-full relative preserve-3d"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front */}
              <div
                className="absolute w-full h-full glass-panel backface-hidden flex flex-col items-center justify-center p-8 border-hud-neon/30"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <span className="absolute top-4 left-4 font-mono text-xs text-hud-neon/50 uppercase">Query</span>
                <p className="text-2xl md:text-3xl font-serif font-bold text-white text-center">
                  {cardsData[currentIndex].front}
                </p>
                <div className="absolute bottom-4 right-4 animate-pulse">
                  <RotateCcw size={20} className="text-hud-neon/50" />
                </div>
              </div>

              {/* Back */}
              <div
                className="absolute w-full h-full glass-panel backface-hidden flex flex-col items-center justify-center p-8 border-hud-neon shadow-[inset_0_0_20px_rgba(0,255,255,0.2)]"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <span className="absolute top-4 left-4 font-mono text-xs text-hud-neon/50 uppercase">Data Extracted</span>
                <p className="text-2xl md:text-3xl font-mono font-bold text-hud-neon text-center drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">
                  {cardsData[currentIndex].back}
                </p>
              </div>

            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-12 flex gap-6">
        <button onClick={prevCard} className="hud-button flex items-center gap-2">
          <ChevronLeft size={20} /> PREV RECORD
        </button>
        <button onClick={nextCard} className="hud-button flex items-center gap-2">
          NEXT RECORD <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
