import { Link } from "react-router-dom";
import { 
  Heart, 
  Calculator, 
  MessageCircle, 
  TrendingUp, 
  Shield, 
  Brain,
  Bone,
  CheckCircle,
  ArrowRight,
  Calendar,
  ChevronRight,
  Apple,
  Pill,
  Stethoscope,
  Dumbbell,
  Salad,
  Baby,
  HeartPulse,
  Leaf
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FloatingIcon = ({ icon: Icon, className }: { icon: any; className: string }) => (
  <div className={cn(
    "absolute text-gray-300/70",
    "animate-float transform-gpu",
    "md:h-12 md:w-12 h-8 w-8",
    className
  )}>
    <Icon className="h-full w-full" />
  </div>
);

const Index = () => {
  const features = [
    {
      icon: Heart,
      title: "Personalized Nutrition Plans",
      description: "AI-powered meal planning tailored to your age, health conditions, and lifestyle preferences",
      color: "text-emerald-500"
    },
    {
      icon: TrendingUp,
      title: "Multi-Habit Tracking",
      description: "Track wellness metrics, medication schedules, and daily health habits for any age",
      color: "text-emerald-500"
    },
    {
      icon: Brain,
      title: "Health Guidance for All Ages",
      description: "Expert recommendations for cognitive function, bone health, and overall wellness from teens to seniors",
      color: "text-emerald-500"
    },
    {
      icon: Calendar,
      title: "Menstrual Cycle Tracking",
      description: "Comprehensive cycle tracking with symptom monitoring and predictions for reproductive health",
      color: "text-emerald-500"
    },
    {
      icon: MessageCircle,
      title: "24/7 Chatbot Support",
      description: "Always-available AI assistant for nutrition questions and health guidance",
      color: "text-emerald-500"
    },
    {
      icon: Calculator,
      title: "BMI Calculator",
      description: "Age-appropriate BMI calculations with personalized health recommendations for all life stages",
      color: "text-emerald-500"
    },
    {
      icon: Shield,
      title: "Smart Insurance Calculator",
      description: "Estimate healthcare savings based on your improved lifestyle choices and preventive care",
      color: "text-emerald-500"
    }
  ];

  const benefits = [
    "Promotes heart health and cardiovascular wellness for all ages",
    "Supports bone strength and muscle maintenance throughout life",
    "Enhances cognitive function and mental clarity",
    "Tracks reproductive health with menstrual cycle monitoring",
    "Reduces risk of age-related and lifestyle health conditions",
    "Personalized for your unique health profile and life stage",
    "Evidence-based nutrition recommendations for teens, adults, and seniors"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-green-50 py-12 sm:py-20 lg:py-32">
        {/* Floating Icons for Hero Section */}
        <FloatingIcon icon={Heart} className="top-1/4 left-[5%] sm:left-[15%] animate-delay-0" />
        <FloatingIcon icon={Brain} className="top-1/3 right-[5%] sm:right-[10%] animate-delay-200" />
        <FloatingIcon icon={Apple} className="bottom-1/4 left-[5%] sm:left-[10%] animate-delay-400" />
        <FloatingIcon icon={Pill} className="top-1/2 right-[10%] sm:right-[15%] animate-delay-600" />
        <FloatingIcon icon={Bone} className="bottom-1/3 right-[15%] sm:right-[20%] animate-delay-800" />
        <FloatingIcon icon={Calendar} className="top-1/4 right-[20%] sm:right-[30%] animate-delay-1000" />
        
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-br from-emerald-100/40 via-green-100/40 to-teal-100/40" />
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-tr from-green-100/40 via-emerald-100/40 to-teal-100/40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-gray-900">
              Live Well at{" "}
              <span className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent">
                Every Age
              </span>
            </h1>
            <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 px-4 sm:px-0">
              AI-powered meal planning, wellness tracking, and health guidance designed for all life stages. 
              From teens to seniors, achieve your health goals with personalized nutrition support.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 px-4 sm:px-0">
              <Link to="/bmi" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base py-2 sm:py-3">
                  Start Your Health Journey
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link to="/meals" className="group w-full sm:w-auto">
                <Button size="lg" variant="ghost" className="w-full sm:w-auto text-gray-600 hover:text-gray-900 hover:bg-white/80 text-sm sm:text-base py-2 sm:py-3">
                  Explore Meal Plans
                  <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-green-50 via-white to-emerald-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              Comprehensive Wellness Support
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 px-4 sm:px-0">
              Everything you need to maintain optimal health throughout every stage of life
            </p>
          </div>

          <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="relative group"
                >
                  <div className="absolute -inset-4 rounded-lg bg-gradient-to-r from-emerald-100/50 via-green-100/50 to-teal-100/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex flex-col items-center p-4 sm:p-0">
                    <div className={cn(
                      "rounded-xl p-2.5 sm:p-3 ring-1 ring-gray-200/50 shadow-sm transition-transform group-hover:scale-110",
                      "bg-gradient-to-br from-white to-emerald-50/80"
                    )}>
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />
                    </div>
                    <h3 className="mt-4 sm:mt-6 text-base sm:text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose AGE-WELL Diet? Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-green-50 via-white to-emerald-50">
        {/* Floating Icons for Features Section */}
        <FloatingIcon icon={Stethoscope} className="top-1/4 left-[3%] sm:left-[5%] animate-delay-800" />
        <FloatingIcon icon={Dumbbell} className="bottom-1/3 right-[3%] sm:right-[5%] animate-delay-1000" />
        <FloatingIcon icon={HeartPulse} className="top-1/2 left-[10%] sm:left-[20%] animate-delay-1200" />
        <FloatingIcon icon={Salad} className="bottom-1/4 right-[10%] sm:right-[20%] animate-delay-1400" />
        <FloatingIcon icon={Calculator} className="top-1/3 left-[15%] sm:left-[35%] animate-delay-1600" />
        <FloatingIcon icon={MessageCircle} className="bottom-1/2 right-[15%] sm:right-[35%] animate-delay-1800" />
        <FloatingIcon icon={Shield} className="top-1/4 right-[25%] sm:right-[40%] animate-delay-2000" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              Why Choose AGE-WELL Diet?
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 px-4 sm:px-0">
              Our platform is designed for everyone - from teenagers establishing healthy habits to seniors maintaining wellness. Experience personalized care that adapts to your life stage.
            </p>
          </div>

          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-start space-x-3 p-4 sm:p-6 rounded-lg bg-white/80 shadow-sm hover:shadow-md transition-shadow"
              >
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-emerald-500" />
                <span className="text-sm sm:text-base text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ready to Transform Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-emerald-100/30 via-green-100/30 to-teal-100/30">
        {/* Floating Icons for Benefits Section */}
        <FloatingIcon icon={Leaf} className="top-1/4 right-[8%] sm:right-[15%] animate-delay-1600" />
        <FloatingIcon icon={Baby} className="bottom-1/3 left-[8%] sm:left-[15%] animate-delay-1800" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              Ready to Transform Your Health?
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 px-4 sm:px-0">
              Take the first step towards healthier living with personalized nutrition and wellness support for your life stage.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/bmi">
                <Button className="w-full sm:w-auto bg-emerald-500 text-white hover:bg-emerald-600">
                  Calculate Your BMI
                </Button>
              </Link>
              <Link to="/chat">
                <Button variant="outline" className="w-full sm:w-auto">
                  Talk to AI Assistant
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
