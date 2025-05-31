import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart, Calculator, MessageCircle, User, Home, TrendingUp, Calendar, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from '../assets/logo.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    full_name: string;
    profile_photo_url: string;
  } | null>(null);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "BMI Calculator", path: "/bmi", icon: Calculator },
    { name: "Meal Planning", path: "/meals", icon: Heart },
    { name: "Habit Tracking", path: "/tracking", icon: TrendingUp },
    { name: "Menstrual Tracker", path: "/menstrual", icon: Calendar },
    { name: "AI Support", path: "/chat", icon: MessageCircle },
    { name: "Insurance", path: "/insurance", icon: Calculator },
  ];

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, profile_photo_url')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const displayName = userProfile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navigation */}
      <nav 
        className={cn(
          "fixed w-full top-0 z-50 transition-all duration-300",
          isScrolled 
            ? "bg-white/80 backdrop-blur-lg shadow-md" 
            : "bg-white/60 backdrop-blur-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center space-x-2 transition-transform hover:scale-105"
              >
  <img src={logo} alt="Logo" className="h-8 w-8" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AGE-WELL Diet
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-blue-100 text-blue-700 shadow-sm"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    )}
                  >
                    <Icon className={cn(
                      "h-4 w-4 transition-transform",
                      isActive ? "scale-110" : "group-hover:scale-110"
                    )} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn(
                      "relative h-8 w-8 rounded-full transition-transform hover:scale-110",
                      isScrolled ? "hover:bg-gray-100" : "hover:bg-white/50"
                    )}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={userProfile?.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`}
                        alt="Profile" 
                      />
                      <AvatarFallback>
                        {userProfile?.full_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{displayName}</p>
                      <p className="w-[200px] truncate text-sm text-gray-600">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  "text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-md",
                  isScrolled ? "hover:bg-gray-100" : "hover:bg-white/50"
                )}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={cn(
            "md:hidden fixed inset-x-0 top-16 bg-white/95 backdrop-blur-lg border-t transform transition-transform duration-300 ease-in-out",
            isMenuOpen ? "translate-y-0" : "-translate-y-full"
          )}
        >
          <div className="px-4 pt-2 pb-3 space-y-1 shadow-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-200",
                    isActive
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-transform",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Mobile Profile Link */}
            <Link 
              to="/profile" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Profile Settings</span>
            </Link>
            
            {/* Mobile Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="flex w-full items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-semibold">AGE-WELL Diet</span>
            </div>
            <p className="text-gray-400">
              Supporting healthy living through personalized nutrition and wellness tracking for all ages
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
