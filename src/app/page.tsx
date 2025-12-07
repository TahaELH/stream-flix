'use client';

import { useState, useEffect } from 'react';
import { tmdbService, type TMDBMovie, type TMDBTVShow } from '@/lib/tmdb';
import { HeroSection } from '@/components/HeroSection';
import { ContentRow } from '@/components/ContentRow';
import { Navbar } from '@/components/Navbar';
import { ContentModal } from '@/components/ContentModal';
import { Player } from '@/components/Player';

export default function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState<TMDBMovie[]>([]);
  const [trendingTVShows, setTrendingTVShows] = useState<TMDBTVShow[]>([]);
  const [popularMovies, setPopularMovies] = useState<TMDBMovie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<TMDBTVShow[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<TMDBMovie[]>([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState<TMDBTVShow[]>([]);
  const [featuredContent, setFeaturedContent] = useState<TMDBMovie | TMDBTVShow | null>(null);
  const [selectedContent, setSelectedContent] = useState<TMDBMovie | TMDBTVShow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [playingContent, setPlayingContent] = useState<TMDBMovie | TMDBTVShow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      
      const [
        trendingMoviesData,
        trendingTVData,
        popularMoviesData,
        popularTVData,
        topRatedMoviesData,
        topRatedTVData
      ] = await Promise.all([
        tmdbService.getTrendingMovies(),
        tmdbService.getTrendingTVShows(),
        tmdbService.getPopularMovies(),
        tmdbService.getPopularTVShows(),
        tmdbService.getTopRatedMovies(),
        tmdbService.getTopRatedTVShows()
      ]);

      setTrendingMovies(trendingMoviesData);
      setTrendingTVShows(trendingTVData);
      setPopularMovies(popularMoviesData);
      setPopularTVShows(popularTVData);
      setTopRatedMovies(topRatedMoviesData);
      setTopRatedTVShows(topRatedTVData);

      // Set featured content (highest rated from trending)
      const allTrending = [...trendingMoviesData, ...trendingTVData];
      if (allTrending.length > 0) {
        const featured = allTrending.reduce((highest, current) => 
          current.vote_average > highest.vote_average ? current : highest
        );
        setFeaturedContent(featured);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentSelect = (content: TMDBMovie | TMDBTVShow) => {
    setSelectedContent(content);
    setIsModalOpen(true);
  };

  const handlePlay = (content?: TMDBMovie | TMDBTVShow) => {
    const contentToPlay = content || selectedContent || featuredContent;
    if (contentToPlay) {
      setPlayingContent(contentToPlay);
      setIsPlayerOpen(true);
      setIsModalOpen(false);
    }
  };

  const handleMoreInfo = () => {
    if (featuredContent) {
      setSelectedContent(featuredContent);
      setIsModalOpen(true);
    }
  };

  const handleSearch = (query: string) => {
    // Implement search functionality
    console.log('Searching for:', query);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar onSearch={handleSearch} onMenuToggle={() => {}} />
      
      <div className="pt-16">
        {featuredContent && (
          <HeroSection
            featuredContent={featuredContent}
            onPlay={() => handlePlay(featuredContent)}
            onMoreInfo={handleMoreInfo}
          />
        )}

        <div className="space-y-8 pb-8">
          {trendingMovies.length > 0 && (
            <ContentRow
              title="Trending Movies"
              items={trendingMovies}
              onItemSelect={handleContentSelect}
            />
          )}

          {trendingTVShows.length > 0 && (
            <ContentRow
              title="Trending TV Shows"
              items={trendingTVShows}
              onItemSelect={handleContentSelect}
            />
          )}

          {popularMovies.length > 0 && (
            <ContentRow
              title="Popular Movies"
              items={popularMovies}
              onItemSelect={handleContentSelect}
            />
          )}

          {popularTVShows.length > 0 && (
            <ContentRow
              title="Popular TV Shows"
              items={popularTVShows}
              onItemSelect={handleContentSelect}
            />
          )}

          {topRatedMovies.length > 0 && (
            <ContentRow
              title="Top Rated Movies"
              items={topRatedMovies}
              onItemSelect={handleContentSelect}
            />
          )}

          {topRatedTVShows.length > 0 && (
            <ContentRow
              title="Top Rated TV Shows"
              items={topRatedTVShows}
              onItemSelect={handleContentSelect}
            />
          )}
        </div>
      </div>

      <ContentModal
        content={selectedContent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPlay={handlePlay}
      />

      {playingContent && (
        <Player
          content={playingContent}
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
        />
      )}
    </div>
  );
}