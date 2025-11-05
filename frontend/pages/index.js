import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Music2, Zap, Crown, Rocket, Sparkles, Gem, 
  Volume2, Play, Star, TrendingUp, Users,
  Shield, Globe, Coins, Clock, Wallet,
  Eye, Heart, Share2, ShoppingCart
} from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import WalletConnectModal from '../components/Wallet/WalletConnectModal';
import BeatCard from '../components/Beat/BeatCard';

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [featuredBeats, setFeaturedBeats] = useState([]);
  
  const { account, isConnected, connectWallet, provider } = useWallet();
  const containerRef = useRef();
  
  const { scrollYProgress } = useScroll({ target: containerRef });
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // Загрузка битов при подключении кошелька
  useEffect(() => {
    if (isConnected && account) {
      loadFeaturedBeats();
    }
  }, [isConnected, account]);

  const loadFeaturedBeats = async () => {
    // Загрузка битов с IPFS и блокчейна
    const beats = await fetch('/api/beats').then(res => res.json());
    setFeaturedBeats(beats);
  };

  const handlePurchase = async (beat) => {
    if (!isConnected) {
      setShowWalletModal(true);
      return;
    }

    try {
      // Покупка через смарт-контракт
      const marketplace = new BeatMarketplace();
      await marketplace.connectWallet();
      
      const tx = await marketplace.purchaseBeat(
        beat.tokenId, 
        beat.price
      );
      
      // Ждем подтверждения транзакции
      await tx.wait();
      
      alert('Beat purchased successfully! 🎵');
      
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed: ' + error.message);
    }
  };

  return (
    <>
      <Head>
        <title>BEATVERSE | NFT Music Marketplace</title>
        <meta name="description" content="Buy and sell beats as NFTs on multiple blockchains" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div ref={containerRef} className="min-h-screen bg-black overflow-hidden">
        
        {/* Анимированный бэкграунд */}
        <div className="fixed inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-black"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
          
          {/* Анимированная сетка */}
          <div className="grid-bg"></div>
          
          {/* Парящие частицы */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              style={{
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Навигация */}
        <nav className="cyber-nav">
          <div className="cyber-container">
            <div className="flex items-center justify-between py-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="relative">
                  <Music2 className="w-8 h-8 text-purple-400 pulse-glow" />
                  <Sparkles className="w-3 h-3 text-cyan-400 absolute -top-1 -right-1" />
                </div>
                <h1 className="cyber-text text-2xl">BEATVERSE</h1>
              </motion.div>

              <div className="flex items-center space-x-4">
                <button className="text-white/70 hover:text-cyan-400 transition-colors">
                  Marketplace
                </button>
                <button className="text-white/70 hover:text-purple-400 transition-colors">
                  Create
                </button>
                <button className="text-white/70 hover:text-green-400 transition-colors">
                  Profile
                </button>
                
                {isConnected ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-2xl border border-cyan-400/20">
                      <div className="w-2 h-2 bg-green-400 rounded-full pulse-glow"></div>
                      <span className="text-cyan-400 font-mono text-sm">
                        {account.slice(0, 6)}...{account.slice(-4)}
                      </span>
                    </div>
                    <div className="cyber-price text-sm">
                      0.42 ETH
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowWalletModal(true)}
                    className="cyber-button flex items-center space-x-2"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Connect Wallet</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
          <div className="nav-glow"></div>
        </nav>

        {/* Hero Section */}
        <section className="hero-section pt-32 pb-20">
          <div className="cyber-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <motion.h1 
                className="cyber-text text-6xl md:text-8xl lg:text-9xl font-black mb-6"
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(255,0,255,0.5)",
                    "0 0 30px rgba(0,255,255,0.5)", 
                    "0 0 20px rgba(255,0,255,0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                BEATVERSE
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-white/70 mb-8 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                The ultimate <span className="gradient-text-pink-blue font-bold">NFT marketplace</span> for music producers. 
                Own your sound, earn forever. 🎵
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <button className="cyber-button text-lg px-8 py-4">
                  <Rocket className="w-5 h-5 mr-2" />
                  Explore Beats
                </button>
                <button className="glass-card px-8 py-4 text-white/80 hover:text-white border border-white/20 hover:border-cyan-400/50 transition-all">
                  <Zap className="w-5 h-5 mr-2 inline" />
                  Start Selling
                </button>
              </motion.div>

              {/* Статистика */}
              <motion.div
                className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {[
                  { icon: Users, value: "50K+", label: "Producers" },
                  { icon: Coins, value: "$2.5M+", label: "Volume" },
                  { icon: TrendingUp, value: "15K+", label: "Beats Sold" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                  >
                    <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-white/60">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Featured Beats Section */}
        <section className="py-20 relative z-10">
          <div className="cyber-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="cyber-text text-4xl md:text-5xl mb-4">TRENDING BEATS</h2>
              <p className="text-white/60 text-lg">Hot beats selling right now 🔥</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredBeats.map((beat, index) => (
                <motion.div
                  key={beat.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BeatCard 
                    beat={beat} 
                    onPlay={() => setCurrentBeat(beat)}
                    onPurchase={handlePurchase}
                    isConnected={isConnected}
                  />
                </motion.div>
              ))}
            </div>

            {featuredBeats.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Music2 className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/40 text-lg">No beats available yet</p>
                <button className="cyber-button mt-4">
                  Upload First Beat
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 relative z-10">
          <div className="cyber-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="cyber-text text-4xl md:text-5xl mb-4">WHY BEATVERSE?</h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Gem,
                  title: "True Ownership",
                  description: "Your beats are NFTs - you own them forever with provable ownership on blockchain",
                  color: "purple"
                },
                {
                  icon: Coins,
                  title: "Instant Payments",
                  description: "Get paid instantly in crypto. No intermediaries, no delays, no chargebacks",
                  color: "cyan"
                },
                {
                  icon: Globe,
                  title: "Global Marketplace",
                  description: "Sell to anyone, anywhere in the world. No borders, no restrictions",
                  color: "green"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                  className="glass-card p-8 text-center group"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-${feature.color}-500/20 border border-${feature.color}-400/30 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-8 h-8 text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-white/60">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Wallet Connect Modal */}
      <WalletConnectModal 
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={connectWallet}
      />

      {/* Global Audio Player */}
      <AnimatePresence>
        {currentBeat && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="cyber-audio-player playing glass-card px-6 py-4 flex items-center space-x-4">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-400 transition-colors"
              >
                {isPlaying ? (
                  <Volume2 className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white" />
                )}
              </button>
              <div className="flex-1">
                <div className="text-white font-semibold">{currentBeat.name}</div>
                <div className="text-white/60 text-sm">{currentBeat.bpm} BPM • {currentBeat.genre}</div>
              </div>
              <div className="cyber-price">{currentBeat.price}</div>
              <button 
                onClick={() => handlePurchase(currentBeat)}
                className="cyber-button text-sm px-4 py-2"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Buy
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        /* Инжектим наши кастомные стили */
      `}</style>
    </>
  );
}
