import { useState } from "react";
import { ChefHat, Heart, Clock, Users, Plus, CheckCircle, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const MealPlanning = () => {
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [age, setAge] = useState("");
  const [showPlan, setShowPlan] = useState(false);

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

  const sampleMeals = {
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

  const generateMealPlan = () => {
    setShowPlan(true);
  };

  const handleDownloadPlan = () => {
    window.open('/meal-plans/weekly-meal-plan.pdf', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <ChefHat className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Personalized Meal Planning
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create customized meal plans tailored to your age, lifestyle, and dietary preferences
          </p>
        </div>

        {!showPlan ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preferences Form */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900">
                  Tell Us About Yourself
                </CardTitle>
                <CardDescription>
                  Help us create the perfect meal plan for your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-lg font-medium">Age Group</Label>
                  <Select value={age} onValueChange={setAge}>
                    <SelectTrigger className="text-lg py-3">
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

                <div className="space-y-3">
                  <Label className="text-lg font-medium">Dietary Preferences</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {dietaryPreferences.map((diet) => (
                      <div key={diet} className="flex items-center space-x-2">
                        <Checkbox
                          id={diet}
                          checked={selectedDiets.includes(diet)}
                          onCheckedChange={() => handleDietToggle(diet)}
                        />
                        <Label
                          htmlFor={diet}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {diet}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-lg font-medium">Health Conditions (Optional)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {healthConditions.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={selectedConditions.includes(condition)}
                          onCheckedChange={() => handleConditionToggle(condition)}
                        />
                        <Label
                          htmlFor={condition}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={generateMealPlan}
                  disabled={!age || selectedDiets.length === 0}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 text-lg font-semibold"
                >
                  Generate My Meal Plan
                </Button>
              </CardContent>
            </Card>

            {/* Preview Card */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900">
                  What You'll Get
                </CardTitle>
                <CardDescription>
                  Personalized nutrition plans designed for your life stage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Age-Specific Portions</h4>
                      <p className="text-gray-600">Serving sizes tailored to your life stage and activity level</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Nutrient-Dense Foods</h4>
                      <p className="text-gray-600">Optimal nutrition for growth, maintenance, or healthy aging</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Lifestyle-Adapted Meals</h4>
                      <p className="text-gray-600">Quick or detailed recipes based on your schedule</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Shopping Lists</h4>
                      <p className="text-gray-600">Organized grocery lists with budget-friendly options</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Nutritional Information</h4>
                      <p className="text-gray-600">Detailed breakdown of nutrients for your goals</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Selected Preferences:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDiets.map((diet) => (
                      <Badge key={diet} variant="secondary" className="bg-green-100 text-green-800">
                        {diet}
                      </Badge>
                    ))}
                    {selectedConditions.map((condition) => (
                      <Badge key={condition} variant="outline" className="border-blue-300 text-blue-700">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Generated Meal Plan */
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Personalized Meal Plan</h2>
              <p className="text-lg text-gray-600">Based on your preferences and health goals</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(sampleMeals).map(([mealType, meal]) => (
                <Card key={mealType} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold capitalize text-gray-900">
                        {mealType}
                      </CardTitle>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">{meal.time}</span>
                      </div>
                    </div>
                    <CardDescription className="font-medium text-gray-700">
                      {meal.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Ingredients:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {meal.ingredients.map((ingredient, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <Plus className="h-3 w-3 text-green-500" />
                            <span>{ingredient}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-gray-900">Health Benefits</span>
                      </div>
                      <p className="text-sm text-gray-600">{meal.nutrition}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>Serves {meal.servings}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
              <Button 
                onClick={() => setShowPlan(false)}
                variant="outline"
                className="px-8 py-3"
              >
                Modify Preferences
              </Button>
              <Button 
                onClick={handleDownloadPlan}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Meal Plan PDF
              </Button>
            </div>

            {/* Download Section */}
            <div className="mt-12 bg-white/80 backdrop-blur rounded-2xl p-8 shadow-xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full mb-4">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Additional Resources
                </h3>
                <p className="text-gray-600">
                  Download helpful guides and templates for your meal planning journey
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      Weekly Meal Plan Template
                    </CardTitle>
                    <CardDescription>
                      A printable template to plan your meals for the entire week
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={handleDownloadPlan}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      Grocery Shopping List
                    </CardTitle>
                    <CardDescription>
                      Organized shopping list based on your meal plan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => window.open('/meal-plans/shopping-list.pdf', '_blank')}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download List
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanning;
