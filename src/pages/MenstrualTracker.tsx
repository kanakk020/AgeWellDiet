import { useState, useEffect } from "react";
import { Calendar, Plus, Heart, TrendingUp, Moon, Droplet, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface MenstrualCycle {
  id: string;
  cycle_start_date: string;
  cycle_end_date: string | null;
  cycle_length: number | null;
  period_length: number | null;
  symptoms: string[];
  mood: string;
  notes: string;
}

const MenstrualTracker = () => {
  const [cycles, setCycles] = useState<MenstrualCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    cycle_start_date: '',
    cycle_end_date: '',
    period_length: '',
    symptoms: [] as string[],
    mood: '',
    notes: ''
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const commonSymptoms = [
    'Cramps', 'Bloating', 'Headache', 'Mood swings', 'Fatigue', 
    'Breast tenderness', 'Acne', 'Food cravings', 'Back pain', 'Nausea'
  ];

  const moodOptions = [
    'Happy', 'Sad', 'Anxious', 'Irritable', 'Calm', 'Energetic', 'Tired', 'Emotional'
  ];

  useEffect(() => {
    if (user) {
      fetchCycles();
    }
  }, [user]);

  const fetchCycles = async () => {
    try {
      const { data, error } = await supabase
        .from('menstrual_cycles')
        .select('*')
        .order('cycle_start_date', { ascending: false });

      if (error) throw error;
      setCycles(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching cycles",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const cycleLength = formData.cycle_end_date ? 
        Math.ceil((new Date(formData.cycle_end_date).getTime() - new Date(formData.cycle_start_date).getTime()) / (1000 * 60 * 60 * 24)) : null;

      const { error } = await supabase
        .from('menstrual_cycles')
        .insert({
          user_id: user.id,
          cycle_start_date: formData.cycle_start_date,
          cycle_end_date: formData.cycle_end_date || null,
          cycle_length: cycleLength,
          period_length: formData.period_length ? parseInt(formData.period_length) : null,
          symptoms: formData.symptoms,
          mood: formData.mood,
          notes: formData.notes
        });

      if (error) throw error;

      toast({
        title: "Cycle added successfully!",
        description: "Your menstrual cycle data has been recorded.",
      });

      setFormData({
        cycle_start_date: '',
        cycle_end_date: '',
        period_length: '',
        symptoms: [],
        mood: '',
        notes: ''
      });
      setShowForm(false);
      fetchCycles();
    } catch (error: any) {
      toast({
        title: "Error adding cycle",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleSymptom = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const getNextPredictedDate = () => {
    if (cycles.length === 0) return null;
    
    // Calculate average cycle length from the last 6 cycles or all available cycles
    const recentCycles = cycles.slice(0, Math.min(6, cycles.length));
    const validCycles = recentCycles.filter(c => c.cycle_length);
    
    if (validCycles.length === 0) return null;
    
    const avgCycleLength = validCycles.reduce((sum, c) => sum + (c.cycle_length || 0), 0) / validCycles.length;
    const avgPeriodLength = validCycles
      .filter(c => c.period_length)
      .reduce((sum, c) => sum + (c.period_length || 0), 0) / validCycles.filter(c => c.period_length).length || 5;
    
    const lastCycle = cycles[0];
    const lastStartDate = new Date(lastCycle.cycle_start_date);
    const predictedDate = new Date(lastStartDate.getTime() + (avgCycleLength * 24 * 60 * 60 * 1000));
    const predictedEndDate = new Date(predictedDate.getTime() + (avgPeriodLength * 24 * 60 * 60 * 1000));
    
    return {
      nextStartDate: predictedDate,
      nextEndDate: predictedEndDate,
      avgCycleLength: Math.round(avgCycleLength),
      avgPeriodLength: Math.round(avgPeriodLength),
      reliability: Math.min(100, (validCycles.length / 6) * 100) // Reliability score based on available data
    };
  };

  const handleDelete = async (cycleId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('menstrual_cycles')
        .delete()
        .eq('id', cycleId);

      if (error) throw error;

      toast({
        title: "Cycle deleted successfully",
        description: "The menstrual cycle entry has been removed.",
      });

      fetchCycles();
    } catch (error: any) {
      toast({
        title: "Error deleting cycle",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
            <Calendar className="h-8 w-8 text-pink-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Menstrual Cycle Tracker
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your menstrual cycle to better understand your body and health patterns
          </p>
        </div>

        {/* Prediction Card */}
        {cycles.length > 0 && (
          <Card className="shadow-xl border-0 mb-8 bg-gradient-to-r from-pink-100 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-4 flex-1">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Next Predicted Period</h3>
                    {(() => {
                      const prediction = getNextPredictedDate();
                      if (!prediction) return <p className="text-gray-600">Not enough data to make predictions yet</p>;
                      
                      return (
                        <>
                          <p className="text-2xl font-bold text-pink-600 mb-2">
                            {prediction.nextStartDate.toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                              Expected Duration: {prediction.avgPeriodLength} days
                            </p>
                            <p className="text-sm text-gray-600">
                              Predicted End Date: {prediction.nextEndDate.toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              Average Cycle Length: {prediction.avgCycleLength} days
                            </p>
                            <div className="flex items-center mt-2">
                              <span className="text-xs text-gray-500 mr-2">Prediction Reliability:</span>
                              <Progress value={prediction.reliability} className="h-2 w-20" />
                              <span className="text-xs text-gray-500 ml-2">{Math.round(prediction.reliability)}%</span>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
                <Heart className="h-12 w-12 text-pink-500 ml-4" />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add New Cycle */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Add New Cycle
                </CardTitle>
                <CardDescription>
                  Record your menstrual cycle information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showForm ? (
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Track New Cycle
                  </Button>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Cycle Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={formData.cycle_start_date}
                        onChange={(e) => setFormData({...formData, cycle_start_date: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end-date">Cycle End Date (Optional)</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={formData.cycle_end_date}
                        onChange={(e) => setFormData({...formData, cycle_end_date: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="period-length">Period Length (Days)</Label>
                      <Input
                        id="period-length"
                        type="number"
                        placeholder="e.g., 5"
                        value={formData.period_length}
                        onChange={(e) => setFormData({...formData, period_length: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Symptoms</Label>
                      <div className="flex flex-wrap gap-2">
                        {commonSymptoms.map((symptom) => (
                          <Badge
                            key={symptom}
                            variant={formData.symptoms.includes(symptom) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleSymptom(symptom)}
                          >
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mood">Mood</Label>
                      <Select onValueChange={(value) => setFormData({...formData, mood: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your mood" />
                        </SelectTrigger>
                        <SelectContent>
                          {moodOptions.map((mood) => (
                            <SelectItem key={mood} value={mood}>{mood}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any additional notes..."
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button type="submit" className="flex-1 bg-pink-600 hover:bg-pink-700">
                        Save Cycle
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Cycle History */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Cycle History
                </CardTitle>
                <CardDescription>
                  Your previous menstrual cycles and patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cycles.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No cycles recorded yet. Start tracking your first cycle!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cycles.map((cycle) => (
                      <div key={cycle.id} className="p-4 border rounded-lg relative group">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(cycle.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">
                              Started: {new Date(cycle.cycle_start_date).toLocaleDateString()}
                            </p>
                            {cycle.cycle_end_date && (
                              <p className="text-sm text-gray-600">
                                Ended: {new Date(cycle.cycle_end_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="text-right mr-10">
                            {cycle.cycle_length && (
                              <Badge variant="outline">{cycle.cycle_length} day cycle</Badge>
                            )}
                            {cycle.period_length && (
                              <Badge variant="outline" className="ml-2">{cycle.period_length} day period</Badge>
                            )}
                          </div>
                        </div>
                        
                        {cycle.symptoms.length > 0 && (
                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-700 mb-1">Symptoms:</p>
                            <div className="flex flex-wrap gap-1">
                              {cycle.symptoms.map((symptom, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {cycle.mood && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Mood:</span> {cycle.mood}
                          </p>
                        )}
                        
                        {cycle.notes && (
                          <p className="text-sm text-gray-600 mt-2">
                            <span className="font-medium">Notes:</span> {cycle.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenstrualTracker;
