import { motion } from 'framer-motion';
import { X, Clock, Tag, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useChatStore } from '../store/chatStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ChatHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatHistorySidebar({ isOpen, onClose }: ChatHistorySidebarProps) {
  const navigate = useNavigate();
  const { chats, fetchChats, deleteChat, loadChat, isLoading } = useChatStore();

  useEffect(() => {
    if (isOpen) {
      fetchChats();
    }
  }, [isOpen, fetchChats]);

  const handleChatClick = async (chatId: string, category: string) => {
    await loadChat(chatId);
    navigate(`/qa/${category}`);
    onClose();
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat?')) {
      await deleteChat(chatId);
    }
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", damping: 20 }}
      className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-800 shadow-xl z-40 overflow-hidden"
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chat History</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Loading chats...</div>
          ) : chats.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">No chat history yet</div>
          ) : (
            chats.map((chat) => (
              <motion.button
                key={chat.id}
                onClick={() => handleChatClick(chat.id, chat.category)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left group"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-2">
                  {chat.title}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-3 h-3" />
                    <span className="capitalize">{chat.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{format(new Date(chat.updated_at), 'MMM d, yyyy')}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.button>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}