
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function BracketMatch({ match, index }) {
  if (!match) return null;

  const hasWinner = match.winner !== null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card border-2 border-border rounded-xl p-4 shadow-md min-w-[200px]"
    >
      {/* Distro 1 */}
      <div className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
        hasWinner && match.winner.id === match.distro1.id 
          ? 'bg-primary/20 border-2 border-primary' 
          : 'bg-muted/50'
      }`}>
        <span className="text-xl">{match.distro1.flag}</span>
        <span className="text-sm font-medium flex-1">{match.distro1.name}</span>
        {hasWinner && match.winner.id === match.distro1.id && (
          <Check className="w-5 h-5 text-primary" />
        )}
      </div>

      <div className="h-2 flex items-center justify-center">
        <div className="w-full h-px bg-border" />
      </div>

      {/* Distro 2 */}
      <div className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
        hasWinner && match.winner.id === match.distro2.id 
          ? 'bg-primary/20 border-2 border-primary' 
          : 'bg-muted/50'
      }`}>
        <span className="text-xl">{match.distro2.flag}</span>
        <span className="text-sm font-medium flex-1">{match.distro2.name}</span>
        {hasWinner && match.winner.id === match.distro2.id && (
          <Check className="w-5 h-5 text-primary" />
        )}
      </div>

      {match.criterion && (
        <div className="mt-2 text-xs text-center text-muted-foreground bg-muted rounded px-2 py-1">
          {match.criterion.name}
        </div>
      )}
    </motion.div>
  );
}
