import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateQuizQuestions } from '../utils/quizGenerator';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';


const AVAILABLE_LAWS = [
  "Boyle's Law",
  "Charles's Law",
  "Gay-Lussac's Law",
  "Avogadro's Law",
  "Combined Gas Law",
  "Ideal Gas Law"
];


export default function Quiz() {
  const [phase, setPhase] = useState('config'); // config, active, results
  const [numQuestions, setNumQuestions] = useState(5);
  const [selectedLaws, setSelectedLaws] = useState(["Boyle's Law", "Ideal Gas Law"]);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('gas-law-quiz-history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const toggleLaw = (law) => {
    setSelectedLaws(prev =>
      prev.includes(law) ? prev.filter(l => l !== law) : [...prev, law]
    );
  };

  const startQuiz = () => {
    if (selectedLaws.length === 0) return alert("Select at least one law.");
    const generated = generateQuizQuestions(numQuestions, selectedLaws);
    setQuestions(generated);
    setCurrentIndex(0);
    setUserAnswers({});
    setScore(0);
    setPhase('active');
  };

  const handleAnswer = (ans) => {
    setUserAnswers(prev => ({ ...prev, [currentIndex]: ans }));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    let finalScore = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) finalScore++;
    });
    setScore(finalScore);

    const newRecord = {
      date: new Date().toLocaleDateString(),
      score: finalScore,
      total: questions.length,
      percentage: Math.round((finalScore / questions.length) * 100),
      topics: selectedLaws.join(', ')
    };

    const updatedHistory = [newRecord, ...history].slice(0, 10); // keep last 10
    setHistory(updatedHistory);
    localStorage.setItem('gas-law-quiz-history', JSON.stringify(updatedHistory));

    setPhase('results');
  };

  return (
    <div className="py-8 w-full max-w-4xl mx-auto min-h-[calc(100vh-8rem)] flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-serif font-bold neon-text mb-2 uppercase">Simulation Lab</h1>
        <p className="font-mono text-gray-400 text-sm tracking-widest uppercase">Assess operational readiness</p>
      </motion.div>

      {phase === 'config' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel p-6">
            <h2 className="font-mono text-hud-neon mb-6 border-b border-hud-border pb-2">Configuration Parameters</h2>

            <div className="mb-6">
              <label className="font-mono text-xs text-gray-400 block mb-2">TARGET PROTOCOLS</label>
              <div className="space-y-2">
                {AVAILABLE_LAWS.map(law => (
                  <label key={law} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-white/5 transition-colors">
                    <div className={`w-5 h-5 border flex items-center justify-center rounded transition-colors ${selectedLaws.includes(law) ? 'bg-hud-neon border-hud-neon text-black' : 'border-hud-border text-transparent'}`}>
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="font-mono text-sm text-gray-200">{law}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="font-mono text-xs text-gray-400 block mb-2 flex justify-between">
                <span>CYCLE COUNT</span>
                <span className="text-hud-neon">{numQuestions} Questions</span>
              </label>
              <input
                type="range"
                min="3" max="20"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="w-full accent-hud-neon"
              />
            </div>

            <button onClick={startQuiz} className="hud-button w-full shadow-neon">
              INITIATE SIMULATION
            </button>
          </div>

          <div className="glass-panel p-6 flex flex-col">
            <h2 className="font-mono text-hud-neon mb-6 border-b border-hud-border pb-2">Operational History</h2>
            <div className="flex-grow overflow-y-auto space-y-3">
              {history.length === 0 ? (
                <p className="text-gray-500 font-mono text-sm text-center mt-10">No prior simulations recorded.</p>
              ) : (
                history.map((record, i) => (
                  <div key={i} className="bg-black/30 p-3 rounded border border-hud-border/50 flex justify-between items-center">
                    <div>
                      <div className="font-mono text-xs text-gray-400">{record.date}</div>
                      <div className="font-mono text-[10px] text-gray-500 max-w-[150px] truncate">{record.topics}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-mono font-bold ${record.percentage >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                        {record.percentage}%
                      </div>
                      <div className="font-mono text-[10px] text-gray-400">{record.score}/{record.total}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {phase === 'active' && questions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8 max-w-2xl mx-auto w-full relative"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
            <motion.div
              className="h-full bg-hud-neon"
              initial={{ width: `${(currentIndex / questions.length) * 100}%` }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="flex justify-between items-center mb-8 font-mono text-sm text-gray-400 mt-4">
            <span className="text-hud-neon bg-hud-neon/10 px-2 py-1 rounded">
              {questions[currentIndex].law}
            </span>
            <span>Query {currentIndex + 1} of {questions.length}</span>
          </div>

          <h3 className="text-xl font-sans text-white leading-relaxed mb-8">
            {questions[currentIndex].questionText}
          </h3>

          <div className="space-y-3 mb-8">
            {questions[currentIndex].options.map((opt, i) => {
              const isSelected = userAnswers[currentIndex] === opt;
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className={`w-full text-left p-4 rounded-lg border font-mono transition-all ${
                    isSelected
                      ? 'bg-hud-neon/20 border-hud-neon text-hud-neon shadow-[inset_0_0_15px_rgba(0,255,255,0.3)]'
                      : 'bg-black/40 border-hud-border text-gray-300 hover:border-hud-neon/50'
                  }`}
                >
                  <span className="mr-4 text-gray-500">[{String.fromCharCode(65 + i)}]</span>
                  {opt} {questions[currentIndex].unit}
                </button>
              );
            })}
          </div>

          <button
            onClick={nextQuestion}
            disabled={userAnswers[currentIndex] === undefined}
            className="hud-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentIndex === questions.length - 1 ? 'TERMINATE & EVALUATE' : 'PROCESS NEXT QUERY'}
          </button>
        </motion.div>
      )}

      {phase === 'results' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <div className="glass-panel p-8 text-center flex flex-col items-center justify-center border-t-4 border-hud-neon">
            <h2 className="font-mono text-2xl text-white mb-2">SIMULATION COMPLETE</h2>
            <div className="text-6xl font-bold font-mono my-4 neon-text">
              {Math.round((score / questions.length) * 100)}%
            </div>
            <p className="font-mono text-gray-400 uppercase tracking-widest">
              Success Rate: {score} / {questions.length} Protocols
            </p>
            <button onClick={() => setPhase('config')} className="hud-button mt-6">
              RETURN TO CONFIGURATION
            </button>
          </div>

          <div className="space-y-6">
            <h3 className="font-mono text-hud-neon uppercase tracking-widest border-b border-hud-border pb-2">
              Post-Action Diagnostic Review
            </h3>
            {questions.map((q, idx) => {
              const userAns = userAnswers[idx];
              const isCorrect = userAns === q.correctAnswer;

              return (
                <div key={idx} className={`glass-panel p-6 border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`mt-1 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                      {isCorrect ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
                    </div>
                    <div>
                      <h4 className="font-sans text-gray-200 mb-2">{q.questionText}</h4>
                      <div className="font-mono text-sm mb-1">
                        <span className="text-gray-500">Your Output: </span>
                        <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>{userAns} {q.unit}</span>
                      </div>
                      {!isCorrect && (
                        <div className="font-mono text-sm text-hud-neon">
                          <span className="text-gray-500">Target Value: </span>
                          {q.correctAnswer} {q.unit}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step-by-step logic reveal */}
                  <div className="mt-4 bg-black/50 p-4 rounded-lg border border-hud-border relative overflow-hidden">
                    <h5 className="font-mono text-xs text-hud-neon/70 mb-2 uppercase">Logic Trace Override:</h5>
                    <div className="font-mono text-sm space-y-1 relative z-10 text-gray-300">
                      {q.explanation.map((step, sIdx) => (
                        <div key={sIdx} className={sIdx === q.explanation.length - 1 ? 'text-hud-neon mt-2 font-bold' : ''}>
                          {step}
                        </div>
                      ))}
                    </div>
                    {/* Scanning glow effect */}
                    <motion.div
                      initial={{ top: '-20%' }}
                      animate={{ top: '120%' }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent via-hud-neon/10 to-transparent pointer-events-none z-0"
                    />
                  </div>

                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
