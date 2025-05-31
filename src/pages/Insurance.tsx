import { useState } from "react";
import { Shield, Calculator, TrendingDown, DollarSign, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

// Currency conversion rate (approximate)
const USD_TO_INR = 75;

const Insurance = () => {
  const [formData, setFormData] = useState({
    age: "",
    currentPremium: "",
    healthConditions: [] as string[],
    lifestyleChanges: [] as string[],
    smokingStatus: "",
    exerciseFrequency: "",
    bmi: ""
  });
  const [results, setResults] = useState<any>(null);

  const healthConditions = [
    "Diabetes",
    "High Blood Pressure",
    "High Cholesterol",
    "Heart Disease",
    "Obesity",
    "Arthritis",
    "Osteoporosis",
    "Sleep Apnea"
  ];

  const lifestyleImprovements = [
    "Regular Exercise (3+ times/week)",
    "Healthy Diet (Mediterranean/DASH)",
    "Weight Management",
    "Smoking Cessation",
    "Stress Management",
    "Regular Health Screenings",
    "Medication Compliance",
    "Social Engagement"
  ];

  const handleConditionToggle = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      healthConditions: prev.healthConditions.includes(condition)
        ? prev.healthConditions.filter(c => c !== condition)
        : [...prev.healthConditions, condition]
    }));
  };

  const handleLifestyleToggle = (lifestyle: string) => {
    setFormData(prev => ({
      ...prev,
      lifestyleChanges: prev.lifestyleChanges.includes(lifestyle)
        ? prev.lifestyleChanges.filter(l => l !== lifestyle)
        : [...prev.lifestyleChanges, lifestyle]
    }));
  };

  const calculateSavings = () => {
    const currentPremium = parseFloat(formData.currentPremium) || 0;
    const age = parseInt(formData.age) || 50;
    const conditionsCount = formData.healthConditions.length;
    const lifestyleScore = formData.lifestyleChanges.length;
    const isNonSmoker = formData.smokingStatus === "never" || formData.smokingStatus === "former";
    const exercisesRegularly = formData.exerciseFrequency === "regular";
    const bmi = parseFloat(formData.bmi) || 25;

    // Calculate risk reduction percentage
    let riskReduction = 0;
    
    // Lifestyle improvements (up to 25% reduction)
    riskReduction += Math.min(lifestyleScore * 3, 25);
    
    // Non-smoking bonus (up to 15% reduction)
    if (isNonSmoker) riskReduction += 15;
    
    // Regular exercise bonus (up to 10% reduction)
    if (exercisesRegularly) riskReduction += 10;
    
    // Healthy BMI bonus (up to 8% reduction)
    if (bmi >= 18.5 && bmi <= 24.9) riskReduction += 8;
    
    // Age adjustment
    if (age < 55) riskReduction += 5;
    else if (age > 70) riskReduction -= 5;

    // Condition penalties (reduce benefits)
    riskReduction = Math.max(0, riskReduction - (conditionsCount * 5));

    // Cap at reasonable maximum
    riskReduction = Math.min(riskReduction, 50);

    // Calculate potential savings in INR
    const monthlySavings = (currentPremium * riskReduction) / 100;
    const annualSavings = monthlySavings * 12;
    const tenYearSavings = annualSavings * 10;

    // Estimate healthcare cost reductions in INR
    const healthcareSavings = {
      preventiveCareSavings: lifestyleScore * (200 * USD_TO_INR),
      medicationSavings: isNonSmoker && exercisesRegularly ? (1200 * USD_TO_INR) : (600 * USD_TO_INR),
      emergencyCareSavings: riskReduction * (100 * USD_TO_INR),
      totalHealthcare: 0
    };
    healthcareSavings.totalHealthcare = 
      healthcareSavings.preventiveCareSavings + 
      healthcareSavings.medicationSavings + 
      healthcareSavings.emergencyCareSavings;

    setResults({
      riskReduction,
      monthlySavings,
      annualSavings,
      tenYearSavings,
      healthcareSavings,
      riskScore: Math.max(10, 100 - riskReduction * 2),
      recommendations: generateRecommendations(formData, riskReduction)
    });
  };

  const generateRecommendations = (data: any, riskReduction: number) => {
    const recommendations = [];
    
    if (data.smokingStatus === "current") {
      recommendations.push("Smoking cessation could reduce your premiums by up to 20%");
    }
    
    if (data.exerciseFrequency === "rarely") {
      recommendations.push("Regular exercise (3+ times per week) could lower costs by 10-15%");
    }
    
    if (data.lifestyleChanges.length < 4) {
      recommendations.push("Adopting more healthy lifestyle habits could increase your savings");
    }
    
    if (data.healthConditions.length > 2) {
      recommendations.push("Working with your doctor to manage conditions can help reduce long-term costs");
    }
    
    recommendations.push("Regular preventive care can catch issues early and reduce emergency costs");
    
    return recommendations;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <Shield className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Insurance Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how healthy lifestyle choices can reduce your healthcare costs and insurance premiums
          </p>
        </div>

        {!results ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Form */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900">
                  Calculate Your Potential Savings
                </CardTitle>
                <CardDescription>
                  Tell us about your current situation and health goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter age"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="premium">Current Monthly Premium (₹)</Label>
                    <Input
                      id="premium"
                      type="number"
                      placeholder="Enter amount"
                      value={formData.currentPremium}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentPremium: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Smoking Status</Label>
                  <Select value={formData.smokingStatus} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, smokingStatus: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select smoking status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never smoked</SelectItem>
                      <SelectItem value="former">Former smoker (quit 1+ years ago)</SelectItem>
                      <SelectItem value="recent">Recently quit (less than 1 year)</SelectItem>
                      <SelectItem value="current">Current smoker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Exercise Frequency</Label>
                  <Select value={formData.exerciseFrequency} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, exerciseFrequency: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select exercise frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">3+ times per week</SelectItem>
                      <SelectItem value="moderate">1-2 times per week</SelectItem>
                      <SelectItem value="rarely">Rarely exercise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bmi">BMI (optional)</Label>
                  <Input
                    id="bmi"
                    type="number"
                    step="0.1"
                    placeholder="Enter BMI"
                    value={formData.bmi}
                    onChange={(e) => setFormData(prev => ({ ...prev, bmi: e.target.value }))}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Current Health Conditions</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {healthConditions.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={formData.healthConditions.includes(condition)}
                          onCheckedChange={() => handleConditionToggle(condition)}
                        />
                        <Label htmlFor={condition} className="text-sm">{condition}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Healthy Lifestyle Practices</Label>
                  <div className="space-y-2">
                    {lifestyleImprovements.map((lifestyle) => (
                      <div key={lifestyle} className="flex items-center space-x-2">
                        <Checkbox
                          id={lifestyle}
                          checked={formData.lifestyleChanges.includes(lifestyle)}
                          onCheckedChange={() => handleLifestyleToggle(lifestyle)}
                        />
                        <Label htmlFor={lifestyle} className="text-sm">{lifestyle}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={calculateSavings}
                  disabled={!formData.age || !formData.currentPremium}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3 text-lg font-semibold"
                >
                  Calculate My Savings
                </Button>
              </CardContent>
            </Card>

            {/* Information Card */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900">
                  How It Works
                </CardTitle>
                <CardDescription>
                  Understanding the connection between lifestyle and costs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    This calculator provides estimates based on industry data and research. 
                    Actual savings may vary by insurer and individual circumstances.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Premium Reductions</h4>
                      <p className="text-gray-600 text-sm">
                        Many insurers offer discounts for healthy lifestyle practices, 
                        wellness program participation, and preventive care.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Healthcare Cost Savings</h4>
                      <p className="text-gray-600 text-sm">
                        Preventive care and healthy habits can significantly reduce 
                        long-term medical expenses and emergency interventions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Risk Assessment</h4>
                      <p className="text-gray-600 text-sm">
                        Insurers use health risk scores to determine premiums. 
                        Lower risk typically means lower costs.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Wellness Programs</h4>
                      <p className="text-gray-600 text-sm">
                        Many plans offer additional savings for participating in 
                        health screenings, fitness programs, and health coaching.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Start Your Journey</h4>
                  <p className="text-gray-600 text-sm">
                    Small lifestyle changes can lead to significant savings over time. 
                    Every healthy choice contributes to your overall well-being and financial health.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Results Display */
          <div className="space-y-8">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-semibold">Your Potential Savings</CardTitle>
                <CardDescription className="text-indigo-100">
                  Based on your health profile and lifestyle choices
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <Card className="border-2 border-green-200 bg-green-50">
                    <CardContent className="p-4 text-center">
                      <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-700">
                        ₹{Math.round(results.monthlySavings).toLocaleString('en-IN')}
                      </div>
                      <div className="text-sm text-gray-600">Monthly Premium Savings</div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-blue-200 bg-blue-50">
                    <CardContent className="p-4 text-center">
                      <Calculator className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-700">
                        ₹{Math.round(results.annualSavings).toLocaleString('en-IN')}
                      </div>
                      <div className="text-sm text-gray-600">Annual Premium Savings</div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-purple-200 bg-purple-50">
                    <CardContent className="p-4 text-center">
                      <TrendingDown className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-700">
                        {Math.round(results.riskReduction)}%
                      </div>
                      <div className="text-sm text-gray-600">Risk Reduction</div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-indigo-200 bg-indigo-50">
                    <CardContent className="p-4 text-center">
                      <Shield className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-indigo-700">
                        ₹{Math.round(results.tenYearSavings).toLocaleString('en-IN')}
                      </div>
                      <div className="text-sm text-gray-600">10-Year Potential Savings</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Healthcare Cost Reductions
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Preventive Care Savings</span>
                        <span className="font-semibold text-green-600">
                          ₹{Math.round(results.healthcareSavings.preventiveCareSavings).toLocaleString('en-IN')}/year
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Medication Savings</span>
                        <span className="font-semibold text-green-600">
                          ₹{Math.round(results.healthcareSavings.medicationSavings).toLocaleString('en-IN')}/year
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Emergency Care Savings</span>
                        <span className="font-semibold text-green-600">
                          ₹{Math.round(results.healthcareSavings.emergencyCareSavings).toLocaleString('en-IN')}/year
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border-2 border-green-200">
                        <span className="font-semibold text-gray-900">Total Healthcare Savings</span>
                        <span className="font-bold text-green-700 text-lg">
                          ₹{Math.round(results.healthcareSavings.totalHealthcare).toLocaleString('en-IN')}/year
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Recommendations for More Savings
                    </h3>
                    <div className="space-y-2">
                      {results.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Risk Score</h4>
                      <Progress value={100 - results.riskScore} className="h-3 mb-2" />
                      <p className="text-sm text-gray-600">
                        Your current risk score is {results.riskScore}/100. Lower scores typically result in better insurance rates.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-4">
              <Button 
                onClick={() => setResults(null)}
                variant="outline"
                className="px-8 py-3"
              >
                Recalculate
              </Button>
              <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-3">
                Get Personalized Plan
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Insurance;
