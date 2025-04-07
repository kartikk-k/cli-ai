export const PROVIDER_MODELS = {
  openai: ['gpt-4o-mini (default)', 'gpt-4', 'gpt-3.5-turbo'],
  groq: ['llama-3.1-8b-instant (default)', 'llama3-70b-8192']
} as const;

export type ProviderType = keyof typeof PROVIDER_MODELS;
export type ModelType = typeof PROVIDER_MODELS[ProviderType][number]; 