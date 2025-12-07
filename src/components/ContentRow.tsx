'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus, ThumbsUp, Info } from 'lucide-react';
import { tmdbService, type TMDBMovie, type TMDBTVShow } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ContentRowProps {
  title: string;
  items: (TMDBMovie | TMDBTVShow)[];
  onItemSelect: (item: TMDBMovie | TMDBTVShow) => void;
}

export function ContentRow({ title, items, onItemSelect }: ContentRowProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (rowRef.current) {
      setScrollPosition(rowRef.current.scrollLeft);
    }
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = rowRef.current 
    ? scrollPosition < rowRef.current.scrollWidth - rowRef.current.clientWidth
    : false;

  return (
    <div className="relative">
      <h2 className="text-xl font-semibold text-white mb-4 px-4">{title}</h2>
      
      <div className="relative group">
        {canScrollLeft && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        
        {canScrollRight && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}

        <div
          ref={rowRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-4"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onSelect={() => onItemSelect(item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ContentCardProps {
  item: TMDBMovie | TMDBTVShow;
  onSelect: () => void;
}

function ContentCard({ item, onSelect }: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const title = 'title' in item ? item.title : item.name;
  const releaseDate = 'release_date' in item ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';

  return (
    <div
      className="relative flex-shrink-0 w-48 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      <div className="relative overflow-hidden rounded-lg transition-all duration-300 group-hover:scale-105">
        <img
          src={tmdbService.getImageUrl(item.poster_path)}
          alt={title}
          className="w-full h-72 object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-movie.jpg';
          }}
        />
        
        {isHovered && (
          <div className="absolute inset-0 bg-black/80 flex flex-col justify-end p-4 transition-opacity duration-300">
            <div className="flex gap-2 mb-2">
              <Button size="sm" className="flex-1 bg-white text-black hover:bg-gray-200">
                <Play className="h-4 w-4 mr-1" />
                Play
              </Button>
              <Button size="sm" variant="secondary" className="p-2">
                <Plus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" className="p-2">
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" className="p-2">
                <Info className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-sm">
              <h3 className="font-semibold text-white line-clamp-1">{title}</h3>
              <p className="text-gray-300">{year}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-green-400 font-semibold">
                  {Math.round(item.vote_average * 10)}% Match
                </span>
                <span className="text-gray-400">
                  {year && `${year} • `}
                  {'title' in item ? 'Movie' : 'TV Series'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useRef } from 'react';