import { useState, useEffect } from "react";
import { TrendingUp, Plus, Check, Clock, Heart, Droplet, Moon, Dumbbell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Habit {
  id: string;
  name: string;
  description: string | null;
  target_frequency: number;
  category: string | null;
  icon: any;
  color: string;
}

interface HabitEntry {
  id: string;
  habit_id: string;
  completed_date: string;
  notes: string | null;
}

const defaultHabits = [
  { name: "Drink water", description: "Stay hydrated", target_frequency: 8, category: "Health", icon: Droplet, color: "text-blue-500" },
  { name: "Exercise", description: "Stay active", target_frequency: 1, category: "Fitness", icon: Dumbbell, color: "text-green-500" },
  { name: "Regular meals", description: "Eat on time", target_frequency: 3, category: "Health", icon: Clock, color: "text-orange-500" },
];

const HabitTracking = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newHabit, setNewHabit] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchHabits();
      fetchTodayEntries();
    }
  }, [user]);

  const fetchHabits = async () => {
    try {
      const { data: existingHabits, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user?.id);

      if (habitsError) throw habitsError;

      if (!existingHabits || existingHabits.length === 0) {
        // Create default habits for new users
        const defaultHabitsWithIds = await Promise.all(
          defaultHabits.map(async (habit) => {
            const { data, error } = await supabase
              .from('habits')
              .insert({
                user_id: user?.id,
                name: habit.name,
                description: habit.description,
                target_frequency: habit.target_frequency,
                category: habit.category
              })
              .select()
              .single();

            if (error) throw error;
            return { ...data, icon: habit.icon, color: habit.color };
          })
        );

        setHabits(defaultHabitsWithIds);
      } else {
        // Map existing habits to include icons and colors
        const habitsWithIcons = existingHabits.map(habit => ({
          ...habit,
          icon: getHabitIcon(habit.category),
          color: getHabitColor(habit.category)
        }));
        setHabits(habitsWithIcons);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching habits",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayEntries = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('habit_entries')
        .select('*')
        .eq('user_id', user?.id)
        .eq('completed_date', today);

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching entries",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getHabitIcon = (category: string | null) => {
    switch (category?.toLowerCase()) {
      case 'health':
        return Heart;
      case 'fitness':
        return Dumbbell;
      default:
        return TrendingUp;
    }
  };

  const getHabitColor = (category: string | null) => {
    switch (category?.toLowerCase()) {
      case 'health':
        return 'text-red-500';
      case 'fitness':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  };

  const updateHabit = async (habit: Habit, increment: number) => {
    const today = new Date().toISOString().split('T')[0];
    const existingEntries = entries.filter(e => e.habit_id === habit.id).length;
    
    if (increment > 0 && existingEntries >= habit.target_frequency) return;
    if (increment < 0 && existingEntries === 0) return;

    try {
      if (increment > 0) {
        // Add entry
        const { data, error } = await supabase
          .from('habit_entries')
          .insert({
            habit_id: habit.id,
            user_id: user?.id,
            completed_date: today
          })
          .select()
          .single();

        if (error) throw error;
        setEntries([...entries, data]);
      } else {
        // Remove latest entry
        const latestEntry = entries.find(e => e.habit_id === habit.id);
        if (!latestEntry) return;

        const { error } = await supabase
          .from('habit_entries')
          .delete()
          .eq('id', latestEntry.id);

        if (error) throw error;
        setEntries(entries.filter(e => e.id !== latestEntry.id));
      }
    } catch (error: any) {
      toast({
        title: "Error updating habit",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const addHabit = async () => {
    if (!newHabit || !newTarget || !user) return;

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          user_id: user.id,
          name: newHabit,
          target_frequency: parseInt(newTarget),
          category: 'Custom'
        })
        .select()
        .single();

      if (error) throw error;

      const newHabitWithIcon = {
        ...data,
        icon: TrendingUp,
        color: 'text-purple-500'
      };

      setHabits([...habits, newHabitWithIcon]);
      setNewHabit("");
      setNewTarget("");

      toast({
        title: "Habit added successfully",
        description: "Your new habit has been created.",
      });
    } catch (error: any) {
      toast({
        title: "Error adding habit",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);

      if (error) throw error;

      setHabits(habits.filter(h => h.id !== habitId));
      setEntries(entries.filter(e => e.habit_id !== habitId));

      toast({
        title: "Habit deleted",
        description: "The habit has been removed from your tracking.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting habit",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getCompletionPercentage = (habit: Habit) => {
    const completed = entries.filter(e => e.habit_id === habit.id).length;
    return Math.min(100, (completed / habit.target_frequency) * 100);
  };

  const getTotalProgress = () => {
    const totalCompleted = entries.length;
    const totalTarget = habits.reduce((sum, habit) => sum + habit.target_frequency, 0);
    return totalTarget > 0 ? (totalCompleted / totalTarget) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading your habits...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-6 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full mb-3 sm:mb-4">
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Daily Habit Tracking
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
            Track your wellness habits and build healthy routines for successful aging
          </p>
        </div>

        {/* Daily Progress Overview */}
        <Card className="mb-6 shadow-xl border-0">
          <CardHeader className="space-y-2 sm:space-y-3">
            <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
              Today's Progress
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base sm:text-lg font-medium text-gray-900">Overall Progress</span>
                <span className="text-base sm:text-lg font-bold text-purple-600">
                  {Math.round(getTotalProgress())}%
                </span>
              </div>
              <Progress value={getTotalProgress()} className="h-2 sm:h-3" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {habits.map((habit) => {
                const Icon = habit.icon;
                const percentage = getCompletionPercentage(habit);
                const completed = entries.filter(e => e.habit_id === habit.id).length;
                const isCompleted = completed >= habit.target_frequency;

                return (
                  <Card key={habit.id} className={`border-2 ${isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div className="flex items-center space-x-2">
                          <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${habit.color}`} />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 hover:bg-transparent hover:opacity-70"
                            onClick={() => deleteHabit(habit.id)}
                          >
                            <Trash2 className="h-4 w-4 text-gray-400" />
                          </Button>
                        </div>
                        {isCompleted && <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />}
                      </div>
                      
                      <h3 className="font-medium text-gray-900 mb-2 text-xs sm:text-sm">{habit.name}</h3>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm text-gray-600">
                          {completed} / {habit.target_frequency}
                        </span>
                        <Badge variant={isCompleted ? "default" : "secondary"} className="text-xs">
                          {Math.round(percentage)}%
                        </Badge>
                      </div>
                      
                      <Progress value={percentage} className="h-1.5 sm:h-2 mb-2 sm:mb-3" />
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateHabit(habit, -1)}
                          disabled={completed === 0}
                          className="text-xs py-1 sm:py-2"
                        >
                          -
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateHabit(habit, 1)}
                          disabled={completed >= habit.target_frequency}
                          className="text-xs py-1 sm:py-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                        >
                          +
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Add New Habit */}
        <Card className="mb-6 shadow-xl border-0">
          <CardHeader className="space-y-2 sm:space-y-3">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
              Add New Habit
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Create a custom habit to track your wellness goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="habit-name" className="text-sm sm:text-base font-medium">Habit Name</Label>
              <Input
                id="habit-name"
                placeholder="e.g., Read for 20 minutes"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                className="text-sm sm:text-base py-2 sm:py-3"
              />
            </div>
            
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="habit-target" className="text-sm sm:text-base font-medium">Daily Target</Label>
              <Input
                id="habit-target"
                type="number"
                placeholder="e.g., 1"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="text-sm sm:text-base py-2 sm:py-3"
              />
            </div>
            
            <Button
              onClick={addHabit}
              disabled={!newHabit || !newTarget}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm sm:text-base py-2 sm:py-3 mt-2"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Add Habit
            </Button>
          </CardContent>
        </Card>

        {/* Health Tips */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Daily Health Tips
            </CardTitle>
            <CardDescription>
              Personalized recommendations based on your tracked habits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Droplet className="h-5 w-5 text-blue-500" />
                  <span className="font-medium text-gray-900">Hydration</span>
                </div>
                <p className="text-sm text-gray-600">
                  Proper hydration supports kidney function and helps maintain healthy blood pressure.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Dumbbell className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-gray-900">Exercise</span>
                </div>
                <p className="text-sm text-gray-600">
                  Regular physical activity helps maintain bone density and muscle mass as you age.
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Moon className="h-5 w-5 text-purple-500" />
                  <span className="font-medium text-gray-900">Sleep</span>
                </div>
                <p className="text-sm text-gray-600">
                  Quality sleep is essential for cognitive function and immune system health.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HabitTracking;
