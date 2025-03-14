
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings, Plus, RefreshCw, BookOpen, MessageCircle, Send } from "lucide-react";
import { ChatProvider, useChat } from "@/context/ChatContext";
import MessageItem from "@/components/chat/MessageItem";
import ChatInput from "@/components/chat/ChatInput";
import TypingIndicator from "@/components/chat/TypingIndicator";
import SettingsDialog from "@/components/settings/SettingsDialog";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";

const ChatInterface = () => {
  const { messages, isLoading, sendMessage, hasApiKey, clearMessages } = useChat();
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasApiKey) {
      setShowSettings(true);
    }
  }, [hasApiKey]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!hasApiKey) {
      toast({
        title: "API key required",
        description: "Please enter your OpenAI API key in the settings.",
        variant: "destructive",
      });
      setShowSettings(true);
      return;
    }
    
    await sendMessage(content);
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      clearMessages();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-medium">ChatGPT SDK Practice</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewChat}
            title="New chat"
          >
            <Plus className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-16">
            <div className="glass-panel p-8 max-w-lg animate-fade-in">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="text-2xl font-semibold mb-3">Welcome to ChatGPT SDK Practice</h2>
              <p className="text-muted-foreground mb-6">
                This is a simple interface to practice using the ChatGPT API. Start by configuring your API key in the settings, then send a message to begin chatting.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Configure API Key
                </Button>
                <Button
                  onClick={() => handleSendMessage("Hello! Can you introduce yourself?")}
                  className="flex items-center gap-2"
                  disabled={!hasApiKey}
                >
                  <Send className="h-4 w-4" />
                  Send Test Message
                </Button>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message.content}
              isUser={message.role === "user"}
              timestamp={formatDistanceToNow(message.createdAt, { addSuffix: true })}
              status={message.status}
            />
          ))
        )}
        
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <span className="text-sm">AI</span>
            </div>
            <div className="glass-panel px-4 py-3 rounded-xl">
              <TypingIndicator />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-background/80 backdrop-blur-sm p-4">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder={hasApiKey ? "Type a message..." : "Set your API key in settings..."}
          className="max-w-4xl mx-auto"
        />
      </div>
      
      {/* Settings Dialog */}
      <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
    </div>
  );
};

const Index = () => {
  return (
    <ChatProvider>
      <ChatInterface />
    </ChatProvider>
  );
};

export default Index;
