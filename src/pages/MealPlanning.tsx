import { useState, useEffect } from "react";
import { ChefHat, Heart, Clock, Users, Plus, CheckCircle, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Meal {
  name: string;
  ingredients: string[];
  nutrition: string;
  time: string;
  servings: string;
}

interface MealPlan {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snack: Meal;
}

const MealPlanning = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [age, setAge] = useState("");
  const [showPlan, setShowPlan] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dietaryPreferences = [
    "Heart-Healthy",
    "Low Sodium",
    "Diabetic-Friendly",
    "High Protein",
    "Anti-Inflammatory",
    "Calcium Rich",
    "Low Cholesterol",
    "Mediterranean",
    "High Fiber",
    "Vegetarian",
    "Weight Management",
    "Athletic Performance",
    "Plant-Based",
    "Gluten-Free"
  ];

  const healthConditions = [
    "Hypertension",
    "Diabetes",
    "High Cholesterol",
    "Arthritis",
    "Osteoporosis",
    "Heart Disease",
    "Kidney Disease",
    "COPD",
    "Depression",
    "Memory Concerns",
    "Food Allergies",
    "Celiac Disease",
    "Sports Injuries",
    "Digestive Issues"
  ];

  const mealPlans = {
    "Heart-Healthy": {
      breakfast: {
        name: "Heart-Healthy Oatmeal Bowl",
        ingredients: ["Steel-cut oats", "Fresh berries", "Chopped walnuts", "Ground flaxseed", "Low-fat milk"],
        nutrition: "High in fiber, omega-3s, and antioxidants",
        time: "15 mins",
        servings: "1"
      },
      lunch: {
        name: "Mediterranean Salmon Salad",
        ingredients: ["Grilled salmon", "Mixed greens", "Cherry tomatoes", "Cucumber", "Olive oil", "Lemon"],
        nutrition: "Rich in omega-3s, vitamin D, and lean protein",
        time: "20 mins",
        servings: "1"
      },
      dinner: {
        name: "Herb-Roasted Chicken & Vegetables",
        ingredients: ["Lean chicken breast", "Sweet potatoes", "Broccoli", "Carrots", "Herbs", "Olive oil"],
        nutrition: "High protein, vitamin A, and fiber",
        time: "45 mins",
        servings: "2"
      },
      snack: {
        name: "Greek Yogurt with Almonds",
        ingredients: ["Plain Greek yogurt", "Sliced almonds", "Honey", "Cinnamon"],
        nutrition: "Protein, probiotics, and healthy fats",
        time: "5 mins",
        servings: "1"
      }
    },
    "Diabetic-Friendly": {
      breakfast: {
        name: "Low-GI Breakfast Bowl",
        ingredients: ["Steel-cut oats", "Chia seeds", "Cinnamon", "Almond milk", "Berries"],
        nutrition: "Low glycemic index, high fiber",
        time: "15 mins",
        servings: "1"
      },
      lunch: {
        name: "Quinoa Chicken Bowl",
        ingredients: ["Quinoa", "Grilled chicken", "Avocado", "Mixed vegetables", "Olive oil"],
        nutrition: "Complex carbs, lean protein",
        time: "25 mins",
        servings: "1"
      },
      dinner: {
        name: "Baked Fish with Vegetables",
        ingredients: ["White fish", "Asparagus", "Bell peppers", "Lemon", "Herbs"],
        nutrition: "Lean protein, low carb",
        time: "30 mins",
        servings: "1"
      },
      snack: {
        name: "Protein-Rich Snack",
        ingredients: ["Hard-boiled egg", "Cherry tomatoes", "Cucumber slices"],
        nutrition: "Low carb, high protein",
        time: "5 mins",
        servings: "1"
      }
    },
    "High Protein": {
      breakfast: {
        name: "Protein Power Breakfast",
        ingredients: ["Eggs", "Turkey bacon", "Spinach", "Whole grain toast"],
        nutrition: "High protein, healthy fats",
        time: "15 mins",
        servings: "1"
      },
      lunch: {
        name: "Lean Protein Bowl",
        ingredients: ["Grilled chicken breast", "Quinoa", "Black beans", "Mixed vegetables"],
        nutrition: "Complete proteins, fiber",
        time: "20 mins",
        servings: "1"
      },
      dinner: {
        name: "Salmon with Sweet Potato",
        ingredients: ["Wild salmon", "Sweet potato", "Broccoli", "Olive oil"],
        nutrition: "Omega-3s, lean protein",
        time: "30 mins",
        servings: "1"
      },
      snack: {
        name: "Protein Snack Plate",
        ingredients: ["Greek yogurt", "Mixed nuts", "Apple slices"],
        nutrition: "Protein, healthy fats",
        time: "5 mins",
        servings: "1"
      }
    }
  };

  const handleDietToggle = (diet: string) => {
    setSelectedDiets(prev => 
      prev.includes(diet) 
        ? prev.filter(d => d !== diet)
        : [...prev, diet]
    );
  };

  const handleConditionToggle = (condition: string) => {
    setSelectedConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const generateMealPlan = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to generate a meal plan.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Choose the most appropriate meal plan based on preferences
      let selectedPlan: MealPlan;
      
      if (selectedDiets.includes("Heart-Healthy")) {
        selectedPlan = mealPlans["Heart-Healthy"];
      } else if (selectedDiets.includes("Diabetic-Friendly")) {
        selectedPlan = mealPlans["Diabetic-Friendly"];
      } else if (selectedDiets.includes("High Protein")) {
        selectedPlan = mealPlans["High Protein"];
      } else {
        selectedPlan = mealPlans["Heart-Healthy"]; // Default plan
      }

      // Save the meal plan to Supabase
      const { data, error } = await supabase
        .from('meal_plans')
        .insert({
          user_id: user.id,
          name: `${selectedDiets[0] || "Custom"} Meal Plan`,
          description: `Meal plan for age group ${age} with ${selectedDiets.join(", ")} preferences`,
          dietary_restrictions: selectedDiets,
          meals: selectedPlan
        })
        .select()
        .single();

      if (error) throw error;

      setGeneratedPlan(selectedPlan);
      setShowPlan(true);
      
      toast({
        title: "Meal plan generated!",
        description: "Your personalized meal plan is ready.",
      });
    } catch (error: any) {
      toast({
        title: "Error generating meal plan",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPlan = () => {
    if (!generatedPlan) return;

    // Create a simple text version of the meal plan
    const planText = Object.entries(generatedPlan)
      .map(([mealTime, meal]) => {
        return `${mealTime.toUpperCase()}\n${meal.name}\nIngredients: ${meal.ingredients.join(", ")}\nNutrition: ${meal.nutrition}\nTime: ${meal.time}\nServings: ${meal.servings}\n\n`;
      })
      .join("\n");

    // Create and download the file
    const blob = new Blob([planText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "meal-plan.txt";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-6 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-3 sm:mb-4">
            <ChefHat className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Personalized Meal Planning
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Create customized meal plans tailored to your age, lifestyle, and dietary preferences
          </p>
        </div>

        {!showPlan ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Preferences Form */}
            <Card className="shadow-xl border-0">
              <CardHeader className="space-y-2 sm:space-y-3">
                <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Tell Us About Yourself
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Help us create the perfect meal plan for your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="age" className="text-base sm:text-lg font-medium">Age Group</Label>
                  <Select value={age} onValueChange={setAge}>
                    <SelectTrigger className="text-base sm:text-lg py-2 sm:py-3">
                      <SelectValue placeholder="Select your age group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="13-17">13-17 years (Teens)</SelectItem>
                      <SelectItem value="18-29">18-29 years (Young Adults)</SelectItem>
                      <SelectItem value="30-49">30-49 years (Adults)</SelectItem>
                      <SelectItem value="50-69">50-69 years (Middle Age)</SelectItem>
                      <SelectItem value="70+">70+ years (Seniors)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base sm:text-lg font-medium">Dietary Preferences</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {dietaryPreferences.map((diet) => (
                      <div key={diet} className="flex items-center space-x-2">
                        <Checkbox
                          id={diet}
                          checked={selectedDiets.includes(diet)}
                          onCheckedChange={() => handleDietToggle(diet)}
                        />
                        <Label
                          htmlFor={diet}
                          className="text-sm sm:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {diet}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base sm:text-lg font-medium">Health Conditions (Optional)</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {healthConditions.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={selectedConditions.includes(condition)}
                          onCheckedChange={() => handleConditionToggle(condition)}
                        />
                        <Label
                          htmlFor={condition}
                          className="text-sm sm:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={generateMealPlan}
                  disabled={!age || selectedDiets.length === 0 || isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-2.5 sm:py-3 text-base sm:text-lg font-semibold mt-2"
                >
                  {isLoading ? "Generating..." : "Generate My Meal Plan"}
                </Button>
              </CardContent>
            </Card>

            {/* Sample Meal Card */}
            <Card className="shadow-xl border-0">
              <CardHeader className="space-y-2 sm:space-y-3">
                <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Sample Daily Menu
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Here's an example of what your personalized meal plan might look like
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {Object.entries(mealPlans["Heart-Healthy"]).map(([mealTime, meal]) => (
                  <div key={mealTime} className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-semibold capitalize">
                        {mealTime}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm sm:text-base text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{meal.time}</span>
                        <Users className="h-4 w-4 ml-2" />
                        <span>Serves {meal.servings}</span>
                      </div>
                    </div>
                    <h4 className="text-base sm:text-lg font-medium text-gray-900">{meal.name}</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {meal.ingredients.map((ingredient, index) => (
                        <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm sm:text-base text-gray-600">{meal.nutrition}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : (
          // Generated Meal Plan Section
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Your Preferences Summary */}
            <Card className="lg:col-span-1 shadow-xl border-0">
              <CardHeader className="space-y-2 sm:space-y-3">
                <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Your Preferences
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Your meal plan is customized based on these selections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base sm:text-lg font-medium">Age Group</Label>
                  <p className="text-sm sm:text-base text-gray-600">{age} years</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base sm:text-lg font-medium">Selected Diets</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDiets.map((diet) => (
                      <Badge key={diet} variant="secondary" className="text-xs sm:text-sm">
                        {diet}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedConditions.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-base sm:text-lg font-medium">Health Considerations</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedConditions.map((condition) => (
                        <Badge key={condition} variant="outline" className="text-xs sm:text-sm">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleDownloadPlan}
                  className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-sm sm:text-base">Download Plan</span>
                </Button>
              </CardContent>
            </Card>

            {/* Generated Meal Plan */}
            <Card className="lg:col-span-2 shadow-xl border-0">
              <CardHeader className="space-y-2 sm:space-y-3">
                <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Your Personalized Meal Plan
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Nutritionally balanced meals tailored to your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {generatedPlan && Object.entries(generatedPlan).map(([mealTime, meal]) => (
                  <div key={mealTime} className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-semibold capitalize">
                        {mealTime}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm sm:text-base text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{meal.time}</span>
                        <Users className="h-4 w-4 ml-2" />
                        <span>Serves {meal.servings}</span>
                      </div>
                    </div>
                    <h4 className="text-base sm:text-lg font-medium text-gray-900">{meal.name}</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {meal.ingredients.map((ingredient, index) => (
                        <Badge key={index} variant="secondary" className="text-xs sm:text-sm">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm sm:text-base text-gray-600">{meal.nutrition}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanning;
