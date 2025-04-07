import { BaseProvider } from './base';

export class GroqProvider extends BaseProvider {
  private apiKey: string;
  private baseUrl: string = 'https://api.groq.com/openai/v1';

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async ask(question: string, model: string = 'mixtral-8x7b-32768'): Promise<string> {
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

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content || '';
            if (content) {
              fullResponse += content;
              process.stdout.write(content);
            }
          } catch (e) {
            console.error('Error parsing chunk:', e);
          }
        }
      }
    }

    return fullResponse;
  }
} 