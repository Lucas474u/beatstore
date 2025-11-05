import { ethers } from 'ethers';
import BeatNFTABI from '../contracts/BeatNFT.json';

export class BeatMarketplace {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.address = null;
  }

  async connectWallet() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();
        this.address = await this.signer.getAddress();
        
        // Initialize contract
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
        this.contract = new ethers.Contract(contractAddress, BeatNFTABI.abi, this.signer);
        
        return this.address;
      } catch (error) {
        console.error('Error connecting wallet:', error);
        throw error;
      }
    } else {
      throw new Error('Please install MetaMask');
    }
  }

  async mintBeat(metadataURI, price, audioHash) {
    if (!this.contract) throw new Error('Wallet not connected');
    
    const tx = await this.contract.mintBeat(
      metadataURI,
      ethers.utils.parseEther(price.toString()),
      audioHash
    );
    
    const receipt = await tx.wait();
    return receipt;
  }

  async purchaseBeat(tokenId, price) {
    if (!this.contract) throw new Error('Wallet not connected');
    
    const tx = await this.contract.purchaseBeat(tokenId, {
      value: ethers.utils.parseEther(price.toString())
    });
    
    const receipt = await tx.wait();
    return receipt;
  }

  async listBeat(tokenId, price) {
    if (!this.contract) throw new Error('Wallet not connected');
    
    const tx = await this.contract.listBeat(
      tokenId,
      ethers.utils.parseEther(price.toString())
    );
    
    return await tx.wait();
  }

  async getBeat(tokenId) {
    if (!this.contract) throw new Error('Contract not initialized');
    return await this.contract.getBeat(tokenId);
  }
}

export const supportedNetworks = {
  1: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
  137: { name: 'Polygon', symbol: 'MATIC', decimals: 18 },
  56: { name: 'BNB Chain', symbol: 'BNB', decimals: 18 },
  42161: { name: 'Arbitrum', symbol: 'ETH', decimals: 18 },
  10: { name: 'Optimism', symbol: 'ETH', decimals: 18 },
  1313161554: { name: 'Aurora', symbol: 'ETH', decimals: 18 }
};

export const cryptoPayments = {
  acceptPayment: async (networkId, amount, recipient) => {
    const network = supportedNetworks[networkId];
    if (!network) throw new Error('Unsupported network');
    
    // Implementation for cross-chain payments
    // This would integrate with payment processors like MoonPay, Wyre, or cross-chain bridges
  }
};
