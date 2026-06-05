import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import GasVisualizer from '../components/GasVisualizer';

const LAWS = {
  IDEAL: 'Ideal Gas Law (PV = nRT)',
  COMBINED: 'Combined Gas Law (P₁V₁/T₁ = P₂V₂/T₂)',
  BOYLE: "Boyle's Law (P₁V₁ = P₂V₂)",
  CHARLES: "Charles's Law (V₁/T₁ = V₂/T₂)",
  GAY_LUSSAC: "Gay-Lussac's Law (P₁/T₁ = P₂/T₂)",
  AVOGADRO: "Avogadro's Law (V₁/n₁ = V₂/n₂)"
};

const R_CONSTANTS = [
  { value: 0.0821, label: '0.0821 L·atm/(mol·K)' },
  { value: 8.314, label: '8.314 L·kPa/(mol·K)' },
  { value: 62.36, label: '62.36 L·mmHg/(mol·K)' }
];

export default function Calculators() {
  const [selectedLaw, setSelectedLaw] = useState(LAWS.IDEAL);
  const [solveFor, setSolveFor] = useState('');
  const [inputs, setInputs] = useState({});
  const [constantR, setConstantR] = useState(R_CONSTANTS[0].value);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState('');

  // 3D Visualizer state
  const [simTemp, setSimTemp] = useState(298);
  const [simPress, setSimPress] = useState(1);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: parseFloat(e.target.value) });
  };

  const updateSimulationParams = (temp, press) => {
    if (!isNaN(temp)) setSimTemp(temp);
    if (!isNaN(press)) setSimPress(press);
  };

  const calculate = () => {
    setError('');
    setSteps([]);
    let newSteps = [];

    const formatNum = (num) => Number.isFinite(num) ? Number(num.toPrecision(4)) : 'NaN';

    try {
      if (selectedLaw === LAWS.IDEAL) {
        const { P, V, n, T } = inputs;
        const R = constantR;

        if (solveFor === 'P') {
          if (!V || !n || !T) throw new Error("Missing required fields (V, n, T).");
          if (V === 0) throw new Error("Division by zero: Volume cannot be zero.");
          const ans = (n * R * T) / V;
          newSteps = [
            "1. State formula: P = (nRT) / V",
            `2. Substitute values: P = (${n} * ${R} * ${T}) / ${V}`,
            `3. Calculate numerator (nRT): ${formatNum(n * R * T)}`,
            `4. Final calculation: P = ${formatNum(ans)}`
          ];
          updateSimulationParams(T, ans);
        } else if (solveFor === 'V') {
          if (!P || !n || !T) throw new Error("Missing required fields (P, n, T).");
          if (P === 0) throw new Error("Division by zero: Pressure cannot be zero.");
          const ans = (n * R * T) / P;
          newSteps = [
            "1. State formula: V = (nRT) / P",
            `2. Substitute values: V = (${n} * ${R} * ${T}) / ${P}`,
            `3. Calculate numerator (nRT): ${formatNum(n * R * T)}`,
            `4. Final calculation: V = ${formatNum(ans)}`
          ];
          updateSimulationParams(T, P);
        } else if (solveFor === 'n') {
          if (!P || !V || !T) throw new Error("Missing required fields (P, V, T).");
          if (T === 0 || R === 0) throw new Error("Division by zero: Temperature or R cannot be zero.");
          const ans = (P * V) / (R * T);
          newSteps = [
            "1. State formula: n = (PV) / (RT)",
            `2. Substitute values: n = (${P} * ${V}) / (${R} * ${T})`,
            `3. Final calculation: n = ${formatNum(ans)}`
          ];
          updateSimulationParams(T, P);
        } else if (solveFor === 'T') {
          if (!P || !V || !n) throw new Error("Missing required fields (P, V, n).");
          if (n === 0 || R === 0) throw new Error("Division by zero: Moles or R cannot be zero.");
          const ans = (P * V) / (n * R);
          newSteps = [
            "1. State formula: T = (PV) / (nR)",
            `2. Substitute values: T = (${P} * ${V}) / (${n} * ${R})`,
            `3. Final calculation: T = ${formatNum(ans)}`
          ];
          updateSimulationParams(ans, P);
        }

      } else if (selectedLaw === LAWS.COMBINED) {
        const { P1, V1, T1, P2, V2, T2 } = inputs;
        if (solveFor === 'P2') {
          if (!P1 || !V1 || !T1 || !V2 || !T2) throw new Error("Missing fields.");
          if (V2 === 0 || T1 === 0) throw new Error("Division by zero.");
          const ans = (P1 * V1 * T2) / (T1 * V2);
          newSteps = [
            "1. State formula: (P₁V₁)/T₁ = (P₂V₂)/T₂",
            "2. Rearrange for P₂: P₂ = (P₁V₁T₂) / (T₁V₂)",
            `3. Substitute: P₂ = (${P1} * ${V1} * ${T2}) / (${T1} * ${V2})`,
            `4. Final calculation: P₂ = ${formatNum(ans)}`
          ];
          updateSimulationParams(T2, ans);
        } else if (solveFor === 'V2') {
          if (!P1 || !V1 || !T1 || !P2 || !T2) throw new Error("Missing fields.");
          if (P2 === 0 || T1 === 0) throw new Error("Division by zero.");
          const ans = (P1 * V1 * T2) / (T1 * P2);
          newSteps = [
            "1. State formula: (P₁V₁)/T₁ = (P₂V₂)/T₂",
            "2. Rearrange for V₂: V₂ = (P₁V₁T₂) / (T₁P₂)",
            `3. Substitute: V₂ = (${P1} * ${V1} * ${T2}) / (${T1} * ${P2})`,
            `4. Final calculation: V₂ = ${formatNum(ans)}`
          ];
          updateSimulationParams(T2, P2);
        } else if (solveFor === 'T2') {
          if (!P1 || !V1 || !T1 || !P2 || !V2) throw new Error("Missing fields.");
          if (P1 === 0 || V1 === 0) throw new Error("Division by zero.");
          const ans = (P2 * V2 * T1) / (P1 * V1);
          newSteps = [
            "1. State formula: (P₁V₁)/T₁ = (P₂V₂)/T₂",
            "2. Rearrange for T₂: T₂ = (P₂V₂T₁) / (P₁V₁)",
            `3. Substitute: T₂ = (${P2} * ${V2} * ${T1}) / (${P1} * ${V1})`,
            `4. Final calculation: T₂ = ${formatNum(ans)}`
          ];
          updateSimulationParams(ans, P2);
        }
      } else if (selectedLaw === LAWS.BOYLE) {
        const { P1, V1, P2, V2 } = inputs;
        if (solveFor === 'P2') {
          if (!P1 || !V1 || !V2) throw new Error("Missing fields.");
          if (V2 === 0) throw new Error("Division by zero.");
          const ans = (P1 * V1) / V2;
          newSteps = [
            "1. State formula: P₁V₁ = P₂V₂",
            "2. Rearrange for P₂: P₂ = (P₁V₁) / V₂",
            `3. Substitute: P₂ = (${P1} * ${V1}) / ${V2}`,
            `4. Final calculation: P₂ = ${formatNum(ans)}`
          ];
          updateSimulationParams(298, ans);
        } else if (solveFor === 'V2') {
          if (!P1 || !V1 || !P2) throw new Error("Missing fields.");
          if (P2 === 0) throw new Error("Division by zero.");
          const ans = (P1 * V1) / P2;
          newSteps = [
            "1. State formula: P₁V₁ = P₂V₂",
            "2. Rearrange for V₂: V₂ = (P₁V₁) / P₂",
            `3. Substitute: V₂ = (${P1} * ${V1}) / ${P2}`,
            `4. Final calculation: V₂ = ${formatNum(ans)}`
          ];
          updateSimulationParams(298, P2);
        }
      } else if (selectedLaw === LAWS.CHARLES) {
        const { V1, T1, V2, T2 } = inputs;
        if (solveFor === 'V2') {
          if (!V1 || !T1 || !T2) throw new Error("Missing fields.");
          if (T1 === 0) throw new Error("Division by zero.");
          const ans = (V1 * T2) / T1;
          newSteps = [
            "1. State formula: V₁/T₁ = V₂/T₂",
            "2. Rearrange for V₂: V₂ = (V₁T₂) / T₁",
            `3. Substitute: V₂ = (${V1} * ${T2}) / ${T1}`,
            `4. Final calculation: V₂ = ${formatNum(ans)}`
          ];
          updateSimulationParams(T2, 1);
        } else if (solveFor === 'T2') {
          if (!V1 || !T1 || !V2) throw new Error("Missing fields.");
          if (V1 === 0) throw new Error("Division by zero.");
          const ans = (V2 * T1) / V1;
          newSteps = [
            "1. State formula: V₁/T₁ = V₂/T₂",
            "2. Rearrange for T₂: T₂ = (V₂T₁) / V₁",
            `3. Substitute: T₂ = (${V2} * ${T1}) / ${V1}`,
            `4. Final calculation: T₂ = ${formatNum(ans)}`
          ];
          updateSimulationParams(ans, 1);
        }
      } else if (selectedLaw === LAWS.GAY_LUSSAC) {
        const { P1, T1, P2, T2 } = inputs;
        if (solveFor === 'P2') {
          if (!P1 || !T1 || !T2) throw new Error("Missing fields.");
          if (T1 === 0) throw new Error("Division by zero.");
          const ans = (P1 * T2) / T1;
          newSteps = [
            "1. State formula: P₁/T₁ = P₂/T₂",
            "2. Rearrange for P₂: P₂ = (P₁T₂) / T₁",
            `3. Substitute: P₂ = (${P1} * ${T2}) / ${T1}`,
            `4. Final calculation: P₂ = ${formatNum(ans)}`
          ];
          updateSimulationParams(T2, ans);
        } else if (solveFor === 'T2') {
          if (!P1 || !T1 || !P2) throw new Error("Missing fields.");
          if (P1 === 0) throw new Error("Division by zero.");
          const ans = (P2 * T1) / P1;
          newSteps = [
            "1. State formula: P₁/T₁ = P₂/T₂",
            "2. Rearrange for T₂: T₂ = (P₂T₁) / P₁",
            `3. Substitute: T₂ = (${P2} * ${T1}) / ${P1}`,
            `4. Final calculation: T₂ = ${formatNum(ans)}`
          ];
          updateSimulationParams(ans, P2);
        }
      } else if (selectedLaw === LAWS.AVOGADRO) {
        const { V1, n1, V2, n2 } = inputs;
        if (solveFor === 'V2') {
          if (!V1 || !n1 || !n2) throw new Error("Missing fields.");
          if (n1 === 0) throw new Error("Division by zero.");
          const ans = (V1 * n2) / n1;
          newSteps = [
            "1. State formula: V₁/n₁ = V₂/n₂",
            "2. Rearrange for V₂: V₂ = (V₁n₂) / n₁",
            `3. Substitute: V₂ = (${V1} * ${n2}) / ${n1}`,
            `4. Final calculation: V₂ = ${formatNum(ans)}`
          ];
          updateSimulationParams(298, 1);
        } else if (solveFor === 'n2') {
          if (!V1 || !n1 || !V2) throw new Error("Missing fields.");
          if (V1 === 0) throw new Error("Division by zero.");
          const ans = (V2 * n1) / V1;
          newSteps = [
            "1. State formula: V₁/n₁ = V₂/n₂",
            "2. Rearrange for n₂: n₂ = (V₂n₁) / V₁",
            `3. Substitute: n₂ = (${V2} * ${n1}) / ${V1}`,
            `4. Final calculation: n₂ = ${formatNum(ans)}`
          ];
          updateSimulationParams(298, 1);
        }
      }


      // Fallback for missing implementations in this demo snippet
      if (newSteps.length === 0) {
        throw new Error("Calculation logic for this specific selection is under development.");
      }

      setSteps(newSteps);
    } catch (err) {
      setError(err.message);
    }
  };

  const renderInputs = () => {
    let vars = [];
    if (selectedLaw === LAWS.IDEAL) vars = ['P', 'V', 'n', 'T'];
    if (selectedLaw === LAWS.COMBINED) vars = ['P1', 'V1', 'T1', 'P2', 'V2', 'T2'];
    if (selectedLaw === LAWS.BOYLE) vars = ['P1', 'V1', 'P2', 'V2'];
    if (selectedLaw === LAWS.CHARLES) vars = ['V1', 'T1', 'V2', 'T2'];
    if (selectedLaw === LAWS.GAY_LUSSAC) vars = ['P1', 'T1', 'P2', 'T2'];
    if (selectedLaw === LAWS.AVOGADRO) vars = ['V1', 'n1', 'V2', 'n2'];

    return vars.filter(v => v !== solveFor).map(v => (
      <div key={v} className="flex flex-col gap-1">
        <label className="font-mono text-hud-neon text-xs">{v}</label>
        <input
          type="number"
          name={v}
          onChange={handleInputChange}
          className="hud-input"
          placeholder={`Enter ${v}...`}
        />
      </div>
    ));
  };

  return (
    <div className="py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

      {/* Left Panel: Calculator Inputs */}
      <div className="glass-panel p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-serif font-bold neon-text uppercase border-b border-hud-border/50 pb-4">
          Precision Solver
        </h1>

        <div className="flex flex-col gap-2">
          <label className="font-mono text-gray-400 text-xs uppercase">Select Operational Protocol (Gas Law)</label>
          <select
            className="hud-input appearance-none"
            value={selectedLaw}
            onChange={(e) => { setSelectedLaw(e.target.value); setSolveFor(''); setSteps([]); setInputs({}); }}
          >
            {Object.values(LAWS).map(law => <option key={law} value={law}>{law}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-mono text-gray-400 text-xs uppercase">Target Variable</label>
          <select
            className="hud-input appearance-none"
            value={solveFor}
            onChange={(e) => { setSolveFor(e.target.value); setSteps([]); }}
          >
            <option value="">-- Select Variable to Solve For --</option>
            {selectedLaw === LAWS.IDEAL && <><option value="P">Pressure (P)</option><option value="V">Volume (V)</option><option value="n">Moles (n)</option><option value="T">Temperature (T)</option></>}
            {selectedLaw === LAWS.COMBINED && <><option value="P2">Final Pressure (P2)</option><option value="V2">Final Volume (V2)</option><option value="T2">Final Temp (T2)</option></>}
            {/* Add others as needed */}
          </select>
        </div>

        {selectedLaw === LAWS.IDEAL && (
          <div className="flex flex-col gap-2">
            <label className="font-mono text-gray-400 text-xs uppercase">R Constant</label>
            <div className="flex gap-2">
              {R_CONSTANTS.map(r => (
                <button
                  key={r.value}
                  onClick={() => setConstantR(r.value)}
                  className={`flex-1 py-2 rounded font-mono text-xs border transition-all ${constantR === r.value ? 'bg-hud-neon/20 border-hud-neon text-hud-neon shadow-[inset_0_0_10px_rgba(0,255,255,0.5)]' : 'bg-black/40 border-hud-border text-gray-400 hover:border-hud-neon/50'}`}
                >
                  {constantR === r.value && (
                    <motion.div layoutId="constant-snap" className="absolute w-full h-full inset-0 bg-hud-neon/10 rounded" />
                  )}
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {solveFor && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-2 gap-4"
            >
              {renderInputs()}
            </motion.div>
          </AnimatePresence>
        )}

        <button
          onClick={calculate}
          disabled={!solveFor}
          className="hud-button mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          INITIATE CALCULATION SEQUENCE
        </button>
      </div>

      {/* Right Panel: Output & Visualization */}
      <div className="flex flex-col gap-6">

        {/* 3D Gas Visualizer */}
        <div className="glass-panel h-64 relative overflow-hidden border-t-2 border-hud-neon/50">
          <div className="absolute top-2 left-2 z-10 font-mono text-xs text-hud-neon/80 bg-black/50 px-2 py-1 rounded">
            SIMULATION FEED: T={simTemp.toFixed(1)}K, P={simPress.toFixed(2)}atm
          </div>
          <Canvas camera={{ position: [0, 0, 15] }}>
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
            <GasVisualizer temperature={simTemp} pressure={simPress} />
          </Canvas>
        </div>

        {/* Output Console */}
        <div className="glass-panel flex-grow p-6 relative overflow-hidden">
          <h2 className="font-mono text-hud-neon mb-4 tracking-widest border-b border-hud-border/50 pb-2">
            &gt; LOGIC TRACE TERMINAL
          </h2>

          {error && (
            <div className="text-hud-error font-mono text-sm bg-hud-error/10 border border-hud-error/50 p-3 rounded">
              [ERR] {error}
            </div>
          )}

          <div className="font-mono text-sm space-y-4">
            <AnimatePresence>
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  transition={{ delay: idx * 0.5, duration: 0.5 }}
                  className="flex gap-4 items-start"
                >
                  <span className="text-gray-500">{`[${String(idx + 1).padStart(2, '0')}]`}</span>
                  <span className={`${idx === steps.length - 1 ? 'text-hud-neon font-bold drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]' : 'text-gray-300'}`}>
                    {step}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>

            {steps.length === 0 && !error && (
              <div className="text-gray-600 animate-pulse">
                &gt; Awaiting input parameters...
              </div>
            )}
          </div>

          {/* Scanning line animation */}
          {steps.length > 0 && (
            <motion.div
              initial={{ top: '-10%' }}
              animate={{ top: '110%' }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-hud-neon opacity-20 shadow-neon pointer-events-none"
            />
          )}
        </div>

      </div>

    </div>
  );
}
