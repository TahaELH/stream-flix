const TMDB_API_KEY = '3847c6bb1eccfa8b2a4af372af0eb9cd';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  popularity: number;
  video: boolean;
  vote_count: number;
}

export interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  vote_count: number;
}

export interface TMDBVideo {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
}

export interface TMDBDetailResponse {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genres: Array<{
    id: number;
    name: string;
  }>;
  runtime?: number;
  episode_run_time?: number[];
  status: string;
  tagline?: string;
  videos?: {
    results: TMDBVideo[];
  };
}

class TMDBService {
  private apiKey: string;
  private baseUrl: string;
  private imageBase: string;

  constructor() {
    this.apiKey = TMDB_API_KEY;
    this.baseUrl = TMDB_BASE_URL;
    this.imageBase = TMDB_IMAGE_BASE;
  }

  private async fetchFromTMDB(endpoint: string, params: Record<string, string> = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.set('api_key', this.apiKey);
    url.searchParams.set('language', 'en-US');
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });

    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('TMDB API fetch error:', error);
      throw error;
    }
  }

  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBMovie[]> {
    const data = await this.fetchFromTMDB(`/trending/movie/${timeWindow}`);
    return data.results;
  }

  async getTrendingTVShows(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBTVShow[]> {
    const data = await this.fetchFromTMDB(`/trending/tv/${timeWindow}`);
    return data.results;
  }

  async getPopularMovies(page: number = 1): Promise<TMDBMovie[]> {
    const data = await this.fetchFromTMDB('/movie/popular', { page: page.toString() });
    return data.results;
  }

  async getPopularTVShows(page: number = 1): Promise<TMDBTVShow[]> {
    const data = await this.fetchFromTMDB('/tv/popular', { page: page.toString() });
    return data.results;
  }

  async getTopRatedMovies(page: number = 1): Promise<TMDBMovie[]> {
    const data = await this.fetchFromTMDB('/movie/top_rated', { page: page.toString() });
    return data.results;
  }

  async getTopRatedTVShows(page: number = 1): Promise<TMDBTVShow[]> {
    const data = await this.fetchFromTMDB('/tv/top_rated', { page: page.toString() });
    return data.results;
  }

  async getMovieDetails(movieId: number): Promise<TMDBDetailResponse> {
    const data = await this.fetchFromTMDB(`/movie/${movieId}`, {
      append_to_response: 'videos'
    });
    return data;
  }

  async getTVShowDetails(tvId: number): Promise<TMDBDetailResponse> {
    const data = await this.fetchFromTMDB(`/tv/${tvId}`, {
      append_to_response: 'videos'
    });
    return data;
  }

  async searchMovies(query: string, page: number = 1): Promise<TMDBMovie[]> {
    const data = await this.fetchFromTMDB('/search/movie', {
      query,
      page: page.toString()
    });
    return data.results;
  }

  async searchTVShows(query: string, page: number = 1): Promise<TMDBTVShow[]> {
    const data = await this.fetchFromTMDB('/search/tv', {
      query,
      page: page.toString()
    });
    return data.results;
  }

  async getMoviesByGenre(genreId: number, page: number = 1): Promise<TMDBMovie[]> {
    const data = await this.fetchFromTMDB('/discover/movie', {
      with_genres: genreId.toString(),
      page: page.toString()
    });
    return data.results;
  }

  async getTVShowsByGenre(genreId: number, page: number = 1): Promise<TMDBTVShow[]> {
    const data = await this.fetchFromTMDB('/discover/tv', {
      with_genres: genreId.toString(),
      page: page.toString()
    });
    return data.results;
  }

  getImageUrl(path: string, size: string = 'w500'): string {
    if (!path) return '/placeholder-movie.jpg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  getBackdropUrl(path: string, size: string = 'w1280'): string {
    if (!path) return '/placeholder-backdrop.jpg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
}

export const tmdbService = new TMDBService();