import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CheatSheets from './pages/CheatSheets';
import Flashcards from './pages/Flashcards';
import Glossary from './pages/Glossary';
import Calculators from './pages/Calculators';
import Quiz from './pages/Quiz';

function App() {
  return (
    <Router>
      <div className="min-h-screen pt-20 pb-10 flex flex-col relative">
        <Navbar />
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cheatsheets" element={<CheatSheets />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
