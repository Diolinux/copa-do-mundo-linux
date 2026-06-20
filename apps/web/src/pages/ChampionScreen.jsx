
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext.jsx';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import DistroCard from '@/components/DistroCard.jsx';
import ShareButton from '@/components/ShareButton.jsx';

export default function ChampionScreen() {
  const navigate = useNavigate();
  const { championDistro, resetGame } = useGame();

  useEffect(() => {
    if (!championDistro) {
      navigate('/');
    }
  }, [championDistro, navigate]);

  const handlePlayAgain = () => {
    resetGame();
    navigate('/');
  };

  if (!championDistro) {
    return null;
  }

  // Confetti particles
  const confettiCount = 50;
  const confettiColors = ['#10b981', '#fbbf24', '#3b82f6', '#ec4899', '#8b5cf6'];

  return (
    <>
      <Helmet>
        <title>{`${championDistro.name} é Campeã! - Copa do Mundo de Distros Linux`}</title>
        <meta name="description" content={`${championDistro.name} venceu a Copa do Mundo de Distros Linux!`} />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
        {/* Confetti Animation */}
        {Array.from({ length: confettiCount }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              backgroundColor: confettiColors[i % confettiColors.length],
              left: `${Math.random() * 100}%`,
              top: '-10%'
            }}
            animate={{
              y: ['0vh', '110vh'],
              x: [0, (Math.random() - 0.5) * 200],
              rotate: [0, Math.random() * 720],
              opacity: [1, 0.8, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'linear'
            }}
          />
        ))}

        <Header />

        <main className="flex-1 flex items-center justify-center py-12 relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
            >
              {/* Trophy Icon */}
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="flex justify-center mb-8"
              >
                <Trophy className="w-32 h-32 text-accent drop-shadow-2xl" />
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-primary-foreground mb-10 leading-tight"
                style={{ letterSpacing: '-0.02em', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
              >
                Campeã da Copa
              </motion.h1>

              {/* Champion Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-12 flex flex-col items-center"
              >
                <DistroCard 
                  distro={championDistro} 
                  size="champion" 
                  showBase={true}
                  className="bg-card/95 backdrop-blur-sm shadow-2xl border-4 border-accent max-w-xl w-full mx-auto"
                />
                
                <div className="flex items-center justify-center gap-2 mt-8 bg-card/10 backdrop-blur-md px-6 py-3 rounded-full border border-primary-foreground/20">
                  <Sparkles className="w-6 h-6 text-accent" />
                  <p className="text-xl md:text-2xl font-bold text-accent drop-shadow-sm">
                    Distribuição Campeã Definitiva
                  </p>
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
              </motion.div>

              {/* Share Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-12"
              >
                <p className="text-xl text-primary-foreground/90 mb-6 font-medium">
                  Compartilhe o resultado com a comunidade Linux
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <ShareButton distroName={championDistro.name} platform="twitter" />
                  <ShareButton distroName={championDistro.name} platform="facebook" />
                  <ShareButton distroName={championDistro.name} platform="whatsapp" />
                </div>
              </motion.div>

              {/* Play Again Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Button
                  onClick={handlePlayAgain}
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 text-xl px-12 py-8 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95 font-bold"
                >
                  <RotateCcw className="w-6 h-6 mr-3" />
                  Jogar Novamente
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
