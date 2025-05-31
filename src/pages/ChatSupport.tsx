
import { useState } from "react";
import { Send, MessageCircle, Bot, User, Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatSupport = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AGE-WELL Diet assistant. I'm here to help you with nutrition questions, meal planning, and wellness guidance. How can I support your health journey today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const quickQuestions = [
    "What foods are good for heart health?",
    "How much protein should I eat daily?",
    "Can you suggest anti-inflammatory foods?",
    "What vitamins are important for bone health?",
    "How can I manage portion sizes?",
    "What foods help with cognitive function?"
  ];

  const botResponses = {
    "heart": "Great question about heart health! Focus on omega-3 rich foods like salmon, walnuts, and flaxseeds. Include plenty of colorful vegetables, whole grains, and limit sodium intake. The Mediterranean diet pattern is excellent for cardiovascular health.",
    "protein": "For adults over 50, aim for about 1.0-1.2 grams of protein per kilogram of body weight daily. Good sources include lean meats, fish, eggs, dairy, beans, and nuts. Spreading protein throughout the day helps with muscle maintenance.",
    "anti-inflammatory": "Anti-inflammatory foods include fatty fish, berries, leafy greens, nuts, olive oil, and turmeric. These foods help reduce inflammation and may lower the risk of chronic diseases common with aging.",
    "bone": "For bone health, focus on calcium-rich foods like dairy, leafy greens, and fortified foods. Vitamin D is crucial too - found in fatty fish and fortified foods. Magnesium and vitamin K also support bone strength.",
    "portion": "Use the plate method: fill half your plate with vegetables, one quarter with lean protein, and one quarter with whole grains. Use smaller plates and bowls, eat slowly, and listen to your hunger cues.",
    "cognitive": "Foods that support brain health include blueberries, fatty fish, nuts, dark chocolate, and leafy greens. The MIND diet, which combines Mediterranean and DASH eating patterns, is specifically designed for cognitive health."
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simple keyword-based responses
    setTimeout(() => {
      let response = "Thank you for your question! For personalized nutrition advice, I recommend consulting with your healthcare provider. In general, focus on a balanced diet rich in fruits, vegetables, lean proteins, and whole grains.";
      
      const lowerMessage = newMessage.toLowerCase();
      for (const [keyword, botResponse] of Object.entries(botResponses)) {
        if (lowerMessage.includes(keyword)) {
          response = botResponse;
          break;
        }
      }

      const botMessage: Message = {
        id: messages.length + 2,
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setNewMessage("");
  };

  const handleQuickQuestion = (question: string) => {
    setNewMessage(question);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <MessageCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            24/7 AI Nutrition Support
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get instant answers to your nutrition and wellness questions from our AI assistant
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Questions Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Quick Questions
                </CardTitle>
                <CardDescription>
                  Click to ask common nutrition questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(question)}
                    className="w-full text-left justify-start text-xs p-3 h-auto whitespace-normal"
                  >
                    {question}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Available 24/7
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-green-600 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Online Now</span>
                </div>
                <p className="text-sm text-gray-600">
                  I'm here whenever you need nutrition guidance or have questions about healthy aging.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="shadow-xl border-0 h-[600px] flex flex-col">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-white text-blue-600">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">AGE-WELL Assistant</CardTitle>
                    <CardDescription className="text-blue-100">
                      Your personal nutrition guide
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start space-x-3 ${
                          message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className={
                            message.sender === 'user' 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-green-100 text-green-600'
                          }>
                            {message.sender === 'user' ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className={`flex-1 max-w-xs lg:max-w-md ${
                          message.sender === 'user' ? 'text-right' : ''
                        }`}>
                          <div className={`inline-block p-3 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.text}</p>
                          </div>
                          <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(message.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ask about nutrition, meal planning, or health tips..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    This AI assistant provides general information. Always consult your healthcare provider for personalized medical advice.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Personalized Advice</h3>
              <p className="text-sm text-gray-600">
                Get recommendations tailored to your age, health conditions, and dietary preferences
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Always Available</h3>
              <p className="text-sm text-gray-600">
                24/7 support means you can get answers whenever questions arise
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Evidence-Based</h3>
              <p className="text-sm text-gray-600">
                All recommendations are based on current nutrition science and healthy aging research
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatSupport;
