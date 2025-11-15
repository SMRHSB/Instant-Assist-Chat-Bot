import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  created_at: string;
}

interface Chat {
  id: string;
  title: string;
  category: string;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  isLoading: boolean;
  error: string | null;
  fetchChats: () => Promise<void>;
  createChat: (category: string, firstMessage: string) => Promise<Chat>;
  loadChat: (chatId: string) => Promise<void>;
  addMessage: (content: string, type: 'user' | 'assistant') => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      currentChat: null,
      isLoading: false,
      error: null,

      fetchChats: async () => {
        const { chats } = get();
        set({ isLoading: false, chats });
      },

      createChat: async (category: string, firstMessage: string) => {
        const newChat: Chat = {
          id: crypto.randomUUID(),
          category,
          title: firstMessage,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          messages: [{
            id: crypto.randomUUID(),
            content: firstMessage,
            type: 'user',
            created_at: new Date().toISOString(),
          }],
        };

        set(state => ({
          chats: [newChat, ...state.chats],
          currentChat: newChat,
        }));

        return newChat;
      },

      loadChat: async (chatId: string) => {
        const chat = get().chats.find(c => c.id === chatId);
        if (chat) {
          set({ currentChat: chat });
        }
      },

      addMessage: async (content: string, type: 'user' | 'assistant') => {
        const { currentChat } = get();
        if (!currentChat) return;

        const newMessage: Message = {
          id: crypto.randomUUID(),
          content,
          type,
          created_at: new Date().toISOString(),
        };

        const updatedChat = {
          ...currentChat,
          messages: [...(currentChat.messages || []), newMessage],
          updated_at: new Date().toISOString(),
        };

        set(state => ({
          chats: state.chats.map(chat => 
            chat.id === currentChat.id ? updatedChat : chat
          ),
          currentChat: updatedChat,
        }));
      },

      deleteChat: async (chatId: string) => {
        set(state => ({
          chats: state.chats.filter(chat => chat.id !== chatId),
          currentChat: state.currentChat?.id === chatId ? null : state.currentChat,
        }));
      },
    }),
    {
      name: 'chat-storage',
    }
  )
);