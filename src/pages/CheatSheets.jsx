import { motion } from 'framer-motion';

const gasLaws = [
  {
    name: "Boyle's Law",
    formula: "P₁V₁ = P₂V₂",
    definition: "For a fixed mass of gas at a constant temperature, the volume is inversely proportional to the pressure.",
    constants: ["Temperature (T)", "Amount of gas (n)"],
    rules: ["Pressure and Volume can be in any units, as long as they match on both sides."]
  },
  {
    name: "Charles's Law",
    formula: "V₁/T₁ = V₂/T₂",
    definition: "For a fixed mass of gas at a constant pressure, the volume is directly proportional to the absolute temperature.",
    constants: ["Pressure (P)", "Amount of gas (n)"],
    rules: ["Temperature MUST be in Kelvin (K).", "Volume units must match."]
  },
  {
    name: "Gay-Lussac's Law",
    formula: "P₁/T₁ = P₂/T₂",
    definition: "For a fixed mass of gas at a constant volume, the pressure is directly proportional to the absolute temperature.",
    constants: ["Volume (V)", "Amount of gas (n)"],
    rules: ["Temperature MUST be in Kelvin (K).", "Pressure units must match."]
  },
  {
    name: "Avogadro's Law",
    formula: "V₁/n₁ = V₂/n₂",
    definition: "Equal volumes of all gases, at the same temperature and pressure, have the same number of molecules.",
    constants: ["Pressure (P)", "Temperature (T)"],
    rules: ["n is measured in moles.", "Volume units must match."]
  },
  {
    name: "Combined Gas Law",
    formula: "(P₁V₁)/T₁ = (P₂V₂)/T₂",
    definition: "Combines Boyle's, Charles's, and Gay-Lussac's laws. The ratio of the product of pressure and volume and the absolute temperature of a gas is equal to a constant.",
    constants: ["Amount of gas (n)"],
    rules: ["Temperature MUST be in Kelvin (K).", "Pressure and Volume units must match on both sides."]
  },
  {
    name: "Ideal Gas Law",
    formula: "PV = nRT",
    definition: "The equation of state of a hypothetical ideal gas. It is a good approximation of the behavior of many gases under many conditions.",
    constants: ["R (Ideal Gas Constant)"],
    rules: [
      "Temperature MUST be in Kelvin (K).",
      "If R = 0.0821, P is in atm, V in Liters.",
      "If R = 8.314, P is in kPa, V in Liters (or m³)."
    ]
  }
];

export default function CheatSheets() {
  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl font-serif font-bold neon-text mb-2">DATA TERMINAL: CHEAT SHEETS</h1>
        <p className="font-mono text-gray-400 text-sm tracking-widest uppercase">Reference protocols and core equations</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gasLaws.map((law, idx) => (
          <motion.div
            key={law.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel p-6 flex flex-col"
          >
            <h2 className="text-xl font-bold font-mono text-white tracking-wider mb-4 border-b border-hud-border/50 pb-2">
              {law.name}
            </h2>

            <div className="bg-black/50 p-4 rounded-lg border border-hud-neon/30 text-center mb-4 flex-grow-0">
              <span className="font-mono text-2xl text-hud-neon font-bold">{law.formula}</span>
            </div>

            <div className="flex-grow space-y-4 font-sans text-sm">
              <div>
                <h3 className="text-gray-400 font-mono text-xs mb-1 uppercase tracking-wider">Definition</h3>
                <p className="text-gray-200">{law.definition}</p>
              </div>

              <div>
                <h3 className="text-gray-400 font-mono text-xs mb-1 uppercase tracking-wider">Constants</h3>
                <div className="flex flex-wrap gap-2">
                  {law.constants.map(c => (
                    <span key={c} className="px-2 py-1 bg-hud-neon/10 text-hud-neon rounded text-xs border border-hud-neon/20">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-red-400 font-mono text-xs mb-1 uppercase tracking-wider">Constraints & Rules</h3>
                <ul className="list-disc pl-4 space-y-1 text-gray-300">
                  {law.rules.map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
