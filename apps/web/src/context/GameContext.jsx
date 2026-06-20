
import React, { createContext, useContext, useState, useEffect } from 'react';
import { distroData } from '@/data/distroData.js';
import { criteriaList } from '@/data/criteriaList.js';
import {
  selectRandomDistros,
  distributeIntoGroups,
  generateGroupMatches,
  updateGroupStandings,
  getTopTwoFromGroup,
  generateKnockoutBracket,
  advanceKnockoutStage,
  getRandomCriterion
} from '@/utils/gameUtils.js';

const GameContext = createContext();

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}

export function useTheme() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useTheme must be used within GameProvider');
  }
  return { theme: context.theme, toggleTheme: context.toggleTheme };
}

export function GameProvider({ children }) {
  // Theme State
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const nextTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', nextTheme);
      return nextTheme;
    });
  };

  // Game State
  const [gamePhase, setGamePhase] = useState('home');
  const [selectedDistros, setSelectedDistros] = useState([]);
  const [groups, setGroups] = useState({});
  const [groupMatches, setGroupMatches] = useState({});
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentMatchIndex, setCurrentMatchIndex] = useState({});
  const [knockoutBracket, setKnockoutBracket] = useState({
    oitavas: [],
    quartas: [],
    semifinal: [],
    final: []
  });
  const [currentKnockoutStage, setCurrentKnockoutStage] = useState('oitavas');
  const [currentKnockoutMatchIndex, setCurrentKnockoutMatchIndex] = useState(0);
  const [championDistro, setChampionDistro] = useState(null);

  // Animation State
  const [animatingMatch, setAnimatingMatch] = useState({ winnerId: null, loserId: null });

  // Initialize new game
  const initializeGame = () => {
    const randomDistros = selectRandomDistros(distroData, 32);
    const initialGroups = distributeIntoGroups(randomDistros);
    
    const matches = {};
    const matchIndices = {};
    Object.keys(initialGroups).forEach(groupKey => {
      matches[groupKey] = generateGroupMatches(initialGroups[groupKey]);
      matchIndices[groupKey] = 0;
    });
    
    setSelectedDistros(randomDistros);
    setGroups(initialGroups);
    setGroupMatches(matches);
    setCurrentGroupIndex(0);
    setCurrentMatchIndex(matchIndices);
    setGamePhase('groupStage');
    setAnimatingMatch({ winnerId: null, loserId: null });
  };

  // Update group match result
  const updateGroupResult = (groupKey, winnerId, criterion) => {
    const currentMatches = [...groupMatches[groupKey]];
    const matchIdx = currentMatchIndex[groupKey];
    
    if (matchIdx >= currentMatches.length) return;
    
    currentMatches[matchIdx] = {
      ...currentMatches[matchIdx],
      winner: currentMatches[matchIdx].distro1.id === winnerId 
        ? currentMatches[matchIdx].distro1 
        : currentMatches[matchIdx].distro2,
      criterion
    };
    
    const updatedGroupDistros = updateGroupStandings(groups[groupKey], winnerId);
    
    setGroupMatches({
      ...groupMatches,
      [groupKey]: currentMatches
    });
    
    setGroups({
      ...groups,
      [groupKey]: updatedGroupDistros
    });
  };

  // Move to next match in current group
  const nextMatch = (groupKey) => {
    setCurrentMatchIndex({
      ...currentMatchIndex,
      [groupKey]: currentMatchIndex[groupKey] + 1
    });
    setAnimatingMatch({ winnerId: null, loserId: null });
  };

  // Advance to knockout stage
  const advanceToKnockout = () => {
    const qualifiedDistros = [];
    const groupKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    
    groupKeys.forEach(key => {
      const topTwo = getTopTwoFromGroup(groups[key]);
      qualifiedDistros.push(...topTwo);
    });
    
    const bracket = generateKnockoutBracket(qualifiedDistros);
    setKnockoutBracket(bracket);
    setCurrentKnockoutStage('oitavas');
    setCurrentKnockoutMatchIndex(0);
    setGamePhase('knockout');
    setAnimatingMatch({ winnerId: null, loserId: null });
  };

  // Update knockout match result
  const updateKnockoutResult = (winnerId, criterion) => {
    const stage = currentKnockoutStage;
    const matchIdx = currentKnockoutMatchIndex;
    const currentMatches = [...knockoutBracket[stage]];
    
    if (matchIdx >= currentMatches.length) return;
    
    const match = currentMatches[matchIdx];
    const winner = match.distro1.id === winnerId ? match.distro1 : match.distro2;
    
    currentMatches[matchIdx] = {
      ...match,
      winner,
      criterion
    };
    
    setKnockoutBracket({
      ...knockoutBracket,
      [stage]: currentMatches
    });
  };

  // Move to next knockout match
  const nextKnockoutMatch = () => {
    const stage = currentKnockoutStage;
    const nextIndex = currentKnockoutMatchIndex + 1;
    
    setAnimatingMatch({ winnerId: null, loserId: null });

    if (nextIndex >= knockoutBracket[stage].length) {
      advanceToNextKnockoutStage();
    } else {
      setCurrentKnockoutMatchIndex(nextIndex);
    }
  };

  // Advance to next knockout stage
  const advanceToNextKnockoutStage = () => {
    const stageOrder = ['oitavas', 'quartas', 'semifinal', 'final'];
    const currentStageIdx = stageOrder.indexOf(currentKnockoutStage);
    
    if (currentStageIdx === stageOrder.length - 1) {
      const finalMatch = knockoutBracket.final[0];
      if (finalMatch && finalMatch.winner) {
        setChampionDistro(finalMatch.winner);
        setGamePhase('champion');
      }
      return;
    }
    
    const nextStage = stageOrder[currentStageIdx + 1];
    const nextStageMatches = advanceKnockoutStage(
      knockoutBracket[currentKnockoutStage],
      nextStage
    );
    
    setKnockoutBracket({
      ...knockoutBracket,
      [nextStage]: nextStageMatches
    });
    setCurrentKnockoutStage(nextStage);
    setCurrentKnockoutMatchIndex(0);
  };

  // Reset game
  const resetGame = () => {
    setGamePhase('home');
    setSelectedDistros([]);
    setGroups({});
    setGroupMatches({});
    setCurrentGroupIndex(0);
    setCurrentMatchIndex({});
    setKnockoutBracket({ oitavas: [], quartas: [], semifinal: [], final: [] });
    setCurrentKnockoutStage('oitavas');
    setCurrentKnockoutMatchIndex(0);
    setChampionDistro(null);
    setAnimatingMatch({ winnerId: null, loserId: null });
  };

  const value = {
    theme,
    toggleTheme,
    gamePhase,
    selectedDistros,
    groups,
    groupMatches,
    currentGroupIndex,
    setCurrentGroupIndex,
    currentMatchIndex,
    knockoutBracket,
    currentKnockoutStage,
    currentKnockoutMatchIndex,
    championDistro,
    criteriaList,
    animatingMatch,
    setAnimatingMatch,
    initializeGame,
    updateGroupResult,
    nextMatch,
    advanceToKnockout,
    updateKnockoutResult,
    nextKnockoutMatch,
    resetGame,
    getRandomCriterion: () => getRandomCriterion(criteriaList)
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
