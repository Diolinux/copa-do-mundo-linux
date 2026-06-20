
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Frown } from 'lucide-react';

export default function DistroCard({ 
  distro, 
  size = 'medium', 
  showBase = false, 
  className = '',
  isWinner = false,
  isLoser = false,
  animationDuration = 2500
}) {
  const [animatingWinner, setAnimatingWinner] = useState(false);
  const [animatingLoser, setAnimatingLoser] = useState(false);

  useEffect(() => {
    if (isWinner) {
      setAnimatingWinner(true);
      const timer = setTimeout(() => setAnimatingWinner(false), animationDuration);
      return () => clearTimeout(timer);
    }
  }, [isWinner, animationDuration]);

  useEffect(() => {
    if (isLoser) {
      setAnimatingLoser(true);
      const timer = setTimeout(() => setAnimatingLoser(false), animationDuration);
      return () => clearTimeout(timer);
    }
  }, [isLoser, animationDuration]);

  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl md:text-5xl',
    champion: 'text-7xl md:text-8xl'
  };

  // Generate random confetti particles
  const confettiColors = ['#10b981', '#fbbf24', '#ffffff', '#3b82f6', '#ec4899'];
  const confettiParticles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    delay: `${Math.random() * 0.5}s`,
    duration: `${1 + Math.random()}s`
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative flex flex-col items-center justify-center gap-3 p-6 bg-card rounded-2xl border border-border shadow-lg transition-colors hover:border-primary/50 
        ${animatingWinner ? 'animate-jump animate-glow z-10' : ''} 
        ${animatingLoser ? 'animate-sadness pointer-events-none' : ''} 
        ${className}`}
    >
      {/* Confetti Overlay for Winner */}
      {animatingWinner && (
        <div className="absolute inset-0 overflow-visible pointer-events-none z-20">
          {confettiParticles.map(p => (
            <div
              key={p.id}
              className="absolute w-2 h-2 rounded-sm animate-confetti"
              style={{
                left: p.left,
                backgroundColor: p.color,
                animationDelay: p.delay,
                animationDuration: p.duration,
                top: '-10px'
              }}
            />
          ))}
        </div>
      )}

      {/* Sad Overlay for Loser */}
      {animatingLoser && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/40 rounded-2xl z-20 backdrop-blur-[1px]">
          <Frown className="w-16 h-16 text-muted-foreground opacity-80 drop-shadow-lg" />
        </div>
      )}

      <a
        href={`https://www.google.com/search?q=${encodeURIComponent(distro.name + ' Linux')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-3 right-3 p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all duration-200 z-30"
        title={`Pesquisar ${distro.name} no Google`}
        onClick={(e) => e.stopPropagation()}
      >
        <Search className="w-5 h-5" />
      </a>

      <div className={`${sizeClasses[size]} leading-none pt-4 relative z-10 flex items-center justify-center gap-2`}>
        <span>{distro.emoji}</span>
      </div>
      
      <div className="text-center relative z-10 mt-2">
        <h3 className={`font-bold text-card-foreground ${size === 'champion' ? 'text-4xl md:text-5xl mb-4' : size === 'large' ? 'text-2xl md:text-3xl' : size === 'medium' ? 'text-xl' : 'text-base'}`}>
          {distro.name}
        </h3>
        
        {distro.description && size !== 'small' && (
          <p className="text-sm text-muted-foreground/80 mt-1 mx-auto max-w-[200px] hidden md:block">
            {distro.description}
          </p>
        )}
        
        {showBase && (
          <div className="flex flex-col gap-1 mt-3">
            <span className="text-xs font-semibold px-2 py-1 bg-secondary text-secondary-foreground rounded-full inline-block mx-auto">
              Base: {distro.base}
            </span>
            <span className="text-xs font-medium px-2 py-1 bg-muted text-muted-foreground rounded-full inline-block mx-auto flex items-center gap-1">
              Origem: {distro.flag}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
