
import React, { useEffect } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { GameProvider, useTheme } from '@/context/GameContext.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import HomePage from '@/pages/HomePage.jsx';
import GroupStageScreen from '@/pages/GroupStageScreen.jsx';
import KnockoutStageScreen from '@/pages/KnockoutStageScreen.jsx';
import ChampionScreen from '@/pages/ChampionScreen.jsx';

function ThemeRoot({ children }) {
  const { theme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return children;
}

function App() {
  return (
    <GameProvider>
      <ThemeRoot>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/group-stage" element={<GroupStageScreen />} />
            <Route path="/knockout" element={<KnockoutStageScreen />} />
            <Route path="/champion" element={<ChampionScreen />} />
          </Routes>
        </Router>
      </ThemeRoot>
    </GameProvider>
  );
}

export default App;
