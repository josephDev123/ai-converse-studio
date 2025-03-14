
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

export interface MessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
  status?: "pending" | "sent" | "error";
}

const MessageItem = ({ message, isUser, timestamp, status }: MessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full gap-3 chat-message-appear",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className={cn(
        "flex-shrink-0 h-8 w-8",
        isUser ? "bg-primary" : "bg-muted"
      )}>
        <span className="text-sm">
          {isUser ? "U" : "AI"}
        </span>
      </Avatar>
      
      <div className={cn(
        "flex flex-col max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-xl",
        isUser
          ? "bg-primary text-primary-foreground"
          : "glass-panel"
      )}>
        <p className="text-sm md:text-base whitespace-pre-wrap break-words">
          {message}
        </p>
        
        <div className={cn(
          "flex items-center mt-1 gap-2",
          isUser ? "justify-end" : "justify-start"
        )}>
          {timestamp && (
            <span className="text-xs opacity-70">
              {timestamp}
            </span>
          )}
          
          {status && isUser && (
            <Badge variant="outline" className="h-5 px-2 text-xs">
              {status === "pending" && "Sending..."}
              {status === "sent" && "Sent"}
              {status === "error" && "Failed"}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
