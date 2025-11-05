import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { BeatMarketplace } from '../utils/web3';

export const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);

  // Авто-коннект при загрузке
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await setupProvider();
        }
      } catch (error) {
        console.log('No wallet connected');
      }
    }
  };

  const setupProvider = async () => {
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    const network = await web3Provider.getNetwork();

    setProvider(web3Provider);
    setAccount(address);
    setChainId(network.chainId);

    // Получаем баланс
    const balance = await web3Provider.getBalance(address);
    setBalance(ethers.utils.formatEther(balance));

    // Слушаем события кошелька
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return web3Provider;
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask or another Web3 wallet');
    }

    setIsConnecting(true);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = await setupProvider();
      
      // Инициализируем маркетплейс
      const marketplace = new BeatMarketplace();
      await marketplace.connectWallet();
      
      return { provider, marketplace };
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = (chainId) => {
    setChainId(parseInt(chainId));
    window.location.reload();
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setChainId(null);
    setBalance('0');
    
    if (window.ethereum) {
      window.ethereum.removeAllListeners();
    }
  };

  const switchNetwork = async (targetChainId) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (error) {
      if (error.code === 4902) {
        // Сеть не добавлена, предлагаем добавить
        await addNetwork(targetChainId);
      }
    }
  };

  const addNetwork = async (chainId) => {
    const networkParams = {
      1: {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        rpcUrls: ['https://mainnet.infura.io/v3/'],
        nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
        blockExplorerUrls: ['https://etherscan.io']
      },
      137: {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        rpcUrls: ['https://polygon-rpc.com'],
        nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
        blockExplorerUrls: ['https://polygonscan.com']
      },
      56: {
        chainId: '0x38',
        chainName: 'BNB Smart Chain',
        rpcUrls: ['https://bsc-dataseed.binance.org'],
        nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
        blockExplorerUrls: ['https://bscscan.com']
      }
    };

    const params = networkParams[chainId];
    if (params) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [params],
      });
    }
  };

  return {
    account,
    provider,
    chainId,
    balance,
    isConnecting,
    isConnected: !!account,
    connectWallet,
    disconnectWallet,
    switchNetwork
  };
};
