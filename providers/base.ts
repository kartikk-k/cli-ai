export abstract class BaseProvider {
  protected systemPrompt: string = `
You are a helpful developer assistant. Try to keep answer short and concise.
`;

  abstract ask(question: string, model?: string): Promise<string>;
}
