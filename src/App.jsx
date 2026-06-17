import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Soundboard from './pages/Soundboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen pt-20 pb-10 flex flex-col relative">
        <Navbar />
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Routes>
            <Route path="/" element={<Soundboard />} />
            <Route path="*" element={<Soundboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
