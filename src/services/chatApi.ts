// This is a mock implementation of ChatGPT API SDK
// In a real application, you would use the actual OpenAI SDK
import OpenAI from "openai";
export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  createdAt: Date;
}

export interface ChatOptions {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  endpoint?: string;
}

class ChatApi {
  private apiKey: string | null = null;
  private model: string = "gpt-4o";
  private endpoint = "https://models.inference.ai.azure.com";
  private temperature: number = 0.7;
  private maxTokens: number = 1000;
  private isInitialized: boolean = false;
  private client: OpenAI | null = null;

  constructor(options?: ChatOptions) {
    if (options?.apiKey) {
      this.apiKey = options.apiKey;
      this.isInitialized = true;
    }

    if (options?.model) this.model = options.model;
    if (options?.temperature !== undefined)
      this.temperature = options.temperature;
    if (options?.maxTokens !== undefined) this.maxTokens = options.maxTokens;
    this.endpoint = options?.endpoint || this.endpoint;

    if (this.isInitialized) {
      this.client = new OpenAI({
        baseURL: this.endpoint || options.endpoint,
        apiKey: this.apiKey || options.apiKey,
      });
    }

    // console.log("API Key:", this.apiKey);
    // console.log("Client initialized:", !!this.client);
    // console.log("Is initialized:", this.isInitialized);
  }

  initialize(apiKey: string): void {
    this.apiKey = apiKey;
    this.isInitialized = true;
    this.client = new OpenAI({
      baseURL: this.endpoint,
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true,
    });
    console.log("ChatAPI initialized with API key");
  }

  get isReady(): boolean {
    return this.isInitialized;
  }

  // Mock the API call with a simulated delay
  async sendMessage(
    userMessage: string,
    conversation: Message[] = []
  ): Promise<Message> {
    if (!this.isInitialized || !this.client) {
      throw new Error("ChatAPI is not initialized. Please provide an API key.");
    }

    // messages: [
    //   { role: "system", content: "You are a helpful assistant." },
    //   { role: "user", content: "What is the capital of France?" },
    // ],

    const imcomingConversation: Message[] = [
      ...conversation,
      {
        id: Date.now().toString(),
        content: userMessage,
        role: "user",
        createdAt: new Date(),
      },
    ];

    console.log(conversation);

    const response = await this.client.chat.completions.create({
      messages: imcomingConversation,
      temperature: 1.0,
      top_p: this.temperature,
      max_tokens: this.maxTokens,
      model: this.model,
    });

    const assistantResponse = response.choices[0].message.content;

    const result: Message = {
      id: Date.now().toString(),
      content: assistantResponse,
      role: "assistant",
      createdAt: new Date(),
    };

    return result;
  }

  setModel(model: string): void {
    this.model = model;
    console.log(`Model changed to ${model}`);
  }

  setTemperature(temperature: number): void {
    if (temperature < 0 || temperature > 1) {
      throw new Error("Temperature must be between 0 and 1");
    }
    this.temperature = temperature;
  }

  setMaxTokens(maxTokens: number): void {
    if (maxTokens < 1) {
      throw new Error("Max tokens must be at least 1");
    }
    this.maxTokens = maxTokens;
  }
}

// Export a singleton instance
export const chatApi = new ChatApi();
export default ChatApi;
