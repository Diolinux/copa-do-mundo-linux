
// Utility functions for game logic

// Randomly select N distros from the full list
export function selectRandomDistros(allDistros, count = 32) {
  const shuffled = [...allDistros].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Distribute 32 distros into 8 groups of 4
export function distributeIntoGroups(distros) {
  const groups = {
    A: [], B: [], C: [], D: [], E: [], F: [], G: [], H: []
  };
  
  const groupKeys = Object.keys(groups);
  distros.forEach((distro, index) => {
    const groupKey = groupKeys[index % 8];
    groups[groupKey].push({
      ...distro,
      wins: 0,
      points: 0,
      matchesPlayed: 0
    });
  });
  
  return groups;
}

// Generate all matches for a group (round-robin: each team plays all others)
export function generateGroupMatches(groupDistros) {
  const matches = [];
  for (let i = 0; i < groupDistros.length; i++) {
    for (let j = i + 1; j < groupDistros.length; j++) {
      matches.push({
        id: `${groupDistros[i].id}-vs-${groupDistros[j].id}`,
        distro1: groupDistros[i],
        distro2: groupDistros[j],
        winner: null,
        criterion: null
      });
    }
  }
  return matches;
}

// Update group standings after a match result
export function updateGroupStandings(groupDistros, winnerId) {
  return groupDistros.map(distro => {
    if (distro.id === winnerId) {
      return {
        ...distro,
        wins: distro.wins + 1,
        points: distro.points + 3,
        matchesPlayed: distro.matchesPlayed + 1
      };
    }
    return distro;
  });
}

// Get top 2 distros from a group (sorted by points, then wins)
export function getTopTwoFromGroup(groupDistros) {
  const sorted = [...groupDistros].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.wins - a.wins;
  });
  return sorted.slice(0, 2);
}

// Generate knockout bracket from 16 qualified distros
export function generateKnockoutBracket(qualifiedDistros) {
  // Oitavas (Round of 16): 8 matches
  const oitavas = [];
  for (let i = 0; i < qualifiedDistros.length; i += 2) {
    oitavas.push({
      id: `oitavas-${i / 2}`,
      distro1: qualifiedDistros[i],
      distro2: qualifiedDistros[i + 1],
      winner: null,
      criterion: null
    });
  }
  
  return {
    oitavas,
    quartas: [],
    semifinal: [],
    final: []
  };
}

// Advance to next knockout stage
export function advanceKnockoutStage(currentStageMatches, nextStageName) {
  const winners = currentStageMatches
    .filter(match => match.winner)
    .map(match => match.winner);
  
  if (nextStageName === 'final') {
    // Final has only 1 match
    return [{
      id: 'final-0',
      distro1: winners[0],
      distro2: winners[1],
      winner: null,
      criterion: null
    }];
  }
  
  // Create matches for next stage
  const nextStageMatches = [];
  for (let i = 0; i < winners.length; i += 2) {
    nextStageMatches.push({
      id: `${nextStageName}-${i / 2}`,
      distro1: winners[i],
      distro2: winners[i + 1],
      winner: null,
      criterion: null
    });
  }
  
  return nextStageMatches;
}

// Get random criterion from the wheel
export function getRandomCriterion(criteriaList) {
  const randomIndex = Math.floor(Math.random() * criteriaList.length);
  return criteriaList[randomIndex];
}

// Check if all matches in a stage are complete
export function areAllMatchesComplete(matches) {
  return matches.every(match => match.winner !== null);
}

// Check if all groups are complete
export function areAllGroupsComplete(groups) {
  return Object.values(groups).every(group => {
    const totalMatches = (group.length * (group.length - 1)) / 2;
    return group.every(distro => distro.matchesPlayed === group.length - 1);
  });
}
