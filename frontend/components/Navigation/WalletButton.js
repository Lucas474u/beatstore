import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ChevronDown, User, LogOut } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';
import WalletConnectModal from '../Wallet/WalletConnectModal';

const WalletButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const { 
    account, 
    isConnected, 
    disconnectWallet, 
    chainId 
  } = useWallet();

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId) => {
    const networks = {
      1: 'Ethereum',
      137: 'Polygon',
      56: 'BSC',
      42161: 'Arbitrum'
    };
    return networks[chainId] || `Chain ${chainId}`;
  };

  if (!isConnected) {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-2xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center space-x-2"
        >
          <Wallet className="w-5 h-5" />
          <span>Connect Wallet</span>
        </motion.button>

        <WalletConnectModal 
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConnect={(walletId) => console.log('Connect:', walletId)}
        />
      </>
    );
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowDropdown(!showDropdown)}
        className="bg-white/10 backdrop-blur-lg border border-white/20 px-4 py-2 rounded-2xl text-white hover:bg-white/20 transition-all flex items-center space-x-3"
      >
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <div className="text-left">
          <div className="text-sm font-medium">{formatAddress(account)}</div>
          <div className="text-xs text-white/60">{getNetworkName(chainId)}</div>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl z-50"
        >
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-white font-medium">{formatAddress(account)}</div>
                <div className="text-white/60 text-sm">{getNetworkName(chainId)}</div>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button
              onClick={disconnectWallet}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-white/5 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WalletButton;
