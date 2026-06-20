
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SpinningWheel({ criteria, onSpinComplete, disabled = false }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedCriterion, setSelectedCriterion] = useState(null);
  const [rotation, setRotation] = useState(0);

  const handleSpin = () => {
    if (isSpinning || disabled) return;

    setIsSpinning(true);
    setSelectedCriterion(null);

    // Random rotation between 1440 and 2160 degrees (4-6 full spins)
    const randomRotation = 1440 + Math.random() * 720;
    const finalRotation = rotation + randomRotation;
    
    setRotation(finalRotation);

    // After animation completes, select random criterion
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * criteria.length);
      const selected = criteria[randomIndex];
      setSelectedCriterion(selected);
      setIsSpinning(false);
      onSpinComplete(selected);
    }, 3000);
  };

  const segmentAngle = 360 / criteria.length;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-80 h-80 md:w-96 md:h-96">
        {/* Wheel container */}
        <motion.div
          className="absolute inset-0 rounded-full border-8 border-primary shadow-2xl overflow-hidden"
          style={{
            background: 'conic-gradient(from 0deg, ' + 
              criteria.map((c, i) => `${c.color} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`).join(', ') + 
              ')'
          }}
          animate={{ rotate: rotation }}
          transition={{ duration: 3, ease: "easeOut" }}
        >
          {/* Criterion labels */}
          {criteria.map((criterion, index) => {
            const angle = (index * segmentAngle) + (segmentAngle / 2);
            const radian = (angle * Math.PI) / 180;
            const radius = 120;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;

            return (
              <div
                key={criterion.id}
                className="absolute top-1/2 left-1/2 text-white text-xs font-bold text-center"
                style={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle + 90}deg)`,
                  width: '80px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                {criterion.name}
              </div>
            );
          })}
        </motion.div>

        {/* Center button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            onClick={handleSpin}
            disabled={isSpinning || disabled}
            size="lg"
            className="w-24 h-24 rounded-full bg-accent text-accent-foreground shadow-2xl hover:scale-110 transition-all duration-200 active:scale-95"
          >
            <Sparkles className="w-8 h-8" />
          </Button>
        </div>

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-destructive z-10 drop-shadow-lg" />
      </div>

      {/* Selected criterion display */}
      {selectedCriterion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary text-primary-foreground px-8 py-4 rounded-xl shadow-lg"
        >
          <p className="text-sm font-medium">Critério selecionado:</p>
          <p className="text-2xl font-bold mt-1">{selectedCriterion.name}</p>
        </motion.div>
      )}

      {!selectedCriterion && !isSpinning && (
        <p className="text-muted-foreground text-center">
          Clique no centro da roda para girar
        </p>
      )}

      {isSpinning && (
        <p className="text-primary font-semibold animate-pulse">
          Girando a roda...
        </p>
      )}
    </div>
  );
}
