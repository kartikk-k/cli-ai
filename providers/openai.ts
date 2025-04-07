import { OpenAI } from 'openai';
import { BaseProvider } from './base';

export class OpenAIProvider extends BaseProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    super();
    this.client = new OpenAI({
      apiKey: apiKey,
    });
  }

  async ask(question: string, model: string = 'gpt-4o-mini'): Promise<string> {
    const stream = await this.client.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: 'Answer in short: ' + question }
      ],
      stream: true,
    });

    let fullResponse = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        process.stdout.write(content);
      }
    }

    return fullResponse;
  }
}
