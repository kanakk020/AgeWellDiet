import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Mail, Lock, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    dateOfBirth: '',
    gender: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Validate required fields for signup
        if (!formData.fullName || !formData.dateOfBirth || !formData.gender) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        console.log("Attempting signup with:", { email: formData.email, fullName: formData.fullName });
        
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              date_of_birth: formData.dateOfBirth,
              gender: formData.gender
            }
          }
        });

        if (error) {
          console.error("Signup error:", error);
          throw error;
        }

        console.log("Signup response:", data);

        if (data.user && !data.session) {
          toast({
            title: "Check your email",
            description: "We've sent you a confirmation link. Please check your email and click the link to activate your account.",
          });
        } else if (data.user && data.session) {
          // Create profile record with upsert to handle both insert and update
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert([
              {
                id: data.user.id,
                full_name: formData.fullName,
                date_of_birth: formData.dateOfBirth,
                gender: formData.gender,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ], 
            { 
              onConflict: 'id',
              ignoreDuplicates: false
            });

          if (profileError) {
            console.error("Error creating profile:", profileError);
            // Try to get more detailed error information
            const { error: fetchError, data: existingProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
              
            if (!fetchError && existingProfile) {
              // Profile exists but couldn't be updated
              toast({
                title: "Profile Update Error",
                description: "Your account exists but profile couldn't be updated. Please try updating your profile later.",
                variant: "destructive",
              });
            } else {
              // Profile doesn't exist and couldn't be created
              toast({
                title: "Profile Creation Error",
                description: "Your account was created but there was an error saving your profile. Please update your profile later.",
                variant: "destructive",
              });
            }
          } else {
            toast({
              title: "Account created successfully!",
              description: "Welcome to AGE-WELL Diet. You can now start your wellness journey.",
            });
          }
          navigate('/');
        }
      } else {
        // Handle sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          console.error("Sign in error:", error);
          toast({
            title: "Sign In Failed",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        if (data.session) {
          toast({
            title: "Welcome back!",
            description: "Successfully signed in to your account.",
          });
          navigate('/');
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-3 sm:mb-4">
            <img src={logo} alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10" />
            <span className="text-xl sm:text-2xl font-bold text-gray-900">AGE-WELL Diet</span>
          </Link>
          <p className="text-sm sm:text-base text-gray-600">Personalized nutrition for healthy living</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center space-y-2 sm:space-y-3">
            <CardTitle className="text-xl sm:text-2xl font-bold">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {isSignUp 
                ? 'Start your wellness journey today' 
                : 'Sign in to continue your wellness journey'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="fullName" className="text-sm sm:text-base">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="pl-10 text-sm sm:text-base py-2 sm:py-3"
                        required={isSignUp}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-sm sm:text-base">Date of Birth *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                        className="pl-10 text-sm sm:text-base py-2 sm:py-3"
                        required={isSignUp}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="gender" className="text-sm sm:text-base">Gender *</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                      <SelectTrigger className="text-sm sm:text-base py-2 sm:py-3">
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-10 text-sm sm:text-base py-2 sm:py-3"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="pl-10 text-sm sm:text-base py-2 sm:py-3"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-2 sm:py-3 text-sm sm:text-base font-semibold mt-2"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2" />
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </Button>

              <div className="mt-4 text-center text-sm sm:text-base">
                {isSignUp ? (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(false)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Sign In
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(true)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Create Account
                    </button>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
