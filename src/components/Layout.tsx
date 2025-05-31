import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart, Calculator, MessageCircle, User, Home, TrendingUp, Calendar, LogOut, Settings, ChevronRight, ChevronLeft, Apple, Brain, Activity } from "lucide-react";
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
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    full_name: string;
    profile_photo_url: string;
  } | null>(null);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Habit Tracking", path: "/tracking", icon: TrendingUp },
    { name: "BMI Calculator", path: "/bmi", icon: Calculator },
    { name: "Meal Planning", path: "/meals", icon: Heart },
    { name: "Menstrual Tracker", path: "/menstrual", icon: Calendar },
    { name: "Insurance Calculator", path: "/insurance", icon: Calculator },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const featureItems = [
    { name: "Habit Tracking", path: "/tracking", icon: Activity },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Menstrual Tracker", path: "/menstrual", icon: Calendar },
    { name: "Chat Support", path: "/chat", icon: MessageCircle },
    { name: "BMI Calculator", path: "/bmi", icon: Calculator },
    { name: "Insurance Calculator", path: "/insurance", icon: Calculator },
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
            <div className="hidden md:flex items-center">
              <div className="flex items-center space-x-1">
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
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isSidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Side Menu */}
      <div
        className={cn(
          "md:hidden fixed inset-y-0 left-0 w-64 bg-white/95 backdrop-blur-lg shadow-lg transform transition-transform duration-300 ease-in-out z-40",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="pt-20 px-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
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
