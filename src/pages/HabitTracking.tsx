import { useState } from "react";
import { TrendingUp, Plus, Check, Clock, Heart, Droplet, Moon, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const HabitTracking = () => {
  const [habits, setHabits] = useState([
    { id: 1, name: "Drink 8 glasses of water", icon: Droplet, target: 8, current: 0, color: "text-blue-500" },
    { id: 2, name: "Exercise for 30 minutes", icon: Dumbbell, target: 1, current: 0, color: "text-green-500" },
    { id: 3, name: "Regular meals", icon: Clock, target: 3, current: 0, color: "text-orange-500" },
  ]);

  const [newHabit, setNewHabit] = useState("");
  const [newTarget, setNewTarget] = useState("");

  const updateHabit = (id: number, increment: number) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id 
        ? { ...habit, current: Math.max(0, Math.min(habit.target, habit.current + increment)) }
        : habit
    ));
  };

  const addHabit = () => {
    if (newHabit && newTarget) {
      const newId = habits.length > 0 ? Math.max(...habits.map(h => h.id)) + 1 : 1;
      setHabits(prev => [...prev, {
        id: newId,
        name: newHabit,
        icon: TrendingUp,
        target: parseInt(newTarget),
        current: 0,
        color: "text-gray-500"
      }]);
      setNewHabit("");
      setNewTarget("");
    }
  };

  const getCompletionPercentage = (current: number, target: number) => {
    return Math.min(100, (current / target) * 100);
  };

  const getTotalProgress = () => {
    const totalCurrent = habits.reduce((sum, habit) => sum + habit.current, 0);
    const totalTarget = habits.reduce((sum, habit) => sum + habit.target, 0);
    return totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Daily Habit Tracking
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your wellness habits and build healthy routines for successful aging
          </p>
        </div>

        {/* Daily Progress Overview */}
        <Card className="shadow-xl border-0 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Today's Progress
            </CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-medium text-gray-900">Overall Progress</span>
                <span className="text-lg font-bold text-purple-600">
                  {Math.round(getTotalProgress())}%
                </span>
              </div>
              <Progress value={getTotalProgress()} className="h-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {habits.map((habit) => {
                const Icon = habit.icon;
                const percentage = getCompletionPercentage(habit.current, habit.target);
                const isCompleted = habit.current >= habit.target;

                return (
                  <Card key={habit.id} className={`border-2 ${isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Icon className={`h-6 w-6 ${habit.color}`} />
                        {isCompleted && <Check className="h-5 w-5 text-green-500" />}
                      </div>
                      
                      <h3 className="font-medium text-gray-900 mb-2 text-sm">{habit.name}</h3>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          {habit.current} / {habit.target}
                        </span>
                        <Badge variant={isCompleted ? "default" : "secondary"} className="text-xs">
                          {Math.round(percentage)}%
                        </Badge>
                      </div>
                      
                      <Progress value={percentage} className="h-2 mb-3" />
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateHabit(habit.id, -1)}
                          disabled={habit.current === 0}
                          className="flex-1 text-xs"
                        >
                          -
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateHabit(habit.id, 1)}
                          disabled={habit.current >= habit.target}
                          className="flex-1 text-xs bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add New Habit */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Add New Habit
              </CardTitle>
              <CardDescription>
                Create a custom habit to track your wellness goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="habit-name" className="text-sm font-medium">Habit Name</Label>
                <Input
                  id="habit-name"
                  placeholder="e.g., Read for 20 minutes"
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="habit-target" className="text-sm font-medium">Daily Target</Label>
                <Input
                  id="habit-target"
                  type="number"
                  placeholder="e.g., 1"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={addHabit}
                disabled={!newHabit || !newTarget}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Habit
              </Button>
            </CardContent>
          </Card>

          {/* Weekly Overview */}
          <Card className="shadow-xl border-0 mt-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Weekly Overview
              </CardTitle>
              <CardDescription>
                Your habit consistency over the past 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {habits.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No habits added yet. Start by adding your first habit above!</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Start tracking your habits to see your weekly progress here!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Health Tips */}
        <Card className="shadow-xl border-0 mt-8">
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
