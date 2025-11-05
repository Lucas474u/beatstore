const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Web3 = require('web3');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB models
const Beat = require('./models/Beat');
const User = require('./models/User');

// Web3 configuration
const web3 = new Web3(process.env.ETH_RPC_URL);

// Routes
app.post('/api/beats', async (req, res) => {
  try {
    const { title, description, price, audioFile, imageFile, genre, bpm, key } = req.body;
    
    const beat = new Beat({
      title,
      description,
      price,
      audioFile,
      imageFile,
      genre,
      bpm,
      key,
      creator: req.body.creatorAddress,
      tokenId: null, // Will be set after minting
      contractAddress: null
    });

    await beat.save();
    res.json(beat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/beats', async (req, res) => {
  try {
    const beats = await Beat.find({ isListed: true })
      .populate('creator', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(beats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/purchase', async (req, res) => {
  try {
    const { beatId, buyerAddress, transactionHash } = req.body;
    
    const beat = await Beat.findById(beatId);
    if (!beat) {
      return res.status(404).json({ error: 'Beat not found' });
    }

    // Verify transaction
    const receipt = await web3.eth.getTransactionReceipt(transactionHash);
    if (!receipt.status) {
      return res.status(400).json({ error: 'Transaction failed' });
    }

    // Update beat ownership
    beat.owner = buyerAddress;
    beat.isListed = false;
    beat.purchaseTransaction = transactionHash;
    await beat.save();

    res.json({ success: true, beat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// IPFS upload endpoint
app.post('/api/upload', async (req, res) => {
  try {
    const { file, type } = req.body;
    
    // Upload to IPFS via Pinata
    const pinataResponse = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', 
      {
        pinataContent: file,
        pinataMetadata: {
          name: `${type}-${Date.now()}`
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PINATA_JWT}`
        }
      }
    );

    res.json({ ipfsHash: pinataResponse.data.IpfsHash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
