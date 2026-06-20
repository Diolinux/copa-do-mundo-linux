
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
import SlotMachine from '@/components/SlotMachine.jsx';
import DistroCard from '@/components/DistroCard.jsx';
import BracketMatch from '@/components/BracketMatch.jsx';

export default function KnockoutStageScreen() {
  const navigate = useNavigate();
  const {
    knockoutBracket,
    currentKnockoutStage,
    currentKnockoutMatchIndex,
    updateKnockoutResult,
    nextKnockoutMatch,
    criteriaList,
    gamePhase,
    animatingMatch,
    setAnimatingMatch
  } = useGame();

  const [selectedCriterion, setSelectedCriterion] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  const stageNames = {
    oitavas: 'Oitavas de Final',
    quartas: 'Quartas de Final',
    semifinal: 'Semifinal',
    final: 'Final'
  };

  const currentStageMatches = knockoutBracket[currentKnockoutStage] || [];
  const currentMatch = currentStageMatches[currentKnockoutMatchIndex];

  useEffect(() => {
    if (!knockoutBracket.oitavas || knockoutBracket.oitavas.length === 0) {
      navigate('/');
    }
  }, [knockoutBracket, navigate]);

  useEffect(() => {
    if (gamePhase === 'champion') {
      navigate('/champion');
    }
  }, [gamePhase, navigate]);

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
    updateKnockoutResult(winnerId, selectedCriterion);
    
    setTimeout(() => {
      setShowNextButton(true);
    }, 2500);
  };

  const handleNextMatch = () => {
    nextKnockoutMatch();
    setSelectedCriterion(null);
    setHasSpun(false);
    setShowNextButton(false);
  };

  if (!currentMatch) {
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
        <title>{`${stageNames[currentKnockoutStage]} - Copa do Mundo de Distros Linux`}</title>
        <meta name="description" content={`Acompanhe a ${stageNames[currentKnockoutStage]} da Copa do Mundo de Distros Linux`} />
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
                {stageNames[currentKnockoutStage]}
              </h2>
              <p className="text-muted-foreground">
                Partida {currentKnockoutMatchIndex + 1} de {currentStageMatches.length}
              </p>
            </motion.div>

            {/* Stage Tabs */}
            <Tabs value={currentKnockoutStage} className="mb-8">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-muted p-2 rounded-xl">
                {Object.keys(stageNames).map(stage => {
                  const matches = knockoutBracket[stage] || [];
                  const hasMatches = matches.length > 0;
                  const allComplete = matches.every(m => m.winner !== null);
                  
                  return (
                    <TabsTrigger
                      key={stage}
                      value={stage}
                      disabled={!hasMatches || isAnimating}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold disabled:opacity-50"
                    >
                      {stageNames[stage]}
                      {allComplete && hasMatches && <Trophy className="w-4 h-4 ml-1 text-accent" />}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {Object.keys(stageNames).map(stage => (
                <TabsContent key={stage} value={stage} className="mt-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Current Match & Slot Machine */}
                    <div className="space-y-8">
                      {stage === currentKnockoutStage && currentMatch ? (
                        <>
                          <div className="bg-card rounded-2xl p-6 shadow-lg border-2 border-border">
                            <h3 className="text-xl font-bold text-card-foreground mb-6 text-center">
                              {currentMatch.distro1.name} vs {currentMatch.distro2.name}
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
                                  {currentKnockoutMatchIndex < currentStageMatches.length - 1
                                    ? 'Próxima Partida'
                                    : stage === 'final'
                                    ? 'Ver Campeão'
                                    : 'Avançar para Próxima Fase'}
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
                            {stageNames[stage]}
                          </h3>
                          <p className="text-muted-foreground">
                            {knockoutBracket[stage].length === 0
                              ? 'Aguardando classificação'
                              : 'Fase concluída'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right: Bracket Visualization */}
                    <div>
                      <div className="bg-card rounded-2xl p-6 shadow-lg border-2 border-border">
                        <h3 className="text-xl font-bold text-card-foreground mb-6 flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-accent" />
                          Chaveamento - {stageNames[stage]}
                        </h3>
                        <div className="space-y-4">
                          {knockoutBracket[stage].map((match, index) => (
                            <BracketMatch key={match.id} match={match} index={index} />
                          ))}
                          {knockoutBracket[stage].length === 0 && (
                            <p className="text-center text-muted-foreground py-8">
                              Aguardando resultados da fase anterior
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
