import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Detect if any wallet is installed
  const detectWallets = useCallback(() => {
    const wallets = {
      metamask: !!window.ethereum,
      trustwallet: !!window.ethereum?.isTrust,
      coinbase: !!window.ethereum?.isCoinbaseWallet,
      phantom: !!window.solana,
      telegram: !!window.TelegramWebApp,
      tonkeeper: !!window.tonkeeper
    };
    return wallets;
  }, []);

  // Connect to specific wallet
  const connectWallet = async (walletId) => {
    setIsConnecting(true);
    setError(null);

    try {
      let web3Provider;

      switch (walletId) {
        case 'metamask':
        case 'trustwallet':
        case 'coinbase':
        case 'rabby':
          web3Provider = await connectEthereumWallet();
          break;

        case 'walletconnect':
          web3Provider = await connectWalletConnect();
          break;

        case 'phantom':
          web3Provider = await connectPhantom();
          break;

        case 'telegram':
          web3Provider = await connectTelegramWallet();
          break;

        case 'tonkeeper':
          web3Provider = await connectTonkeeper();
          break;

        default:
          throw new Error('Unsupported wallet');
      }

      if (web3Provider) {
        setProvider(web3Provider);
        await setupEventListeners(web3Provider);
      }

    } catch (err) {
      setError(err.message);
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  // Ethereum-based wallets (MetaMask, Trust Wallet, etc.)
  const connectEthereumWallet = async () => {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask or another Ethereum wallet');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Get network/chain ID
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      });

      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setAccount(accounts[0]);
      setChainId(parseInt(chainId));

      return web3Provider;

    } catch (error) {
      if (error.code === 4001) {
        throw new Error('Please connect your wallet to continue');
      }
      throw error;
    }
  };

  // WalletConnect integration
  const connectWalletConnect = async () => {
    // You'll need to install @walletconnect/ethereum-provider
    const { EthereumProvider } = await import('@walletconnect/ethereum-provider');
    
    const provider = await EthereumProvider.init({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      chains: [1, 137, 56, 42161], // Ethereum, Polygon, BSC, Arbitrum
      showQrModal: true,
    });

    await provider.enable();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    
    const accounts = await web3Provider.listAccounts();
    const network = await web3Provider.getNetwork();

    setAccount(accounts[0]);
    setChainId(network.chainId);

    return web3Provider;
  };

  // Phantom Wallet (Solana)
  const connectPhantom = async () => {
    if (!window.solana || !window.solana.isPhantom) {
      throw new Error('Please install Phantom wallet for Solana');
    }

    try {
      const response = await window.solana.connect();
      setAccount(response.publicKey.toString());
      setChainId('solana'); // Solana doesn't use chainId like Ethereum

      return { isSolana: true, publicKey: response.publicKey };
    } catch (err) {
      throw new Error('Failed to connect Phantom wallet');
    }
  };

  // Telegram Wallet
  const connectTelegramWallet = async () => {
    if (!window.TelegramWebApp) {
      throw new Error('Telegram Web App not detected');
    }

    try {
      // Telegram Wallet integration
      const result = await window.TelegramWebApp.sendData('connect_wallet');
      // Process Telegram wallet connection
      return { isTelegram: true, ...result };
    } catch (err) {
      throw new Error('Failed to connect Telegram wallet');
    }
  };

  // Tonkeeper
  const connectTonkeeper = async () => {
    if (!window.tonkeeper) {
      throw new Error('Tonkeeper wallet not detected');
    }

    try {
      const accounts = await window.tonkeeper.send('ton_requestAccounts');
      setAccount(accounts[0]);
      setChainId('ton');

      return { isTON: true, account: accounts[0] };
    } catch (err) {
      throw new Error('Failed to connect Tonkeeper wallet');
    }
  };

  // Event listeners for wallet changes
  const setupEventListeners = (web3Provider) => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || null);
      });

      window.ethereum.on('chainChanged', (chainId) => {
        setChainId(parseInt(chainId));
        window.location.reload(); // Recommended by MetaMask
      });

      window.ethereum.on('disconnect', () => {
        disconnectWallet();
      });
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setChainId(null);
    setError(null);
    
    // Clean up event listeners
    if (window.ethereum) {
      window.ethereum.removeAllListeners();
    }
  };

  // Switch network
  const switchNetwork = async (chainId) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        await addNetwork(chainId);
      }
    }
  };

  // Add network to wallet
  const addNetwork = async (chainId) => {
    const networkParams = {
      1: {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        rpcUrls: ['https://mainnet.infura.io/v3/'],
        blockExplorerUrls: ['https://etherscan.io'],
        nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' }
      },
      137: {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorerUrls: ['https://polygonscan.com'],
        nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' }
      },
      // Add other networks as needed
    };

    const params = networkParams[chainId];
    if (!params) return;

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [params],
    });
  };

  // Auto-connect on page load if previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        try {
          await connectWallet('metamask');
        } catch (error) {
          console.log('Auto-connect failed:', error);
        }
      }
    };

    checkConnection();
  }, []);

  return {
    account,
    provider,
    chainId,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    detectWallets,
    isConnected: !!account
  };
};
