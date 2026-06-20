
import React from 'react';
import { useGame, useTheme } from '@/context/GameContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Trophy, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  const { gamePhase } = useGame();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const phaseNames = {
    home: '',
    groupStage: 'Fase de Grupos',
    knockout: 'Fase Eliminatória',
    champion: 'Campeão'
  };

  const isHomePage = location.pathname === '/';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-accent drop-shadow-md" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold" style={{ letterSpacing: '-0.02em' }}>
                Copa do Mundo de Distros
              </h1>
              {phaseNames[gamePhase] && (
                <p className="text-sm text-primary-foreground/80 font-medium">
                  {phaseNames[gamePhase]}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground rounded-full transition-colors"
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {!isHomePage && (
              <Button
                onClick={() => navigate('/')}
                variant="secondary"
                size="sm"
                className="gap-2 shadow-sm font-semibold"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Voltar ao Início</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
