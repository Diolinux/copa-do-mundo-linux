
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext.jsx';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowRight, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import StandingsTable from '@/components/StandingsTable.jsx';
import SlotMachine from '@/components/SlotMachine.jsx';
import DistroCard from '@/components/DistroCard.jsx';

export default function GroupStageScreen() {
  const navigate = useNavigate();
  const {
    groups,
    groupMatches,
    currentMatchIndex,
    updateGroupResult,
    nextMatch,
    advanceToKnockout,
    criteriaList,
    animatingMatch,
    setAnimatingMatch
  } = useGame();

  const [selectedGroup, setSelectedGroup] = useState('A');
  const [selectedCriterion, setSelectedCriterion] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  const groupKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const currentGroup = groups[selectedGroup] || [];
  const currentMatches = groupMatches[selectedGroup] || [];
  const currentMatchIdx = currentMatchIndex[selectedGroup] || 0;
  const currentMatch = currentMatches[currentMatchIdx];

  const allGroupsComplete = groupKeys.every(key => {
    const matches = groupMatches[key] || [];
    const matchIdx = currentMatchIndex[key] || 0;
    return matchIdx >= matches.length;
  });

  useEffect(() => {
    if (!groups || Object.keys(groups).length === 0) {
      navigate('/');
    }
  }, [groups, navigate]);

  const handleSpinComplete = (criterion) => {
    setSelectedCriterion(criterion);
    setHasSpun(true);
  };

  const handleSelectWinner = (winnerId) => {
    if (!hasSpun || !selectedCriterion) {
      toast.error('Gire a roda primeiro para sortear um critério');
      return;
    }

    const loserId = currentMatch.distro1.id === winnerId ? currentMatch.distro2.id : currentMatch.distro1.id;
    
    setAnimatingMatch({ winnerId, loserId });
    updateGroupResult(selectedGroup, winnerId, selectedCriterion);
    
    // Wait for animations to finish before showing next button
    setTimeout(() => {
      setShowNextButton(true);
    }, 2500);
  };

  const handleNextMatch = () => {
    nextMatch(selectedGroup);
    setSelectedCriterion(null);
    setHasSpun(false);
    setShowNextButton(false);

    const nextMatchIdx = currentMatchIdx + 1;
    if (nextMatchIdx >= currentMatches.length) {
      toast.success(`Grupo ${selectedGroup} concluído`);
      
      const nextGroupIndex = groupKeys.indexOf(selectedGroup) + 1;
      if (nextGroupIndex < groupKeys.length) {
        setSelectedGroup(groupKeys[nextGroupIndex]);
      }
    }
  };

  const handleAdvanceToKnockout = () => {
    advanceToKnockout();
    navigate('/knockout');
    toast.success('Avançando para as oitavas de final');
  };

  if (!currentMatch && !allGroupsComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Carregando partidas...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const isAnimating = animatingMatch.winnerId !== null;

  return (
    <>
      <Helmet>
        <title>Fase de Grupos - Copa do Mundo de Distros Linux</title>
        <meta name="description" content="Acompanhe a fase de grupos da Copa do Mundo de Distros Linux" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2" style={{ letterSpacing: '-0.02em' }}>
                Fase de Grupos
              </h2>
              <p className="text-muted-foreground">
                Escolha o vencedor de cada partida baseado no critério sorteado
              </p>
            </motion.div>

            {/* Group Tabs */}
            <Tabs value={selectedGroup} onValueChange={setSelectedGroup} className="mb-8">
              <TabsList className="grid grid-cols-4 md:grid-cols-8 gap-2 bg-muted p-2 rounded-xl">
                {groupKeys.map(key => {
                  const matches = groupMatches[key] || [];
                  const matchIdx = currentMatchIndex[key] || 0;
                  const isComplete = matchIdx >= matches.length;
                  
                  return (
                    <TabsTrigger
                      key={key}
                      value={key}
                      disabled={isAnimating}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold"
                    >
                      Grupo {key}
                      {isComplete && <Trophy className="w-4 h-4 ml-1 text-accent" />}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {groupKeys.map(key => (
                <TabsContent key={key} value={key} className="mt-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Current Match & Slot Machine */}
                    <div className="space-y-8">
                      {currentMatch && currentMatchIdx < currentMatches.length ? (
                        <>
                          <div className="bg-card rounded-2xl p-6 shadow-lg border-2 border-border">
                            <h3 className="text-xl font-bold text-card-foreground mb-6 text-center">
                              Partida {currentMatchIdx + 1} de {currentMatches.length}
                            </h3>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <DistroCard 
                                distro={currentMatch.distro1} 
                                size="medium" 
                                isWinner={animatingMatch.winnerId === currentMatch.distro1.id}
                                isLoser={animatingMatch.loserId === currentMatch.distro1.id}
                              />
                              <DistroCard 
                                distro={currentMatch.distro2} 
                                size="medium" 
                                isWinner={animatingMatch.winnerId === currentMatch.distro2.id}
                                isLoser={animatingMatch.loserId === currentMatch.distro2.id}
                              />
                            </div>

                            {hasSpun && selectedCriterion && !showNextButton && (
                              <div className="grid grid-cols-2 gap-4">
                                <Button
                                  onClick={() => handleSelectWinner(currentMatch.distro1.id)}
                                  disabled={isAnimating}
                                  size="lg"
                                  className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                                >
                                  Vencedor
                                </Button>
                                <Button
                                  onClick={() => handleSelectWinner(currentMatch.distro2.id)}
                                  disabled={isAnimating}
                                  size="lg"
                                  className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                                >
                                  Vencedor
                                </Button>
                              </div>
                            )}

                            {showNextButton && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                <Button
                                  onClick={handleNextMatch}
                                  size="lg"
                                  className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg"
                                >
                                  <ArrowRight className="w-5 h-5 mr-2" />
                                  Próxima Partida
                                </Button>
                              </motion.div>
                            )}
                          </div>

                          <SlotMachine
                            criteria={criteriaList}
                            onSpinComplete={handleSpinComplete}
                            disabled={hasSpun || isAnimating}
                          />
                        </>
                      ) : (
                        <div className="bg-card rounded-2xl p-8 shadow-lg border-2 border-primary text-center">
                          <Trophy className="w-16 h-16 text-accent mx-auto mb-4" />
                          <h3 className="text-2xl font-bold text-card-foreground mb-2">
                            Grupo {key} Concluído
                          </h3>
                          <p className="text-muted-foreground">
                            Todas as partidas deste grupo foram finalizadas
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right: Standings */}
                    <div>
                      <StandingsTable distros={groups[key] || []} groupName={key} />
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Advance to Knockout Button */}
            {allGroupsComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mt-12"
              >
                <div className="bg-primary/10 border-2 border-primary rounded-2xl p-8 max-w-2xl mx-auto">
                  <Trophy className="w-20 h-20 text-accent mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Fase de Grupos Concluída
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Todos os grupos foram finalizados. As 16 melhores distros estão classificadas para as oitavas de final!
                  </p>
                  <Button
                    onClick={handleAdvanceToKnockout}
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-10 py-6 rounded-xl shadow-lg hover:scale-105 transition-all duration-200 active:scale-95 font-semibold"
                  >
                    <Trophy className="w-6 h-6 mr-2" />
                    Avançar para Oitavas de Final
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
