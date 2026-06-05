import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

const dictionary = [
  { term: "Absolute Zero", definition: "The lowest possible temperature, 0 Kelvin (-273.15°C), where molecular motion ceases." },
  { term: "Atmosphere (atm)", definition: "A unit of pressure based on the average atmospheric pressure at sea level." },
  { term: "Avogadro's Number", definition: "6.022 × 10²³ particles per mole." },
  { term: "Celsius (°C)", definition: "A temperature scale where water freezes at 0° and boils at 100°." },
  { term: "Diffusion", definition: "The process by which particles move from an area of high concentration to an area of low concentration." },
  { term: "Effusion", definition: "The process by which gas particles escape through a tiny hole into a vacuum." },
  { term: "Ideal Gas", definition: "A hypothetical gas that perfectly follows all gas laws under all conditions (no intermolecular forces, zero volume of particles)." },
  { term: "Kelvin (K)", definition: "The SI base unit of temperature. Required for all gas law calculations. K = °C + 273.15" },
  { term: "Kinetic Molecular Theory", definition: "A theory that explains the behavior of gases based on the motion of their particles." },
  { term: "Mole (mol)", definition: "The SI unit for amount of substance, containing Avogadro's number of particles." },
  { term: "Pascal (Pa)", definition: "The SI unit of pressure. 1 atm = 101,325 Pa." },
  { term: "Pressure", definition: "The force exerted per unit area by gas molecules colliding with the walls of their container." },
  { term: "STP", definition: "Standard Temperature and Pressure: 0°C (273.15 K) and 1 atm pressure." },
  { term: "Torr", definition: "A unit of pressure equivalent to 1 millimeter of mercury (mmHg). 1 atm = 760 torr." },
  { term: "Volume", definition: "The amount of 3D space occupied by a gas." },
];

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = dictionary.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-serif font-bold neon-text mb-2 text-center">LEXICON: GLOSSARY</h1>
        <p className="font-mono text-gray-400 text-sm tracking-widest uppercase text-center mb-8">Search indexing initialized</p>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-hud-neon opacity-70" />
          </div>
          <input
            type="text"
            className="hud-input pl-10 h-14 text-lg"
            placeholder="Search designating terms or parameters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="font-mono text-xs text-hud-neon/50 uppercase">[{filteredTerms.length} matches]</span>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        <AnimatePresence>
          {filteredTerms.map((item, idx) => (
            <motion.div
              key={item.term}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="glass-panel p-5 group hover:border-hud-neon/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-baseline gap-2">
                <h2 className="text-xl font-bold font-mono text-white tracking-wider md:w-1/3 shrink-0 group-hover:text-hud-neon transition-colors">
                  {item.term}
                </h2>
                <p className="font-sans text-gray-300 md:w-2/3 leading-relaxed">
                  {item.definition}
                </p>
              </div>
            </motion.div>
          ))}
          {filteredTerms.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10"
            >
              <p className="font-mono text-red-400 uppercase tracking-widest">No matching records found in local database.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
