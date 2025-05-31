import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import BMI from "./pages/BMI";
import MealPlanning from "./pages/MealPlanning";
import HabitTracking from "./pages/HabitTracking";
import MenstrualTracker from "./pages/MenstrualTracker";
import ChatSupport from "./pages/ChatSupport";
import Insurance from "./pages/Insurance";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Index />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/bmi" element={
              <ProtectedRoute>
                <Layout>
                  <BMI />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/meals" element={
              <ProtectedRoute>
                <Layout>
                  <MealPlanning />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/tracking" element={
              <ProtectedRoute>
                <Layout>
                  <HabitTracking />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/menstrual" element={
              <ProtectedRoute>
                <Layout>
                  <MenstrualTracker />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <Layout>
                  <ChatSupport />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/insurance" element={
              <ProtectedRoute>
                <Layout>
                  <Insurance />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
