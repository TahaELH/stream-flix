'use client';

import { useState, useEffect } from 'react';
import { X, Play, Plus, ThumbsUp, Share2, Download } from 'lucide-react';
import { tmdbService, type TMDBMovie, type TMDBTVShow, type TMDBDetailResponse } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ContentModalProps {
  content: TMDBMovie | TMDBTVShow | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: (content: TMDBMovie | TMDBTVShow) => void;
}

export function ContentModal({ content, isOpen, onClose, onPlay }: ContentModalProps) {
  const [details, setDetails] = useState<TMDBDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (content && isOpen) {
      fetchDetails();
    }
  }, [content, isOpen]);

  const fetchDetails = async () => {
    if (!content) return;
    
    setIsLoading(true);
    try {
      const isMovie = 'title' in content;
      const detailData = isMovie 
        ? await tmdbService.getMovieDetails(content.id)
        : await tmdbService.getTVShowDetails(content.id);
      setDetails(detailData);
    } catch (error) {
      console.error('Failed to fetch content details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!content) return null;

  const title = 'title' in content ? content.title : content.name;
  const isMovie = 'title' in content;
  const releaseDate = isMovie ? content.release_date : content.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const runtime = details?.runtime || details?.episode_run_time?.[0];
  const genres = details?.genres?.map(g => g.name).join(', ') || '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>

        <div className="relative">
          {/* Backdrop */}
          <div className="relative h-64 md:h-96 mb-6">
            <img
              src={tmdbService.getBackdropUrl(content.backdrop_path, 'w1280')}
              alt={title}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-backdrop.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent rounded-lg" />
          </div>

          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                className="flex-1 bg-white text-black hover:bg-gray-200 font-semibold py-3"
                onClick={() => onPlay(content)}
              >
                <Play className="h-5 w-5 mr-2" />
                Play
              </Button>
              
              <Button variant="secondary" size="icon" className="bg-gray-700 hover:bg-gray-600">
                <Plus className="h-5 w-5" />
              </Button>
              
              <Button variant="secondary" size="icon" className="bg-gray-700 hover:bg-gray-600">
                <ThumbsUp className="h-5 w-5" />
              </Button>
              
              <Button variant="secondary" size="icon" className="bg-gray-700 hover:bg-gray-600">
                <Share2 className="h-5 w-5" />
              </Button>
              
              <Button variant="secondary" size="icon" className="bg-gray-700 hover:bg-gray-600">
                <Download className="h-5 w-5" />
              </Button>
            </div>

            {/* Content Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-400 font-semibold">
                    {Math.round(content.vote_average * 10)}% Match
                  </span>
                  {year && <span>{year}</span>}
                  {runtime && <span>{runtime} min</span>}
                  <span className="border border-gray-400 px-2 py-1">
                    {isMovie ? 'Movie' : 'TV Series'}
                  </span>
                </div>

                {genres && (
                  <div className="text-sm text-gray-300">
                    <span className="font-semibold">Genres:</span> {genres}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-2">Overview</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {details?.overview || content.overview}
                  </p>
                </div>

                {details?.tagline && (
                  <div className="italic text-gray-400">
                    "{details.tagline}"
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <img
                  src={tmdbService.getImageUrl(content.poster_path, 'w342')}
                  alt={title}
                  className="w-full rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-movie.jpg';
                  }}
                />
              </div>
            </div>

            {/* Videos Section */}
            {details?.videos?.results && details.videos.results.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Trailers & Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {details.videos.results.slice(0, 4).map((video) => (
                    <div key={video.id} className="relative group cursor-pointer">
                      <img
                        src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                        alt={video.name}
                        className="w-full rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      <p className="mt-2 text-sm text-gray-300">{video.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}