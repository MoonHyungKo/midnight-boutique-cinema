"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, Maximize, RotateCcw, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface VideoPlayerProps {
  url: string;
  poster: string;
}

export default function VideoPlayer({ url, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Google Drive Identification
  const driveEmbedUrl = (() => {
    const match = url.match(/(?:\/d\/|id=)([\w-]+)/);
    if (match && (url.includes("drive.google.com") || url.includes("docs.google.com"))) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return null;
  })();

  const startPlayback = () => {
    setShowPreview(false);
    if (!driveEmbedUrl) {
      setIsLoading(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {
            setError(true);
            setIsLoading(false);
          });
          setIsPlaying(true);
        }
      }, 100);
    }
  };

  const togglePlay = () => {
    if (videoRef.current && !error) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play().catch(() => setError(true));
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(current);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden group shadow-2xl border border-white/10">
      {/* Video Element or Iframe */}
      {!showPreview && (
        <>
          {driveEmbedUrl ? (
            <iframe
              src={driveEmbedUrl}
              className="w-full h-full border-none"
              allow="autoplay; fullscreen"
              onLoad={() => setIsLoading(false)}
            />
          ) : (
            <video
              ref={videoRef}
              src={url}
              className={`w-full h-full cursor-pointer transition-opacity duration-700 ${isLoading || error ? 'opacity-0' : 'opacity-100'}`}
              onClick={togglePlay}
              onTimeUpdate={handleTimeUpdate}
              onWaiting={() => setIsLoading(true)}
              onPlaying={() => setIsLoading(false)}
              onError={() => setError(true)}
              onLoadedData={() => {
                setIsLoading(false);
                setError(false);
              }}
              autoPlay
            />
          )}
        </>
      )}

      {/* Poster Preview State */}
      <AnimatePresence>
        {showPreview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40"
          >
            <Image 
              src={poster} 
              alt="Movie Poster" 
              fill 
              className="object-cover brightness-50"
            />
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
            
            {/* Stylish Play Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={startPlayback}
              className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-accent/20 backdrop-blur-xl border border-accent/40 flex items-center justify-center group/play transition-all duration-500 hover:bg-accent/40 hover:border-accent/60 shadow-[0_0_50px_rgba(212,175,55,0.3)] shadow-accent/20 pointer-events-auto"
            >
              <div className="w-16 h-16 rounded-full bg-accent/80 flex items-center justify-center transition-transform duration-500 group-hover/play:scale-110">
                <Play className="w-8 h-8 text-black fill-black ml-1" />
              </div>
              
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border border-accent/20 animate-ping opacity-20" />
            </motion.button>

            <div className="absolute bottom-10 left-0 right-0 text-center">
              <p className="text-white/60 text-xs font-light tracking-[0.3em] uppercase">Click to play experience</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Loading State */}
      <AnimatePresence>
        {isLoading && !error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md z-10 pointer-events-none"
          >
            <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
            <p className="text-white/60 text-sm font-light tracking-widest uppercase">Preparing the magic...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-50 px-8 text-center px-4"
          >
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-serif text-white mb-4">Stream Unavailable</h3>
            <p className="text-white/40 text-sm mb-10 leading-relaxed max-w-sm">
              Direct playback is restricted for this stream. Please use the external link to enjoy the movie.
            </p>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-10 py-4 bg-accent/10 border border-accent/30 text-accent rounded-full text-sm font-medium flex items-center gap-3 hover:bg-accent/20 transition-all active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
              Watch on Google Drive
            </a>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Custom Video Controls (Only show for non-drive videos when playing) */}
      {!error && !showPreview && !driveEmbedUrl && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
          {/* Progress Bar */}
          <div className="w-full h-1 bg-white/10 rounded-full mb-6 overflow-hidden relative cursor-pointer group/progress">
            <div 
              className="h-full bg-accent transition-all duration-100 relative" 
              style={{ width: `${progress}%` }} 
            >
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            </div>
          </div>
          
          <div className="flex items-center justify-between text-white/80">
            <div className="flex items-center gap-8">
              <button onClick={togglePlay} className="hover:text-accent transition-colors">
                {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current" />}
              </button>
              <RotateCcw 
                className="w-5 h-5 hover:text-accent cursor-pointer transition-transform hover:rotate-[-45deg]" 
                onClick={() => { if(videoRef.current) videoRef.current.currentTime = 0 }}
              />
              <Volume2 className="w-5 h-5 hover:text-accent cursor-pointer" />
            </div>
            <button 
              className="hover:text-accent transition-colors p-2"
              onClick={() => videoRef.current?.requestFullscreen()}
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
