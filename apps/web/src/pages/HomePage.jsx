
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext.jsx';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Target, Award, Terminal, Code, Cpu, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function HomePage() {
  const navigate = useNavigate();
  const { initializeGame } = useGame();

  const handleStartGame = () => {
    initializeGame();
    navigate('/group-stage');
  };

  return (
    <>
      <Helmet>
        <title>Copa do Mundo de Distros Linux - Descubra a melhor distro</title>
        <meta name="description" content="Participe da Copa do Mundo de Distros Linux e descubra qual distribuição Linux é a campeã. 32 distros, 8 grupos, eliminatórias emocionantes!" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90">
            {/* Texture overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center lg:text-left"
                >
                  <div className="flex justify-center lg:justify-start mb-6">
                    <Trophy className="w-20 h-20 text-accent drop-shadow-2xl" />
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-primary-foreground mb-6 leading-tight" style={{ letterSpacing: '-0.02em', textShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                    Copa do Mundo de Distros Linux
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    Descubra qual distribuição Linux é a verdadeira campeã em um torneio emocionante com 32 distros competindo pelo título definitivo.
                  </p>

                  <Button
                    onClick={handleStartGame}
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 text-xl px-12 py-8 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95 font-bold"
                  >
                    <Trophy className="w-6 h-6 mr-3" />
                    Começar Copa
                  </Button>
                </motion.div>

                {/* Animated Mascot & Visuals */}
                <div className="relative hidden lg:flex items-center justify-center">
                  <div className="absolute w-72 h-72 bg-background/10 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-x-16 translate-y-16" />
                  
                  <motion.div className="animate-float relative z-10 text-[14rem] filter drop-shadow-2xl select-none">
                    🐧
                  </motion.div>
                  
                  <motion.div 
                    animate={{ y: [-15, 15, -15], rotate: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-10 right-10 bg-card p-5 rounded-2xl shadow-xl border-2 border-border"
                  >
                    <Terminal className="w-10 h-10 text-primary" />
                  </motion.div>

                  <motion.div 
                    animate={{ y: [15, -15, 15], rotate: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-10 left-10 bg-card p-5 rounded-2xl shadow-xl border-2 border-border"
                  >
                    <Code className="w-10 h-10 text-accent" />
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4" style={{ letterSpacing: '-0.02em' }}>
                  Como funciona o torneio
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Um campeonato completo inspirado na Copa do Mundo, mas com suas distros Linux favoritas
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-card rounded-3xl p-8 md:p-10 shadow-lg border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start gap-6">
                    <div className="bg-primary/10 p-4 rounded-2xl">
                      <Users className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-card-foreground mb-3">Fase de Grupos</h3>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        32 distribuições Linux são divididas em 8 grupos de 4. Cada distro enfrenta todas as outras do seu grupo. As 2 melhores de cada grupo avançam.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-card rounded-3xl p-8 md:p-10 shadow-lg border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start gap-6">
                    <div className="bg-primary/10 p-4 rounded-2xl">
                      <Target className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-card-foreground mb-3">Mata-Mata</h3>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        As 16 classificadas disputam oitavas, quartas, semifinais e a grande final. Partidas decisivas e eliminatórias - quem perde está fora!
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-card rounded-3xl p-8 md:p-10 shadow-lg border border-border hover:border-accent/30 transition-colors"
                >
                  <div className="flex items-start gap-6">
                    <div className="bg-accent/10 p-4 rounded-2xl">
                      <Trophy className="w-10 h-10 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-card-foreground mb-3">Roda de Critérios</h3>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        Gire a roda para sortear um critério aleatório (como estabilidade ou comunidade) e escolha qual distro vence naquele aspecto.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-card rounded-3xl p-8 md:p-10 shadow-lg border border-border hover:border-accent/30 transition-colors"
                >
                  <div className="flex items-start gap-6">
                    <div className="bg-accent/10 p-4 rounded-2xl">
                      <Award className="w-10 h-10 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-card-foreground mb-3">Coroe a Campeã</h3>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        Após todas as batalhas, uma distro será coroada campeã! Compartilhe o resultado com a comunidade e declare sua favorita.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Linux Curiosities Section */}
          <section className="py-24 bg-muted/50 border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4" style={{ letterSpacing: '-0.02em' }}>
                  Curiosidades do Mundo Linux
                </h2>
                <p className="text-lg text-muted-foreground">Fatos interessantes sobre o sistema que move a tecnologia</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-card p-8 rounded-3xl shadow-md border border-border flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Cpu className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Domínio dos Supercomputadores</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Mais de 90% dos supercomputadores mais rápidos do mundo utilizam o kernel Linux para operar sistemas complexos.
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-card p-8 rounded-3xl shadow-md border border-border flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                    <Terminal className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Origens em 1991</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    O kernel foi criado por Linus Torvalds inicialmente como um hobby, anunciando o projeto em um grupo de discussão na Usenet.
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-card p-8 rounded-3xl shadow-md border border-border flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Poder Oculto no Bolso</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    O sistema operacional Android é baseado em uma versão modificada do kernel Linux, rodando em bilhões de dispositivos globais.
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-center mt-20"
              >
                <Button
                  onClick={handleStartGame}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-10 py-8 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 active:scale-95 font-semibold"
                >
                  <Trophy className="w-6 h-6 mr-3" />
                  Iniciar Torneio Agora
                </Button>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
