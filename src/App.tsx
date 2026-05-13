import { Routes, Route } from 'react-router-dom';
import PortfolioHome from './components/PortfolioHome';
import GamePlatform from './components/GamePlatform';

export default function App() {
  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900 font-sans text-slate-900">
      <Routes>
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/game-platform" element={<GamePlatform />} />
      </Routes>
    </div>
  );
}
