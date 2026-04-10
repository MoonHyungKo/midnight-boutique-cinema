"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export default function EntrancePage() {
  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-shinkai-sky bg-cover bg-center">
      {/* Dynamic Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />

      {/* Advanced Particle System */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[2px] bg-white rounded-full"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            opacity: 0,
            scale: 0 
          }}
          animate={{ 
            opacity: [0, 0.7, 0],
            scale: [0, 1.5, 0],
            y: ["0%", "-20%"]
          }}
          transition={{ 
            duration: Math.random() * 8 + 4, 
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Floating Light Rays */}
      <motion.div 
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Content Container */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div 
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="text-accent text-xs md:text-sm font-medium mb-6 flex items-center justify-center gap-3 uppercase"
          >
            <div className="h-[1px] w-8 bg-accent/40" />
            DANA'S ARCHIVE
            <div className="h-[1px] w-8 bg-accent/40" />
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl font-serif text-white mb-16 leading-[1.2] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            A Private Lounge<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-accent/80 to-white/60">
              For Dana
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <Link href="/lounge">
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "rgba(212, 175, 55, 0.15)",
                borderColor: "rgba(212, 175, 55, 0.9)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-black/30 border border-accent/40 text-accent font-medium rounded-full flex items-center gap-3 backdrop-blur-md transition-all duration-500 group relative overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.1)]"
            >
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
              
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="text-lg tracking-wider">Step Into Our Story</span>
              <Heart className="w-4 h-4 text-accent/60 group-hover:scale-125 transition-transform" />
            </motion.button>
          </Link>
          
          <p className="text-white/30 text-xs font-light tracking-[0.2em] animate-pulse uppercase">
            Click to enter the magic
          </p>
        </motion.div>
      </div>

      {/* Aesthetic footer */}
      <motion.div 
        className="absolute bottom-12 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-white/20" />
        <span className="text-white/40 text-[10px] font-light tracking-[0.4em] uppercase">
          For my dearest Dana
        </span>
      </motion.div>
      
      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </main>
  );
}
