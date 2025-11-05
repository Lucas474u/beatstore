// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BeatNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;

    struct Beat {
        uint256 tokenId;
        address creator;
        uint256 price;
        string audioHash;
        string metadataHash;
        bool isListed;
    }

    mapping(uint256 => Beat) public beats;
    mapping(uint256 => address) public beatOwners;
    
    uint256 public platformFee = 250; // 2.5%
    address public platformWallet;

    event BeatMinted(
        uint256 indexed tokenId,
        address indexed creator,
        uint256 price,
        string audioHash
    );

    event BeatPurchased(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price
    );

    constructor() ERC721("BeatNFT", "BEAT") {
        platformWallet = msg.sender;
    }

    function mintBeat(
        string memory _tokenURI,
        uint256 _price,
        string memory _audioHash
    ) public returns (uint256) {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        beats[tokenId] = Beat({
            tokenId: tokenId,
            creator: msg.sender,
            price: _price,
            audioHash: _audioHash,
            metadataHash: _tokenURI,
            isListed: true
        });

        beatOwners[tokenId] = msg.sender;

        emit BeatMinted(tokenId, msg.sender, _price, _audioHash);
        return tokenId;
    }

    function purchaseBeat(uint256 _tokenId) public payable {
        Beat storage beat = beats[_tokenId];
        require(beat.isListed, "Beat not for sale");
        require(msg.value >= beat.price, "Insufficient payment");

        address previousOwner = beatOwners[_tokenId];
        
        // Calculate fees
        uint256 platformFeeAmount = (beat.price * platformFee) / 10000;
        uint256 creatorAmount = beat.price - platformFeeAmount;

        // Transfer payments
        payable(platformWallet).transfer(platformFeeAmount);
        payable(beat.creator).transfer(creatorAmount);

        // Transfer NFT
        _transfer(previousOwner, msg.sender, _tokenId);
        beatOwners[_tokenId] = msg.sender;
        beat.isListed = false;

        emit BeatPurchased(_tokenId, msg.sender, beat.price);
    }

    function listBeat(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender, "Not owner");
        beats[_tokenId].price = _price;
        beats[_tokenId].isListed = true;
    }

    function getBeat(uint256 _tokenId) public view returns (Beat memory) {
        return beats[_tokenId];
    }

    // Override required by Solidity
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
