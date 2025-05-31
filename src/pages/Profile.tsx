
import { useState, useEffect, useRef } from "react";
import { User, Settings, Save, Edit2, Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Profile {
  full_name: string | null;
  date_of_birth: string | null;
  gender: string | null;
  email: string | null;
  profile_photo_url?: string | null;
}

const BUCKET_NAME = 'profile-photos';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    date_of_birth: "",
    gender: "",
    email: user?.email || "",
    profile_photo_url: null
  });

  // Fetch profile data from Supabase
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          email: data.email || user?.email || '',
          gender: data.gender || '',
          date_of_birth: data.date_of_birth || '',
          profile_photo_url: data.profile_photo_url || null,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      // Validate required fields
      if (!profile.full_name?.trim()) {
        toast({
          title: "Validation Error",
          description: "Full name is required",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // First check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is the "not found" error code
        throw fetchError;
      }

      const profileData = {
        id: user?.id,
        full_name: profile.full_name,
        email: profile.email,
        date_of_birth: profile.date_of_birth,
        gender: profile.gender,
        profile_photo_url: profile.profile_photo_url,
        updated_at: new Date().toISOString(),
      };

      let error;
      if (!existingProfile) {
        // Create new profile if it doesn't exist
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([{ ...profileData, created_at: new Date().toISOString() }]);
        error = insertError;
      } else {
        // Update existing profile
        const { error: updateError } = await supabase
          .from("profiles")
          .update(profileData)
          .eq("id", user?.id);
        error = updateError;
      }

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: (error as Error).message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (isEditing) {
      // If we're currently editing, clicking means we want to save
      handleUpdateProfile();
    } else {
      // If we're not editing, start editing
      setIsEditing(true);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setUploadingPhoto(true);

      // Delete old photo if exists
      if (profile.profile_photo_url) {
        const oldFilePath = profile.profile_photo_url.split('/').pop();
        if (oldFilePath && oldFilePath.includes(user?.id || '')) {
          await supabase.storage
            .from(BUCKET_NAME)
            .remove([`${user?.id}/${oldFilePath}`]);
        }
      }

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      // Update profile with new photo URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          profile_photo_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setProfile(prev => ({ ...prev, profile_photo_url: publicUrl }));

      toast({
        title: "Success",
        description: "Profile photo updated successfully",
      });
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Settings className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Profile</h1>
          <p className="text-xl text-gray-600">Manage your personal information and preferences</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Profile Information Card */}
          <Card className="shadow-xl border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-2xl font-semibold text-gray-900">Profile Information</CardTitle>
                <CardDescription>Your personal details and preferences</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditClick}
                className="text-blue-600 hover:text-blue-700"
                disabled={loading}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4 mb-8">
                <div className="relative group">
                  <Avatar className="h-20 w-20">
                    <AvatarImage 
                      src={profile.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} 
                      alt="Profile" 
                    />
                    <AvatarFallback>
                      {profile.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                  />
                  
                  {uploadingPhoto && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">{profile.full_name || 'Your Name'}</h3>
                  <p className="text-gray-500">{profile.email}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.full_name || ""}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    disabled={!isEditing}
                    className="text-lg py-3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email || ""}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                    className="text-lg py-3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profile.date_of_birth || ""}
                    onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                    disabled={!isEditing}
                    className="text-lg py-3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={profile.gender || ""}
                    onValueChange={(value) => setProfile({ ...profile, gender: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="text-lg py-3">
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

                {isEditing && (
                  <Button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-3 text-lg font-semibold mt-6"
                  >
                    {loading ? "Updating..." : "Save Changes"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
