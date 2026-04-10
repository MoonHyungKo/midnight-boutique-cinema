"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Film, Info } from "lucide-react";
import Image from "next/image";
import VideoPlayer from "./VideoPlayer";

interface Movie {
  id: number;
  title: string;
  director: string;
  cast: string;
  plot: string;
  poster: string;
  url: string;
}

export default function MovieModal({ movie, onClose }: { movie: Movie | null, onClose: () => void }) {
  // Body Scroll Lock
  useEffect(() => {
    if (movie) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [movie]);

  return (
    <AnimatePresence>
      {movie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            layoutId={`movie-${movie.id}`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl max-h-[90vh] md:max-h-none overflow-y-auto no-scrollbar md:overflow-hidden glass rounded-3xl flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50"
          >
            {/* Close Button - Optimized for Mobile */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-[60] p-2.5 rounded-full bg-black/40 hover:bg-black/60 transition-all text-white backdrop-blur-lg border border-white/10"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Poster / Video Area */}
            <div className="w-full md:w-1/2 px-5 py-4 md:p-8 flex items-center justify-center bg-black/20 shrink-0">
              <VideoPlayer url={movie.url} poster={movie.poster} />
            </div>

            {/* Info Area */}
            <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-gradient-to-b md:bg-none from-transparent to-black/20">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="no-scrollbar"
              >
                <div className="flex items-center gap-2 text-accent mb-4">
                  <Film className="w-4 h-4" />
                  <span className="text-[10px] md:text-sm font-light tracking-widest uppercase">Special Feature</span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-serif mb-6 md:mb-10 text-white leading-tight">
                  {movie.title}
                </h2>

                <div className="space-y-6 md:space-y-8 text-white/70">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Info className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Director</p>
                      <p className="text-base md:text-lg font-medium">{movie.director}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Cast</p>
                      <p className="text-base md:text-lg font-medium">{movie.cast}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-3">Synopsis</p>
                    <p className="text-base md:text-lg leading-relaxed font-light italic text-white/80">
                      "{movie.plot}"
                    </p>
                  </div>
                </div>

                <div className="mt-8 md:mt-12 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <p className="text-accent text-xs md:text-sm font-medium tracking-wide">
                    Enjoy the premium boutique experience
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
