"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Upload, 
  ChevronLeft, 
  Film, 
  User, 
  AlignLeft, 
  Link as LinkIcon, 
  Save, 
  Lock,
  Loader2,
  CheckCircle2,
  Home
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // 신규 영화 폼 상태
  const [newMovie, setNewMovie] = useState({
    title: "",
    director: "Dana's Archive Team",
    cast: "Dana & Me",
    plot: "",
    url: "",
    poster: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      fetchMovies();
    }
  }, [isLoggedIn]);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/movies");
      const data = await res.json();
      setMovies(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "dana1234") { // 예시 비밀번호
      setIsLoggedIn(true);
    } else {
      alert("Incorrect password!");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      let posterUrl = newMovie.poster;

      // 1. 파일 업로드 처리
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });
        const uploadData = await uploadRes.json();
        posterUrl = uploadData.url;
      }

      if (!posterUrl) {
        alert("Please upload a poster image or enter a path.");
        setIsSaving(false);
        return;
      }

      // 2. 영화 데이터 저장
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newMovie, poster: posterUrl })
      });

      if (res.ok) {
        setSuccessMessage("Movie registered successfully!");
        setNewMovie({
          title: "",
          director: "Dana's Archive Team",
          cast: "Dana & Me",
          plot: "",
          url: "",
          poster: ""
        });
        setSelectedFile(null);
        setPreviewUrl("");
        fetchMovies();
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;
    
    try {
      await fetch("/api/movies", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      fetchMovies();
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass p-10 rounded-3xl text-center"
        >
          <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Lock className="text-accent w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif text-white mb-2">Admin Portal</h1>
          <p className="text-white/40 mb-10 font-light">Authentication required to manage Dana's Cinema.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              placeholder="Enter password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-accent/50 transition-colors"
            />
            <button 
              type="submit"
              className="w-full bg-accent text-black font-medium py-4 rounded-xl hover:bg-accent/90 transition-transform active:scale-95"
            >
              Sign In
            </button>
          </form>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="px-6 py-10 md:px-20 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link href="/" className="inline-flex items-center text-white/40 hover:text-accent transition-colors gap-2 text-sm">
              <Home className="w-4 h-4" />
              Main Entrance
            </Link>
            <div className="w-[1px] h-3 bg-white/10" />
            <Link href="/lounge" className="inline-flex items-center text-white/40 hover:text-accent transition-colors gap-2 text-sm">
              <ChevronLeft className="w-4 h-4" />
              Return to Lounge
            </Link>
          </div>
          <h1 className="text-3xl font-serif text-white">Movie Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-white/40 text-sm italic font-light">Welcome, Administrator</p>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="px-4 py-2 border border-white/10 rounded-lg text-xs text-white/60 hover:bg-white/5 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-20 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Registration Form */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
              <Plus className="text-accent w-5 h-5" />
            </div>
            <h2 className="text-2xl font-serif text-white">Register New Movie</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 glass p-8 md:p-10 rounded-3xl">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-white/40 text-sm font-light flex items-center gap-2">
                <Film className="w-3 h-3" /> Movie Title
              </label>
              <input 
                required
                type="text" 
                placeholder="Enter title"
                value={newMovie.title}
                onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>

            {/* Poster Upload */}
            <div className="space-y-2">
              <label className="text-white/40 text-sm font-light flex items-center gap-2">
                <Upload className="w-3 h-3" /> Poster Image
              </label>
              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`w-full aspect-[2/3] max-h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${previewUrl ? 'border-accent/50 bg-accent/5' : 'border-white/10 bg-white/5 group-hover:border-white/20'}`}>
                  {previewUrl ? (
                    <Image src={previewUrl} alt="Preview" fill className="object-contain p-4" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-white/20 mb-3 group-hover:scale-110 transition-transform" />
                      <p className="text-white/30 text-xs text-center font-light px-6">
                        Drag & drop or<br />click to upload (2:3 aspect ratio)
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* URL */}
            <div className="space-y-2">
              <label className="text-white/40 text-sm font-light flex items-center gap-2">
                <LinkIcon className="w-3 h-3" /> Video URL (Google Drive)
              </label>
              <input 
                required
                type="text" 
                placeholder="https://docs.google.com/uc?id=..."
                value={newMovie.url}
                onChange={(e) => setNewMovie({...newMovie, url: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>

            {/* Plot */}
            <div className="space-y-2">
              <label className="text-white/40 text-sm font-light flex items-center gap-2">
                <AlignLeft className="w-3 h-3" /> Movie Plot
              </label>
              <textarea 
                required
                rows={4}
                placeholder="Describe the cinematic experience"
                value={newMovie.plot}
                onChange={(e) => setNewMovie({...newMovie, plot: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-accent/50 transition-colors resize-none"
              />
            </div>

            {/* Cast & Director */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white/40 text-sm font-light flex items-center gap-2">
                  <User className="w-3 h-3" /> Cast
                </label>
                <input 
                  type="text" 
                  value={newMovie.cast}
                  onChange={(e) => setNewMovie({...newMovie, cast: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-colors text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white/40 text-sm font-light flex items-center gap-2">
                   Director
                </label>
                <input 
                  type="text" 
                  value={newMovie.director}
                  onChange={(e) => setNewMovie({...newMovie, director: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-colors text-sm"
                />
              </div>
            </div>

            <button 
              disabled={isSaving}
              type="submit"
              className="w-full bg-accent text-black font-semibold py-5 rounded-2xl hover:bg-accent/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isSaving ? "Saving..." : "Upload Movie"}
            </button>
            
            <AnimatePresence>
              {successMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-green-500/20 text-green-400 py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-sm border border-green-500/30"
                >
                  <CheckCircle2 className="w-4 h-4" /> {successMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </section>

        {/* Current Movie List */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
              <Film className="text-white/60 w-5 h-5" />
            </div>
            <h2 className="text-2xl font-serif text-white">Current Collection ({movies.length})</h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
          ) : (
            <div className="space-y-4 max-h-[1000px] overflow-y-auto pr-2 custom-scrollbar">
              {movies.map((movie) => (
                <motion.div 
                  key={movie.id}
                  layoutId={`admin-movie-${movie.id}`}
                  className="glass p-4 rounded-2xl flex items-center gap-5 group"
                >
                  <div className="relative w-20 aspect-[2/3] rounded-lg overflow-hidden shrink-0">
                    <Image src={movie.poster} alt={movie.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate mb-1">{movie.title}</h3>
                    <p className="text-white/30 text-xs truncate font-light mb-2">{movie.director} | {movie.cast}</p>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] text-accent/60 uppercase tracking-widest border border-accent/20 px-2 py-0.5 rounded">Active</span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(movie.id);
                    }}
                    className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
              {movies.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <p className="text-white/20 font-light italic">No movies in the collection.</p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
