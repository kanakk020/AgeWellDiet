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
  Download,
  FileText,
  ChevronRight,
  Apple,
  Pill,
  Stethoscope,
  Dumbbell,
  Salad,
  Baby,
  HeartPulse,
  Leaf,
  LeafIcon,
  BabyIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FloatingIcon = ({ icon: Icon, className }: { icon: any; className: string }) => (
  <div className={cn(
    "absolute hidden lg:block text-gray-300/70",
    "animate-float transform-gpu",
    className
  )}>
    <Icon className="h-8 w-8 md:h-12 md:w-12" />
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

  const handleDownload = (file: string) => {
    window.open(file, '_blank');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-green-50 py-20 sm:py-32">
        {/* Floating Icons for Hero Section */}
        <FloatingIcon icon={Heart} className="top-1/4 left-[15%] animate-delay-0" />
        <FloatingIcon icon={Brain} className="top-1/3 right-[10%] animate-delay-200" />
        <FloatingIcon icon={Apple} className="bottom-1/4 left-[10%] animate-delay-400" />
        <FloatingIcon icon={Pill} className="top-1/2 right-[15%] animate-delay-600" />
        <FloatingIcon icon={Bone} className="bottom-1/3 right-[20%] animate-delay-800" />
        <FloatingIcon icon={Calendar} className="top-1/4 right-[30%] animate-delay-1000" />
        
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-br from-emerald-100/40 via-green-100/40 to-teal-100/40" />
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-tr from-green-100/40 via-emerald-100/40 to-teal-100/40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Live Well at{" "}
              <span className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent">
                Every Age
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              AI-powered meal planning, wellness tracking, and health guidance designed for all life stages. 
              From teens to seniors, achieve your health goals with personalized nutrition support.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/bmi">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 shadow-md hover:shadow-lg transition-all duration-300">
                  Start Your Health Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/meals" className="group">
                <Button size="lg" variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-white/80">
                  Explore Meal Plans
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-gradient-to-b from-green-50 via-white to-emerald-50">
        {/* Floating Icons for Features Section */}
        <FloatingIcon icon={Stethoscope} className="top-1/4 left-[5%] animate-delay-800" />
        <FloatingIcon icon={Dumbbell} className="bottom-1/3 right-[5%] animate-delay-1000" />
        <FloatingIcon icon={HeartPulse} className="top-1/2 left-[20%] animate-delay-1200" />
        <FloatingIcon icon={Salad} className="bottom-1/4 right-[20%] animate-delay-1400" />
        <FloatingIcon icon={Calculator} className="top-1/3 left-[35%] animate-delay-1600" />
        <FloatingIcon icon={MessageCircle} className="bottom-1/2 right-[35%] animate-delay-1800" />
        <FloatingIcon icon={Shield} className="top-1/4 right-[40%] animate-delay-2000" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Comprehensive Wellness Support
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to maintain optimal health throughout every stage of life
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="relative group"
                >
                  <div className="absolute -inset-4 rounded-lg bg-gradient-to-r from-emerald-100/50 via-green-100/50 to-teal-100/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex flex-col items-center">
                    <div className={cn(
                      "rounded-xl p-3 ring-1 ring-gray-200/50 shadow-sm transition-transform group-hover:scale-110",
                      "bg-gradient-to-br from-white to-emerald-50/80"
                    )}>
                      <Icon className="h-6 w-6 text-emerald-500" />
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-center text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-24 bg-gradient-to-br from-emerald-100/30 via-green-100/30 to-teal-100/30">
        {/* Floating Icons for Benefits Section */}
        <FloatingIcon icon={Leaf} className="top-1/4 right-[15%] animate-delay-1600" />
        <FloatingIcon icon={Baby} className="bottom-1/3 left-[15%] animate-delay-1800" />
        <FloatingIcon icon={CheckCircle} className="top-1/2 right-[25%] animate-delay-2000" />
        <FloatingIcon icon={TrendingUp} className="bottom-1/4 left-[25%] animate-delay-0" />
        <FloatingIcon icon={FileText} className="top-1/3 right-[35%] animate-delay-200" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Why Choose AGE-WELL Diet?
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                Our platform is designed for everyone - from teenagers establishing healthy habits 
                to seniors maintaining wellness. Experience personalized care that adapts to your life stage.
              </p>
              
              <div className="mt-10 space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 p-1 transition-transform group-hover:scale-110">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-200/50 via-green-200/50 to-teal-200/50 rounded-3xl transform rotate-3 scale-105" />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
                <div className="flex justify-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="mt-6 text-2xl font-bold text-center text-gray-900">
                  Start Your Wellness Journey
                </h3>
                <p className="mt-4 text-center text-gray-600">
                  Join thousands of people across all age groups who are living healthier, happier lives with AGE-WELL Diet.
                </p>
                <div className="mt-8 flex justify-center">
                  <Link to="/bmi">
                    <Button className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 text-white hover:from-emerald-500 hover:via-green-500 hover:to-teal-500 shadow-md hover:shadow-lg transition-all duration-300">
                      Get Started Today
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <FloatingIcon icon={ChevronRight} className="top-1/4 left-[20%] animate-delay-1200" />
        <FloatingIcon icon={Heart} className="bottom-1/3 right-[20%] animate-delay-1400" />
        <FloatingIcon icon={Pill} className="top-1/2 left-[40%] animate-delay-1600" />
        
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 via-green-100/30 to-teal-100/30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Ready to Transform Your Health?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Take the first step towards healthier living with personalized nutrition and wellness support for your life stage.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/bmi">
                <Button size="lg" className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 text-white hover:from-emerald-500 hover:via-green-500 hover:to-teal-500 shadow-md hover:shadow-lg transition-all duration-300">
                  Calculate Your BMI
                </Button>
              </Link>
              <Link to="/chat" className="group">
                <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-white/50 shadow-sm hover:shadow-md transition-all duration-300">
                  Talk to AI Assistant
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
