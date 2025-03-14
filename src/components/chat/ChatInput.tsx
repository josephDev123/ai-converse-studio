
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon, Mic, MicOff, X } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

const ChatInput = ({ 
  onSendMessage, 
  isLoading = false, 
  placeholder = "Type a message...",
  className 
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <div className="relative flex items-end w-full">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className="pr-16 min-h-[56px] max-h-[200px] resize-none bg-background border-muted-foreground/20 rounded-2xl transition-all focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary"
          autoComplete="off"
        />
        
        {message && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute right-12 bottom-[12px] h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setMessage("")}
            disabled={isLoading}
          >
            <X size={18} />
            <span className="sr-only">Clear message</span>
          </Button>
        )}
        
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 bottom-[12px] h-8 w-8"
          disabled={!message.trim() || isLoading}
          aria-label="Send message"
        >
          <SendIcon size={18} />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
