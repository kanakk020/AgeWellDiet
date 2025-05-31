import { useState } from "react";
import { Calculator, Info, Heart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const BMI = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const calculateBMI = () => {
    if (!height || !weight || !age) return;

    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    const ageValue = parseInt(age);
    const bmiValue = weightInKg / (heightInMeters * heightInMeters);

    setBmi(parseFloat(bmiValue.toFixed(1)));

    // Age-adjusted BMI categories for older adults
    let bmiCategory = "";
    let recs: string[] = [];

    if (ageValue >= 65) {
      if (bmiValue < 22) {
        bmiCategory = "Below Healthy Range";
        recs = [
          "Consider increasing protein intake to maintain muscle mass",
          "Include healthy fats like avocados and nuts",
          "Focus on nutrient-dense foods",
          "Consult with a healthcare provider about weight gain strategies"
        ];
      } else if (bmiValue <= 27) {
        bmiCategory = "Healthy Range for Seniors";
        recs = [
          "Maintain current eating patterns",
          "Focus on calcium and vitamin D for bone health",
          "Include anti-inflammatory foods",
          "Stay physically active with gentle exercises"
        ];
      } else {
        bmiCategory = "Above Healthy Range";
        recs = [
          "Focus on portion control and balanced meals",
          "Increase fiber-rich foods for satiety",
          "Consider gentle physical activity like walking",
          "Prioritize lean proteins and vegetables"
        ];
      }
    } else {
      // Standard BMI categories for younger adults
      if (bmiValue < 18.5) {
        bmiCategory = "Underweight";
        recs = [
          "Increase calorie intake with nutrient-dense foods",
          "Include protein with every meal",
          "Consider healthy weight gain strategies"
        ];
      } else if (bmiValue <= 24.9) {
        bmiCategory = "Normal Weight";
        recs = [
          "Maintain current healthy habits",
          "Focus on balanced nutrition",
          "Continue regular physical activity"
        ];
      } else if (bmiValue <= 29.9) {
        bmiCategory = "Overweight";
        recs = [
          "Focus on portion control",
          "Increase physical activity",
          "Choose whole foods over processed options"
        ];
      } else {
        bmiCategory = "Obese";
        recs = [
          "Consult with healthcare provider for weight management plan",
          "Focus on gradual, sustainable changes",
          "Prioritize vegetables and lean proteins"
        ];
      }
    }

    setCategory(bmiCategory);
    setRecommendations(recs);
  };

  const getBMIColor = () => {
    if (!bmi) return "text-gray-600";
    if (parseInt(age) >= 65) {
      if (bmi < 22) return "text-orange-600";
      if (bmi <= 27) return "text-green-600";
      return "text-red-600";
    } else {
      if (bmi < 18.5) return "text-orange-600";
      if (bmi <= 24.9) return "text-green-600";
      if (bmi <= 29.9) return "text-yellow-600";
      return "text-red-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-3 sm:mb-4">
            <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            BMI Calculator for Seniors
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate your Body Mass Index with age-appropriate recommendations for healthy aging
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Calculator Card */}
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-2 sm:space-y-3">
              <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
                Enter Your Information
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                We'll provide personalized recommendations based on your age
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="age" className="text-base sm:text-lg font-medium">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="text-base sm:text-lg py-2 sm:py-3"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="height" className="text-base sm:text-lg font-medium">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="Enter your height in centimeters"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="text-base sm:text-lg py-2 sm:py-3"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="weight" className="text-base sm:text-lg font-medium">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter your weight in kilograms"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="text-base sm:text-lg py-2 sm:py-3"
                />
              </div>

              <Button 
                onClick={calculateBMI}
                disabled={!height || !weight || !age}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-2.5 sm:py-3 text-base sm:text-lg font-semibold mt-2"
              >
                Calculate BMI
              </Button>
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-2 sm:space-y-3">
              <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
                Your Results
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Personalized recommendations for your health profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bmi !== null ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="text-center p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
                    <div className="text-3xl sm:text-4xl font-bold mb-2">
                      <span className={getBMIColor()}>{bmi}</span>
                    </div>
                    <div className="text-base sm:text-lg font-semibold text-gray-700 mb-1">
                      BMI Score
                    </div>
                    <div className={`text-lg sm:text-xl font-bold ${getBMIColor()}`}>
                      {category}
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Recommendations
                    </h3>
                    <ul className="space-y-2 sm:space-y-3">
                      {recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm sm:text-base">
                          <span className="flex-shrink-0 w-5 h-5 mt-0.5">
                            {index === 0 ? (
                              <Heart className="w-5 h-5 text-red-500" />
                            ) : (
                              <TrendingUp className="w-5 h-5 text-blue-500" />
                            )}
                          </span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 sm:h-5 sm:w-5" />
                    <AlertDescription className="text-sm sm:text-base ml-2">
                      BMI is just one measure of health. Consult with your healthcare provider for a complete assessment.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-base sm:text-lg">
                    Enter your information and click calculate to see your results
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <Card className="mt-8 shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Understanding BMI for Older Adults
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Age-Adjusted Guidelines</h4>
                <p className="text-gray-600 mb-4">
                  Research shows that for adults 65 and older, a BMI between 22-27 may be optimal for health and longevity.
                </p>
                <h4 className="font-semibold text-gray-900 mb-2">Why BMI Changes with Age</h4>
                <p className="text-gray-600">
                  As we age, muscle mass naturally decreases and body composition changes. 
                  A slightly higher BMI can provide reserves during illness and support bone health.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Beyond the Numbers</h4>
                <p className="text-gray-600 mb-4">
                  BMI is just one tool. Overall health includes factors like muscle mass, 
                  bone density, cardiovascular health, and functional ability.
                </p>
                <h4 className="font-semibold text-gray-900 mb-2">Next Steps</h4>
                <p className="text-gray-600">
                  Use this information as a starting point for discussions with your healthcare provider 
                  about your individual health goals and nutrition needs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BMI;
