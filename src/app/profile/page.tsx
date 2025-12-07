'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Calendar, Settings, LogOut, Play, Clock, Star } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [watchlist, setWatchlist] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status]);

  const fetchUserData = async () => {
    try {
      const [watchlistRes, continueRes, ratingsRes] = await Promise.all([
        fetch('/api/user/watchlist'),
        fetch('/api/user/continue-watching'),
        fetch('/api/user/ratings')
      ]);

      if (watchlistRes.ok) setWatchlist(await watchlistRes.json());
      if (continueRes.ok) setContinueWatching(await continueRes.json());
      if (ratingsRes.ok) setRatings(await ratingsRes.json());
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold text-white mb-4">Sign In Required</h2>
            <p className="text-gray-400 mb-6">Please sign in to view your profile</p>
            <Button onClick={() => window.location.href = '/auth/signin'} className="bg-red-600 hover:bg-red-700">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={session?.user?.image || ''} />
                  <AvatarFallback className="bg-red-600 text-white text-2xl">
                    {session?.user?.name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{session?.user?.name}</h1>
                  <p className="text-gray-400 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {session?.user?.email}
                  </p>
                  <p className="text-gray-400 flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    Member since {new Date().getFullYear()}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="border-gray-700">
                    <Settings className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="border-gray-700"
                    onClick={() => signOut()}
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 text-center">
              <Play className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{continueWatching.length}</div>
              <div className="text-gray-400">Continue Watching</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{ratings.length}</div>
              <div className="text-gray-400">Ratings</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 text-center">
              <User className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{watchlist.length}</div>
              <div className="text-gray-400">Watchlist</div>
            </CardContent>
          </Card>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Continue Watching */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Continue Watching
              </CardTitle>
            </CardHeader>
            <CardContent>
              {continueWatching.length > 0 ? (
                <div className="space-y-3">
                  {continueWatching.slice(0, 5).map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-800">
                      <img 
                        src={item.posterPath || '/placeholder-movie.jpg'} 
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.title}</h4>
                        <div className="text-sm text-gray-400">Progress: {Math.round(item.progress)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No content in progress</p>
              )}
            </CardContent>
          </Card>

          {/* Watchlist */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                My Watchlist
              </CardTitle>
            </CardHeader>
            <CardContent>
              {watchlist.length > 0 ? (
                <div className="space-y-3">
                  {watchlist.slice(0, 5).map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-800">
                      <img 
                        src={item.posterPath || '/placeholder-movie.jpg'} 
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.title}</h4>
                        <div className="text-sm text-gray-400">
                          Added {new Date(item.addedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">Your watchlist is empty</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}