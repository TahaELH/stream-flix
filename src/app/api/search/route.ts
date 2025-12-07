import { NextRequest, NextResponse } from 'next/server';
import { tmdbService } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const type = searchParams.get('type'); // 'movie', 'tv', or 'all'
  const page = parseInt(searchParams.get('page') || '1');

  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      { error: 'Search query must be at least 2 characters long' },
      { status: 400 }
    );
  }

  try {
    let results = [];

    if (type === 'movie') {
      results = await tmdbService.searchMovies(query, page);
    } else if (type === 'tv') {
      results = await tmdbService.searchTVShows(query, page);
    } else {
      // Search both movies and TV shows
      const [movies, tvShows] = await Promise.all([
        tmdbService.searchMovies(query, page),
        tmdbService.searchTVShows(query, page)
      ]);
      
      // Combine and sort by popularity/vote average
      results = [...movies, ...tvShows].sort((a, b) => {
        const scoreA = a.popularity * (a.vote_average / 10);
        const scoreB = b.popularity * (b.vote_average / 10);
        return scoreB - scoreA;
      });
    }

    return NextResponse.json({
      results,
      query,
      type: type || 'all',
      page,
      totalResults: results.length
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}