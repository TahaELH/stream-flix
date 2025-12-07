'use client';

import { useState, useEffect } from 'react';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { tmdbService, type TMDBMovie, type TMDBTVShow } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  featuredContent: TMDBMovie | TMDBTVShow;
  onPlay: () => void;
  onMoreInfo: () => void;
}

export function HeroSection({ featuredContent, onPlay, onMoreInfo }: HeroSectionProps) {
  const [isMuted, setIsMuted] = useState(true);
  const title = 'title' in featuredContent ? featuredContent.title : featuredContent.name;
  const description = featuredContent.overview;
  const releaseDate = 'release_date' in featuredContent ? featuredContent.release_date : featuredContent.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';

  return (
    <div className="relative h-[70vh] min-h-[500px] w-full">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img
          src={tmdbService.getBackdropUrl(featuredContent.backdrop_path, 'w1280')}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-backdrop.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-2xl px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {title}
          </h1>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="text-green-400 font-semibold text-lg">
              {Math.round(featuredContent.vote_average * 10)}% Match
            </span>
            {year && <span className="text-white text-lg">{year}</span>}
            <span className="text-white text-lg border border-white px-2 py-1">
              {'title' in featuredContent ? 'Movie' : 'TV Series'}
            </span>
          </div>

          <p className="text-lg text-white mb-8 line-clamp-3 drop-shadow-md max-w-xl">
            {description}
          </p>

          <div className="flex gap-4">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-semibold"
              onClick={onPlay}
            >
              <Play className="h-6 w-6 mr-2" />
              Play
            </Button>
            
            <Button
              size="lg"
              variant="secondary"
              className="bg-gray-600/80 text-white hover:bg-gray-500/80 px-8 py-3 text-lg font-semibold backdrop-blur-sm"
              onClick={onMoreInfo}
            >
              <Info className="h-6 w-6 mr-2" />
              More Info
            </Button>
          </div>
        </div>
      </div>

      {/* Mute/Unmute Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-8 right-8 bg-black/50 hover:bg-black/70 text-white"
        onClick={() => setIsMuted(!isMuted)}
      >
        {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
      </Button>
    </div>
  );
}