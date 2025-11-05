import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, ExternalLink, ChevronRight, Smartphone, Laptop } from 'lucide-react';

const WalletConnectModal = ({ isOpen, onClose, onConnect }) => {
  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '/wallets/metamask.svg',
      type: 'extension',
      description: 'Popular Ethereum wallet',
      supportedChains: ['Ethereum', 'Polygon', 'BSC', 'Arbitrum']
    },
    {
      id: 'trustwallet',
      name: 'Trust Wallet',
      icon: '/wallets/trustwallet.svg',
      type: 'mobile',
      description: 'Binance Smart Chain wallet',
      supportedChains: ['BSC', 'Ethereum', 'Polygon']
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '/wallets/walletconnect.svg',
      type: 'universal',
      description: 'Connect any wallet',
      supportedChains: ['All Networks']
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '/wallets/coinbase.svg',
      type: 'extension',
      description: 'Coinbase exchange wallet',
      supportedChains: ['Ethereum', 'Polygon']
    },
    {
      id: 'phantom',
      name: 'Phantom',
      icon: '/wallets/phantom.svg',
      type: 'extension',
      description: 'Solana wallet',
      supportedChains: ['Solana']
    },
    {
      id: 'telegram',
      name: 'Telegram Wallet',
      icon: '/wallets/telegram.svg',
      type: 'mobile',
      description: 'Built-in Telegram wallet',
      supportedChains: ['TON', 'Ethereum']
    },
    {
      id: 'tonkeeper',
      name: 'Tonkeeper',
      icon: '/wallets/tonkeeper.svg',
      type: 'mobile',
      description: 'Native TON wallet',
      supportedChains: ['TON']
    },
    {
      id: 'rabby',
      name: 'Rabby Wallet',
      icon: '/wallets/rabby.svg',
      type: 'extension',
      description: 'Multi-chain DeFi wallet',
      supportedChains: ['Ethereum', 'Polygon', 'BSC', 'Arbitrum']
    }
  ];

  const handleWalletConnect = async (walletId) => {
    try {
      await onConnect(walletId);
      onClose();
    } catch (error) {
      console.error(`Failed to connect ${walletId}:`, error);
    }
  };

  const getWalletTypeIcon = (type) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'extension':
        return <Laptop className="w-4 h-4" />;
      default:
        return <Wallet className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
              
              {/* Header */}
              <div className="relative p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/20 rounded-xl">
                      <Wallet className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
                      <p className="text-white/60 text-sm">Choose your preferred wallet</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Wallets List */}
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="grid gap-3">
                  {wallets.map((wallet, index) => (
                    <motion.button
                      key={wallet.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleWalletConnect(wallet.id)}
                      className="group relative p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 rounded-2xl transition-all duration-300 text-left"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Wallet Icon */}
                          <div className="relative">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                              {wallet.icon ? (
                                <img 
                                  src={wallet.icon} 
                                  alt={wallet.name}
                                  className="w-8 h-8"
                                />
                              ) : (
                                <Wallet className="w-6 h-6 text-white/60" />
                              )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 p-1 bg-gray-800 rounded-full border border-gray-700">
                              {getWalletTypeIcon(wallet.type)}
                            </div>
                          </div>

                          {/* Wallet Info */}
                          <div>
                            <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                              {wallet.name}
                            </h3>
                            <p className="text-white/60 text-sm">{wallet.description}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              {wallet.supportedChains.slice(0, 2).map(chain => (
                                <span 
                                  key={chain}
                                  className="px-2 py-1 bg-white/5 rounded-lg text-xs text-white/40"
                                >
                                  {chain}
                                </span>
                              ))}
                              {wallet.supportedChains.length > 2 && (
                                <span className="text-xs text-white/40">
                                  +{wallet.supportedChains.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Connect Arrow */}
                        <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-purple-400 transition-colors" />
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10 bg-black/20">
                <div className="text-center">
                  <p className="text-white/40 text-sm">
                    New to crypto wallets?{' '}
                    <a 
                      href="https://ethereum.org/en/wallets/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 underline transition-colors"
                    >
                      Learn more
                      <ExternalLink className="w-3 h-3 inline ml-1" />
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WalletConnectModal;
