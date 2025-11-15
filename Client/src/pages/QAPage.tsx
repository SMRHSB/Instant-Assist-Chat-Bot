import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, RotateCcw, ArrowLeft, Copy } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import CategorySelector from '../components/CategorySelector';

type Message = {
  text: string;
  type: 'user' | 'assistant';
};

export default function QAPage() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string>(uuidv4());
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Expand normally

      const maxHeight = 200; // Max height in pixels
      if (textarea.scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = 'auto'; // Scroll if exceeded
      } else {
        textarea.style.overflowY = 'hidden'; // Hide scroll if small
      }
    }
  };

  useEffect(() => {
    if (!category) {
      setShowCategorySelector(true);
      setMessages([]);
    } else {
      setShowCategorySelector(false);
      setMessages([
        {
          text: `I'm your AI assistant for ${category.replace(/_/g, ' ')}. What would you like to know?`,
          type: 'assistant',
        },
      ]);
      setConversationId(uuidv4());
    }
  }, [category]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCategorySelect = (selectedCategory: string) => {
    navigate(`/qa/${selectedCategory}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !category) return;

    const userMessage: Message = { text: question, type: 'user' };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch('http://localhost:5000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          question,
          conversation_id: conversationId,
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        text: data.answer || 'Sorry, no answer returned.',
        type: 'assistant',
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: '⚠️ Failed to get a response from the server.', type: 'assistant' },
      ]);
    }

    setQuestion('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset textarea after sending
    }
  };

  const handleRefresh = () => {
    if (category) {
      setIsRefreshing(true);

      setTimeout(() => {
        setConversationId(uuidv4());
        setMessages([
          {
            text: `I'm your AI assistant for ${category.replace(/_/g, ' ')}. What would you like to know?`,
            type: 'assistant',
          },
        ]);
        setIsRefreshing(false);
      }, 400);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const formatText = (text: string) => {
    const bolded = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return bolded.replace(/\n/g, '<br />');
  };

  return (
    <>
      <motion.div className="max-w-5xl mx-auto h-[calc(100vh-8rem)]">
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 rounded-lg shadow-inner p-2">
          {/* Top bar */}
          <div className="flex justify-between items-center px-6 py-3 border-b dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {category ? `${category.replace(/_/g, ' ')} Assistant` : 'Select a Category'}
              </h2>
            </div>
            <button
              onClick={handleRefresh}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Chat area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isRefreshing ? (
              <div className="flex justify-center items-center h-full">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-gray-500 dark:text-gray-300 text-lg"
                >
                  Refreshing chat...
                </motion.div>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl text-base leading-relaxed shadow-md flex flex-col justify-between h-full ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100'
                      }`}
                    >
                      <div className="flex-1 mb-2">
                        {message.type === 'assistant' ? (
                          <div
                            className="whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: formatText(message.text) }}
                          />
                        ) : (
                          <p className="whitespace-pre-wrap">{message.text}</p>
                        )}
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleCopy(message.text)}
                          className={`transition ${
                            message.type === 'user'
                              ? 'text-white hover:text-blue-300'
                              : 'text-gray-400 hover:text-blue-500'
                          }`}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input bar */}
          <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <textarea
                ref={textareaRef}
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  adjustTextareaHeight();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask something about this category..."
                rows={1}
                className="flex-1 resize-none overflow-hidden px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white max-h-[200px]"
              ></textarea>
              <button type="submit" className="text-blue-600 dark:text-blue-400">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Category Selector Modal */}
      <CategorySelector
        isOpen={showCategorySelector}
        onClose={() => navigate('/dashboard')}
        onSelect={handleCategorySelect}
      />
    </>
  );
}




