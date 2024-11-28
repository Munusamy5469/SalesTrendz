import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hello! How can I assist you today? You can ask about features, navigation, or troubleshooting.', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { text: input, sender: 'user' }]);

    setTimeout(() => {
      const botResponse = getBotResponse(input);
      setMessages((prev) => [...prev, { text: botResponse, sender: 'bot' }]);
    }, 1000);

    setInput('');
  };

  const getBotResponse = (userInput: string) => {
    const input = userInput.toLowerCase();

    // General Website Questions
    if (input.includes('salestrendz') || input.includes('about')) {
      return 'SalesTrendz is a platform designed to help businesses manage, analyze, and forecast their sales data with ease.';
    } else if (input.includes('register')) {
      return 'To register, click on the "Sign Up" button on the homepage and fill out your details.';
    } else if (input.includes('features')) {
      return 'SalesTrendz offers features like Sales Management, Analytics, and Forecasting. Would you like more details on any specific feature?';
    } else if (input.includes('reset') && input.includes('password')) {
      return 'To reset your password, click on "Forgot Password" on the login page and follow the instructions.';
    } else if (input.includes('free') || input.includes('subscription')) {
      return 'SalesTrendz offers both free and premium subscription plans. The premium plan includes advanced analytics and forecasting tools.';
    } else if (input.includes('secure') || input.includes('data')) {
      return 'Your data is secured with encryption and complies with industry standards for data protection.';
    } else if (input.includes('mobile')) {
      return 'Yes, SalesTrendz is mobile-friendly and can be accessed on both iOS and Android devices via the browser.';
    } else if (input.includes('tutorial') || input.includes('guide')) {
      return 'We offer a step-by-step tutorial under the Help section. Visit the Tutorials page for more information.';

    // Sales Management
    } else if (input.includes('upload') || input.includes('sales data')) {
      return 'To upload sales data, go to the Sales Management page and use the "Upload Data" button.';
    } else if (input.includes('edit') || input.includes('delete') && input.includes('sales')) {
      return 'Yes, you can edit or delete sales entries by navigating to the Sales Management page and selecting the respective record.';
    } else if (input.includes('filter') || input.includes('data')) {
      return 'To filter your sales data, use the filtering options by date, product, or region on the Sales Management page.';
    } else if (input.includes('download') || input.includes('sales data')) {
      return 'You can download your sales data in CSV or Excel format from the Sales Management page.';
    } else if (input.includes('charts')) {
      return 'SalesTrendz supports bar charts, line graphs, and pie charts to visualize your sales trends.';
    } else if (input.includes('multiple sales teams')) {
      return 'You can manage multiple sales teams by creating team profiles and assigning data access in the Settings.';

    // Analytics
    } else if (input.includes('analytics')) {
      return 'Our analytics feature provides insights into sales performance, customer segmentation, and growth trends.';
    } else if (input.includes('metrics')) {
      return 'You can track metrics like total revenue, profit margins, and regional sales performance.';
    } else if (input.includes('compare') || input.includes('performance')) {
      return 'To compare performance, use the Analytics page and select two time periods for side-by-side comparison.';
    } else if (input.includes('sales growth')) {
      return 'Sales growth percentages represent the increase or decrease in revenue over a specific period. View detailed insights on the Analytics page.';
    } else if (input.includes('customer segmentation')) {
      return 'Customer segmentation insights help identify key demographics and preferences of your customer base.';

    // Forecasting
    } else if (input.includes('forecast') || input.includes('trends')) {
      return 'Forecasting predicts future sales trends using historical data. Go to the Forecast page for predictions.';
    } else if (input.includes('inputs') || input.includes('forecast')) {
      return 'Forecasting requires inputs like sales history, seasonal data, and market trends.';
    } else if (input.includes('customize') && input.includes('forecast')) {
      return 'You can customize forecasting models in the Advanced Settings under the Forecast page.';
    } else if (input.includes('accurate') || input.includes('forecast')) {
      return 'Our forecasts are highly accurate, with a margin of error below 5%, depending on the quality of your data.';
    } else if (input.includes('seasonality trends')) {
      return 'Yes, our forecasting tool includes seasonality trends to help you plan for high and low sales periods.';

    // Account & Profile
    } else if (input.includes('update') || input.includes('profile')) {
      return 'To update your profile, click on your username in the top-right corner and select "Edit Profile."';
    } else if (input.includes('not loading')) {
      return 'If the website is not loading, check your internet connection or try clearing your browser cache.';
    } else if (input.includes('contact support')) {
      return 'You can contact our support team via the "Help" section or email us at support@salestrendz.com.';

    // Default Response
    } else {
      return "I'm sorry, I didn't understand that. Could you ask your question differently or specify the feature you're inquiring about?";
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-medium">Chat Support</h3>
            <button
              onClick={() => {
                setIsOpen(false);
                setMessages([]); // Clear the chat messages
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
