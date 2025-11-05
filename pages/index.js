import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Music, TrendingUp, Users, Zap, ShoppingCart, Wallet } from 'lucide-react';

export default function Home() {
  const [beats, setBeats] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <Head>
        <title>BeatWave - NFT Music Marketplace</title>
        <meta name="description" content="Sell and buy beats as NFTs" />
      </Head>

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Music className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                BeatWave
              </span>
            </motion.div>

            <div className="flex items-center space-x-6">
              <button className="text-white/80 hover:text-white transition-colors">
                Marketplace
              </button>
              <button className="text-white/80 hover:text-white transition-colors">
                Create
              </button>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-full font-semibold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              OWN THE
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              BEAT
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-white/70 mb-12 max-w-3xl mx-auto"
          >
            The first decentralized marketplace for music producers. 
            Sell your beats as NFTs and earn royalties forever.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-2xl font-bold text-white text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all">
              Explore Beats
            </button>
            <button className="border border-purple-400/50 bg-purple-400/10 px-8 py-4 rounded-2xl font-bold text-white text-lg backdrop-blur-sm hover:bg-purple-400/20 transition-all">
              Start Selling
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-purple-400/50 transition-all"
            >
              <TrendingUp className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Earn Royalties</h3>
              <p className="text-white/70">Get paid every time your beat is used or resold</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-blue-400/50 transition-all"
            >
              <Zap className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Instant Payments</h3>
              <p className="text-white/70">Receive crypto payments instantly across multiple networks</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-pink-400/50 transition-all"
            >
              <Users className="w-12 h-12 text-pink-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Global Community</h3>
              <p className="text-white/70">Connect with artists and producers worldwide</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
