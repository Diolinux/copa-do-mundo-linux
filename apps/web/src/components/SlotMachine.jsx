
import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const emojiMapping = {
  1: "❤️",  // Facilidade de uso
  2: "🏗️",  // Estabilidade
  3: "👥",  // Comunidade ativa
  4: "📚",  // Documentação
  5: "⚡",  // Performance
  6: "🛡️",  // Segurança
  7: "🎨",  // Customização
  8: "🖥️",  // Suporte a hardware
  9: "📦",  // Repositórios
  10: "📅", // Atualizações
  11: "📌", // Interface gráfica
  12: "🔒", // Privacidade
  13: "⚙️",  // Leveza do sistema
  14: "🔧", // Compatibilidade
  15: "🎯", // Inovação
  16: "🆓", // Filosofia open source
  17: "💾", // Ferramentas incluídas
  18: "🎮", // Facilidade de instalação
  19: "💰", // Suporte corporativo
  20: "🔐"  // Popularidade
};

export default function SlotMachine({ criteria, onSpinComplete, disabled = false }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [selectedCriterion, setSelectedCriterion] = useState(null);
  
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();
  const leverControls = useAnimation();

  const stripLength = 30;
  const targetIndex = stripLength - 3; // Land near the end

  const [reel1Items, setReel1Items] = useState([]);
  const [reel2Items, setReel2Items] = useState([]);
  const [reel3Items, setReel3Items] = useState([]);

  // Random delays for the celebration lights
  const [lightDelays, setLightDelays] = useState([]);

  // Generate a randomized strip of criteria emojis
  const generateStrip = (winner = null, forceWinnerAtIndex = null) => {
    const items = [];
    for (let i = 0; i < stripLength; i++) {
      items.push(criteria[Math.floor(Math.random() * criteria.length)]);
    }
    if (winner && forceWinnerAtIndex !== null) {
      items[forceWinnerAtIndex] = winner;
    }
    return items;
  };

  useEffect(() => {
    // Initial random reels setup
    setReel1Items(generateStrip());
    setReel2Items(generateStrip());
    setReel3Items(generateStrip());
    
    // Generate random staggered delays for the 7 blinking lights
    setLightDelays([...Array(7)].map(() => Math.random() * 0.5));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criteria]);

  const handleSpin = async () => {
    if (isSpinning || disabled) return;

    setIsSpinning(true);
    setIsCelebrating(false);
    setSelectedCriterion(null);

    // Pick the winning criterion
    const winningIndex = Math.floor(Math.random() * criteria.length);
    const winner = criteria[winningIndex];

    // Populate independent reels that converge perfectly at targetIndex
    setReel1Items(generateStrip(winner, targetIndex));
    setReel2Items(generateStrip(winner, targetIndex));
    setReel3Items(generateStrip(winner, targetIndex));

    // Lever pull animation
    await leverControls.start({ rotate: 60, transition: { duration: 0.2, ease: "easeOut" } });
    leverControls.start({ rotate: 0, transition: { type: "spring", stiffness: 150, damping: 10 } });

    const itemHeight = 64; // 4rem (h-16)
    const targetY = -(targetIndex - 1) * itemHeight; // Centers targetIndex perfectly

    // Spin animations with deceleration
    const spinConfig = {
      y: targetY,
      transition: { type: 'tween', ease: 'circOut' }
    };

    controls1.start({ ...spinConfig, transition: { ...spinConfig.transition, duration: 2.0 } });
    controls2.start({ ...spinConfig, transition: { ...spinConfig.transition, duration: 2.5 } });
    await controls3.start({ ...spinConfig, transition: { ...spinConfig.transition, duration: 3.0 } });

    setSelectedCriterion(winner);
    setIsSpinning(false);
    setIsCelebrating(true); // Trigger blinking lights celebration
    onSpinComplete(winner);

    // After celebration, reset the machine implicitly
    setTimeout(() => {
      setIsCelebrating(false);
      // Reset physical y-translation securely in the background while keeping the winner visible in the center (index 1)
      controls1.set({ y: 0 });
      controls2.set({ y: 0 });
      controls3.set({ y: 0 });
      setReel1Items(generateStrip(winner, 1));
      setReel2Items(generateStrip(winner, 1));
      setReel3Items(generateStrip(winner, 1));
    }, 3000);
  };

  const renderReel = (controls, items) => (
    <div className="flex-1 h-48 overflow-hidden relative bg-black/40 rounded-lg border-x border-white/10">
      {/* 3D Cylinder shading overlays */}
      <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
      
      {/* Highlight/Winning row indicator */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-16 border-y-2 border-[#fbbf24]/50 bg-[#fbbf24]/10 z-10 pointer-events-none shadow-[inset_0_0_15px_rgba(251,191,36,0.15)]" />

      <motion.div
        animate={controls}
        initial={{ y: 0 }}
        className="flex flex-col w-full"
      >
        {items.map((item, idx) => (
          <div 
            key={idx} 
            className="h-16 flex items-center justify-center px-2 text-center"
          >
            <span 
              className="text-4xl md:text-5xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] select-none"
              role="img"
              aria-label={item?.name || "Emoji"}
            >
              {item ? emojiMapping[item.id] || "❓" : "❓"}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-[500px] mx-auto px-2">
      
      {/* Main Slot Machine Layout (Machine + Lever) */}
      <div className="flex items-end justify-center w-full">
        
        {/* Slot Machine Core */}
        <div className="w-full bg-[#1a1a1a] p-4 md:p-6 rounded-3xl border-4 border-[#fbbf24] shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(0,0,0,0.8)] relative z-10">
          
          {/* Top Blinking Lights Array */}
          <div className="absolute -top-5 left-0 right-0 flex justify-center gap-3 md:gap-5 px-6">
            {[...Array(7)].map((_, i) => (
              <motion.div 
                key={i}
                className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-red-600 border-[3px] border-red-950 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.5)]"
                animate={
                  isCelebrating
                    ? { 
                        opacity: [0.3, 1, 0.3], 
                        backgroundColor: ["#dc2626", "#ef4444", "#dc2626"],
                        boxShadow: [
                          "inset 0 -2px 4px rgba(0,0,0,0.5), 0 0 0px rgba(239,68,68,0)", 
                          "inset 0 -2px 4px rgba(0,0,0,0.2), 0 0 20px rgba(239,68,68,0.9)", 
                          "inset 0 -2px 4px rgba(0,0,0,0.5), 0 0 0px rgba(239,68,68,0)"
                        ]
                      }
                    : { 
                        opacity: 0.3, 
                        boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.5), 0 0 0px rgba(239,68,68,0)" 
                      }
                }
                transition={
                  isCelebrating 
                    ? {
                        duration: 0.4,
                        repeat: Infinity,
                        delay: lightDelays[i],
                        ease: "easeInOut"
                      }
                    : { duration: 0.1 }
                }
              />
            ))}
          </div>

          {/* Reels Container */}
          <div className="flex gap-1 md:gap-2 bg-black p-2 rounded-xl border-2 border-white/10 shadow-inner mt-4">
            {renderReel(controls1, reel1Items)}
            {renderReel(controls2, reel2Items)}
            {renderReel(controls3, reel3Items)}
          </div>
        </div>

        {/* Side Lever Mechanism */}
        <div className="flex flex-col items-center justify-end pb-8 -ml-3 z-0 w-16">
          <motion.div
            className={`w-4 h-28 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 origin-bottom rounded-t-full shadow-lg relative flex flex-col items-center justify-start ${!isSpinning && !disabled ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-50'}`}
            animate={leverControls}
            onClick={handleSpin}
            whileHover={!isSpinning && !disabled ? { scale: 1.05 } : {}}
            onPanEnd={(e, info) => {
              if (info.offset.y > 20 && !isSpinning && !disabled) handleSpin();
            }}
          >
            {/* Knob */}
            <div className="absolute -top-6 w-10 h-10 bg-red-600 rounded-full shadow-[inset_-3px_-5px_8px_rgba(0,0,0,0.4),0_4px_10px_rgba(0,0,0,0.5)] border-2 border-red-800" />
          </motion.div>
          {/* Lever Base / Connector to machine */}
          <div className="w-10 h-16 bg-[#2a2a2a] border-y-4 border-r-4 border-[#fbbf24] rounded-r-xl shadow-md z-0" />
        </div>

      </div>

      {/* Result Display area */}
      <div className="h-28 flex items-center justify-center w-full relative">
        {selectedCriterion && !isSpinning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[#1a1a1a]/80 backdrop-blur-md border-2 border-[#fbbf24] px-8 py-4 rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.3)] text-center w-full relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fbbf24]/10 to-transparent" />
            <p className="text-sm font-medium uppercase tracking-widest opacity-80 mb-2 text-white relative z-10">
              Critério Sorteado
            </p>
            <p className="text-2xl md:text-3xl font-black text-white drop-shadow-md relative z-10 flex items-center justify-center gap-3">
              <span className="text-[#fbbf24] text-3xl md:text-4xl drop-shadow-lg">
                {emojiMapping[selectedCriterion.id]}
              </span>
              {selectedCriterion.name}
            </p>
          </motion.div>
        )}
        
        {isSpinning && (
          <p className="text-[#fbbf24] font-bold text-xl animate-pulse tracking-widest">
            SORTEANDO...
          </p>
        )}
      </div>

    </div>
  );
}
