import { Link } from "react-router-dom";
import { 
  User, 
  TrendingUp, 
  Calculator, 
  Calendar, 
  Shield, 
  MessageCircle,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  {
    name: "Habit Tracking",
    path: "/tracking",
    icon: TrendingUp
  },
  {
    name: "BMI Calculator",
    path: "/bmi",
    icon: Calculator
  },
  {
    name: "Menstrual Tracker",
    path: "/menstrual",
    icon: Calendar
  },
  {
    name: "Insurance Calculator",
    path: "/insurance",
    icon: Shield
  },
  {
    name: "Chat Support",
    path: "/chat",
    icon: MessageCircle
  }
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">AGE-WELL Diet</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {user ? (
              <Link to="/profile">
                <Button variant="outline" className="ml-4 flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="outline" className="ml-4">Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "md:hidden fixed inset-x-0 top-16 bg-white/95 backdrop-blur-lg border-t transform transition-transform duration-300 ease-in-out z-40 shadow-lg",
        isMenuOpen ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className="px-4 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          
          {user ? (
            <Link
              to="/profile"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
          ) : (
            <Link
              to="/auth"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium"
            >
              <User className="h-5 w-5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 