import { BaseProvider } from './base';
import { createParser } from 'eventsource-parser';

export class GroqProvider extends BaseProvider {
  private apiKey: string;
  private baseUrl: string = 'https://api.groq.com/openai/v1';

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async ask(question: string, model: string = 'llama-3.1-8b-instant'): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: 'Answer in short: ' + question }
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    let fullResponse = '';
    const decoder = new TextDecoder();

    const parser = createParser({
      onEvent(event) {
        if (event.data === '[DONE]') return;
        
        try {
          const parsed = JSON.parse(event.data);
          const content = parsed.choices[0]?.delta?.content || '';
          if (content) {
            fullResponse += content;
            process.stdout.write(content);
          }
        } catch (e) {
          console.error('Error parsing event data:', e);
        }
      },
      onError(error) {
        console.error('Error in event stream:', error);
      }
    });

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      parser.feed(chunk);
    }

    return fullResponse;
  }
} 