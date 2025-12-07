'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NavbarProps {
  onSearch: (query: string) => void;
  onMenuToggle: () => void;
}

export function Navbar({ onSearch, onMenuToggle }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setIsMobileMenuOpen(false);
    }
  };

  const handleMobileSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/90 backdrop-blur-md py-2' 
          : 'bg-gradient-to-b from-black/70 to-transparent py-4'
      }`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-red-600 cursor-pointer">
              STREAMFLIX
            </h1>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Button variant="ghost" className="text-white hover:text-gray-300 font-semibold">
                Home
              </Button>
              <Button variant="ghost" className="text-white hover:text-gray-300 font-semibold">
                Movies
              </Button>
              <Button variant="ghost" className="text-white hover:text-gray-300 font-semibold">
                TV Shows
              </Button>
              <Button variant="ghost" className="text-white hover:text-gray-300 font-semibold">
                My List
              </Button>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search movies and TV shows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-black/50 border-gray-600 text-white placeholder-gray-400 w-64 focus:border-red-600"
                />
              </div>
            </form>

            {/* Icons */}
            <Button variant="ghost" size="icon" className="text-white hover:text-gray-300">
              <Bell className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="text-white hover:text-gray-300">
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 md:hidden">
          <div className="flex flex-col p-4 pt-20">
            {/* Mobile Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search movies and TV shows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleMobileSearch()}
                  className="pl-10 bg-black/50 border-gray-600 text-white placeholder-gray-400 w-full focus:border-red-600"
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex flex-col gap-4">
              <Button variant="ghost" className="text-white hover:text-gray-300 font-semibold justify-start">
                Home
              </Button>
              <Button variant="ghost" className="text-white hover:text-gray-300 font-semibold justify-start">
                Movies
              </Button>
              <Button variant="ghost" className="text-white hover:text-gray-300 font-semibold justify-start">
                TV Shows
              </Button>
              <Button variant="ghost" className="text-white hover:text-gray-300 font-semibold justify-start">
                My List
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}