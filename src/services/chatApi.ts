
// This is a mock implementation of ChatGPT API SDK
// In a real application, you would use the actual OpenAI SDK

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  createdAt: Date;
}

export interface ChatOptions {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

class ChatApi {
  private apiKey: string | null = null;
  private model: string = 'gpt-4o-mini';
  private temperature: number = 0.7;
  private maxTokens: number = 1000;
  private isInitialized: boolean = false;

  constructor(options?: ChatOptions) {
    if (options?.apiKey) {
      this.apiKey = options.apiKey;
      this.isInitialized = true;
    }
    
    if (options?.model) this.model = options.model;
    if (options?.temperature !== undefined) this.temperature = options.temperature;
    if (options?.maxTokens !== undefined) this.maxTokens = options.maxTokens;
  }

  initialize(apiKey: string): void {
    this.apiKey = apiKey;
    this.isInitialized = true;
    console.log('ChatAPI initialized with API key');
  }

  get isReady(): boolean {
    return this.isInitialized;
  }

  // Mock the API call with a simulated delay
  async sendMessage(userMessage: string, conversation: Message[] = []): Promise<Message> {
    if (!this.isInitialized) {
      throw new Error('ChatAPI is not initialized. Please provide an API key.');
    }

    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // For demo purposes, create a simple response based on the user message
    let assistantResponse = '';
    
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      assistantResponse = "Hello! How can I assist you today?";
    } else if (userMessage.toLowerCase().includes('help')) {
      assistantResponse = "I'm here to help! Please let me know what you need assistance with.";
    } else if (userMessage.toLowerCase().includes('weather')) {
      assistantResponse = "I don't have real-time weather data, but I'd be happy to discuss weather patterns or climate in general.";
    } else if (userMessage.length < 10) {
      assistantResponse = "Could you please provide more details so I can better assist you?";
    } else {
      // Generate a somewhat relevant response for demo purposes
      const responses = [
        "That's an interesting question. Let me think about it...",
        "I understand what you're asking. Here's what I know about this topic...",
        "Thanks for sharing that. From my perspective, I would suggest considering...",
        "That's a great point. Have you also thought about looking at it from this angle?",
        "I'd be happy to explore this topic further with you. What specific aspects are you most interested in?"
      ];
      
      assistantResponse = responses[Math.floor(Math.random() * responses.length)];
      
      // Add a bit more content to make it look like a real response
      assistantResponse += " If you have any follow-up questions or need clarification on anything I've mentioned, please don't hesitate to ask.";
    }

    const response: Message = {
      id: Date.now().toString(),
      content: assistantResponse,
      role: 'assistant',
      createdAt: new Date()
    };

    return response;
  }

  setModel(model: string): void {
    this.model = model;
    console.log(`Model changed to ${model}`);
  }

  setTemperature(temperature: number): void {
    if (temperature < 0 || temperature > 1) {
      throw new Error('Temperature must be between 0 and 1');
    }
    this.temperature = temperature;
  }

  setMaxTokens(maxTokens: number): void {
    if (maxTokens < 1) {
      throw new Error('Max tokens must be at least 1');
    }
    this.maxTokens = maxTokens;
  }
}

// Export a singleton instance
export const chatApi = new ChatApi();
export default ChatApi;
