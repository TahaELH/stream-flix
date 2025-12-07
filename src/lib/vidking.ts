const VIDKING_BASE_URL = 'https://vidking.net';

export interface VidKingStream {
  url: string;
  quality: string;
  type: 'movie' | 'series';
  season?: number;
  episode?: number;
}

export interface VidKingSearchResult {
  id: string;
  title: string;
  year: number;
  type: 'movie' | 'series';
  poster?: string;
  imdbId?: string;
}

class VidKingService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = VIDKING_BASE_URL;
  }

  async searchContent(query: string, type?: 'movie' | 'series'): Promise<VidKingSearchResult[]> {
    try {
      const searchUrl = new URL(`${this.baseUrl}/api/search`);
      searchUrl.searchParams.set('q', query);
      if (type) {
        searchUrl.searchParams.set('type', type);
      }

      const response = await fetch(searchUrl.toString(), {
        headers: {
          'Referer': this.baseUrl,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`VidKing search error: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('VidKing search error:', error);
      return [];
    }
  }

  async getStreamUrl(contentId: string, type: 'movie' | 'series', season?: number, episode?: number): Promise<VidKingStream | null> {
    try {
      const streamUrl = new URL(`${this.baseUrl}/api/stream`);
      streamUrl.searchParams.set('id', contentId);
      streamUrl.searchParams.set('type', type);
      
      if (type === 'series' && season !== undefined && episode !== undefined) {
        streamUrl.searchParams.set('season', season.toString());
        streamUrl.searchParams.set('episode', episode.toString());
      }

      const response = await fetch(streamUrl.toString(), {
        headers: {
          'Referer': this.baseUrl,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`VidKing stream error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.stream && data.stream.url) {
        return {
          url: data.stream.url,
          quality: data.stream.quality || 'auto',
          type,
          season,
          episode
        };
      }

      return null;
    } catch (error) {
      console.error('VidKing stream error:', error);
      return null;
    }
  }

  async getMovieStream(movieTitle: string, year?: number): Promise<VidKingStream | null> {
    const searchQuery = year ? `${movieTitle} ${year}` : movieTitle;
    const searchResults = await this.searchContent(searchQuery, 'movie');
    
    if (searchResults.length > 0) {
      const bestMatch = searchResults[0];
      return await this.getStreamUrl(bestMatch.id, 'movie');
    }
    
    return null;
  }

  async getTVShowStream(showTitle: string, season: number = 1, episode: number = 1): Promise<VidKingStream | null> {
    const searchResults = await this.searchContent(showTitle, 'series');
    
    if (searchResults.length > 0) {
      const bestMatch = searchResults[0];
      return await this.getStreamUrl(bestMatch.id, 'series', season, episode);
    }
    
    return null;
  }

  getEmbedUrl(streamUrl: string): string {
    return `${this.baseUrl}/embed/${streamUrl}`;
  }
}

export const vidkingService = new VidKingService();