import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const dataPath = path.join(process.cwd(), "lib", "movies.json");

async function getMovies() {
  const content = await readFile(dataPath, "utf-8");
  return JSON.parse(content);
}

async function saveMovies(movies: any[]) {
  await writeFile(dataPath, JSON.stringify(movies, null, 2), "utf-8");
}

export async function GET() {
  try {
    const movies = await getMovies();
    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load movies" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const newMovie = await request.json();
    const movies = await getMovies();
    
    // 자동 ID 생성
    const id = movies.length > 0 ? Math.max(...movies.map((m: any) => m.id)) + 1 : 1;
    const movieToAdd = { ...newMovie, id };
    
    movies.push(movieToAdd);
    await saveMovies(movies);
    
    return NextResponse.json(movieToAdd);
  } catch (error) {
    console.error("Save Error:", error);
    return NextResponse.json({ error: "Failed to save movie" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedMovie = await request.json();
    const movies = await getMovies();
    
    const index = movies.findIndex((m: any) => m.id === updatedMovie.id);
    if (index === -1) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }
    
    movies[index] = { ...movies[index], ...updatedMovie };
    await saveMovies(movies);
    
    return NextResponse.json(movies[index]);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Failed to update movie" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    let movies = await getMovies();
    movies = movies.filter((m: any) => m.id !== id);
    await saveMovies(movies);
    return NextResponse.json({ message: "Movie deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete movie" }, { status: 500 });
  }
}
