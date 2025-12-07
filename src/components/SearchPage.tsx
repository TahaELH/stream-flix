'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, Film, Tv } from 'lucide-react';
import { tmdbService, type TMDBMovie, type TMDBTVShow } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SearchPageProps {
  initialQuery?: string;
}

export function SearchPage({ initialQuery = '' }: SearchPageProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<(TMDBMovie | TMDBTVShow)[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<'all' | 'movie' | 'tv'>('all');
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = async (searchQuery: string, type: 'all' | 'movie' | 'tv' = 'all') => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${type}`);
      const data = await response.json();
      
      if (response.ok) {
        setResults(data.results);
        setHasSearched(true);
      } else {
        console.error('Search error:', data.error);
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query, searchType);
  };

  const handleTypeChange = (type: 'all' | 'movie' | 'tv') => {
    setSearchType(type);
    if (query.trim()) {
      performSearch(query, type);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery, searchType);
    }
  }, [initialQuery]);

  const ContentCard = ({ item }: { item: TMDBMovie | TMDBTVShow }) => {
    const title = 'title' in item ? item.title : item.name;
    const releaseDate = 'release_date' in item ? item.release_date : item.first_air_date;
    const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
    const isMovie = 'title' in item;

    return (
      <Card className="bg-gray-900 border-gray-800 overflow-hidden cursor-pointer hover:scale-105 transition-transform">
        <div className="relative">
          <img
            src={tmdbService.getImageUrl(item.poster_path)}
            alt={title}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-movie.jpg';
            }}
          />
          <div className="absolute top-2 right-2">
            <span className="bg-black/70 text-white px-2 py-1 rounded text-xs">
              {isMovie ? <Film className="inline h-3 w-3 mr-1" /> : <Tv className="inline h-3 w-3 mr-1" />}
              {isMovie ? 'Movie' : 'TV'}
            </span>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-white mb-1 line-clamp-2">{title}</h3>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{year}</span>
            <span className="text-green-400">
              {Math.round(item.vote_average * 10)}%
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Search</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for movies and TV shows..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-12 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-red-600"
                />
              </div>
              <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700">
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </form>

          {/* Type Filter */}
          <Tabs value={searchType} onValueChange={handleTypeChange} className="w-full">
            <TabsList className="bg-gray-900 border-gray-700">
              <TabsTrigger value="all" className="data-[state=active]:bg-red-600">
                All
              </TabsTrigger>
              <TabsTrigger value="movie" className="data-[state=active]:bg-red-600">
                Movies
              </TabsTrigger>
              <TabsTrigger value="tv" className="data-[state=active]:bg-red-600">
                TV Shows
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search Results */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-xl">Searching...</div>
          </div>
        )}

        {!loading && hasSearched && results.length === 0 && (
          <div className="text-center py-12">
            <div className="text-xl text-gray-400 mb-2">No results found</div>
            <div className="text-gray-500">Try adjusting your search or filters</div>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {results.length} {results.length === 1 ? 'Result' : 'Results'} for "{query}"
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {results.map((item) => (
                <ContentCard key={`${item.id}-${'title' in item ? 'movie' : 'tv'}`} item={item} />
              ))}
            </div>
          </div>
        )}

        {!hasSearched && !loading && (
          <div className="text-center py-12">
            <div className="text-xl text-gray-400 mb-2">Start searching for movies and TV shows</div>
            <div className="text-gray-500">Use the search bar above to find content</div>
          </div>
        )}
      </div>
    </div>
  );
}