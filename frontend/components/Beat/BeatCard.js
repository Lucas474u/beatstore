import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, Share2, ShoppingCart, Eye } from 'lucide-react';

const BeatCard = ({ beat, onPlay, onPurchase, isConnected }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      className="beat-card group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover="hover"
    >
      {/* Beat Image/Artwork */}
      <div className="relative overflow-hidden rounded-xl mb-4">
        <img 
          src={beat.imageFile} 
          alt={beat.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => onPlay(beat)}
            className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-400 transition-all transform hover:scale-110"
          >
            <Play className="w-5 h-5 text-white fill-current" />
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex space-x-2">
          <span className="px-2 py-1 bg-purple-500/80 rounded text-xs text-white">
            {beat.genre}
          </span>
          <span className="px-2 py-1 bg-cyan-500/80 rounded text-xs text-white">
            {beat.bpm} BPM
          </span>
        </div>
      </div>

      {/* Beat Info */}
      <div className="p-4">
        <h3 className="text-white font-bold text-lg mb-2 truncate">{beat.title}</h3>
        <p className="text-white/60 text-sm mb-3 line-clamp-2">{beat.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-white/40">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`hover:text-red-400 transition-colors ${isLiked ? 'text-red-400' : ''}`}
            >
              <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            <button className="hover:text-cyan-400 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span className="text-xs">{beat.plays}</span>
            </div>
          </div>
          
          <div className="cyber-price text-sm">
            {beat.price}
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          onClick={() => isConnected ? onPurchase(beat) : onPlay(beat)}
          className={`w-full py-3 rounded-xl font-semibold transition-all ${
            isConnected 
              ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white' 
              : 'bg-white/10 hover:bg-white/20 text-white/80'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isConnected ? (
            <>
              <ShoppingCart className="w-4 h-4 inline mr-2" />
              Buy Now
            </>
          ) : (
            'Preview Beat'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BeatCard;
