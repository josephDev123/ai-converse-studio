
import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { chatApi, Message as ApiMessage } from '@/services/chatApi';
import { useToast } from '@/components/ui/use-toast';

export interface ChatMessage extends Omit<ApiMessage, 'createdAt'> {
  createdAt: Date;
  status?: 'pending' | 'sent' | 'error';
}

interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  setApiKey: (key: string) => void;
  hasApiKey: boolean;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = useCallback(async (content: string) => {
    if (!chatApi.isReady) {
      toast({
        title: "API key required",
        description: "Please enter your OpenAI API key in the settings.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      createdAt: new Date(),
      status: 'pending'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Mark user message as sent
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'sent' as const } 
            : msg
        )
      );

      // Send to API
      const response = await chatApi.sendMessage(
        content, 
        messages.map(m => ({
          id: m.id,
          content: m.content,
          role: m.role,
          createdAt: m.createdAt
        }))
      );

      // Add response to messages
      setMessages(prev => [...prev, {
        ...response,
        createdAt: new Date(),
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Mark user message as error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'error' as const } 
            : msg
        )
      );

      toast({
        title: "Something went wrong",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages, toast]);

  const setApiKey = useCallback((key: string) => {
    try {
      chatApi.initialize(key);
      localStorage.setItem('chatgpt_api_key', key);
      toast({
        title: "API key saved",
        description: "Your API key has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Invalid API key",
        description: "Please check your API key and try again.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        isLoading, 
        sendMessage, 
        setApiKey, 
        hasApiKey: chatApi.isReady,
        clearMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
