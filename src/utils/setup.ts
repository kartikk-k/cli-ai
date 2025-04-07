import inquirer from 'inquirer';
import { ApiKeyManager } from './apiKeyManager';
import { Storage } from './storage';
import { PROVIDER_MODELS } from './config';
import type { ProviderType } from './config';

export class Setup {
  static async setupProvider() {
    // Ask for provider
    const { provider } = await inquirer.prompt({
      type: 'list',
      name: 'provider',
      message: 'Select AI provider:',
      choices: Object.keys(PROVIDER_MODELS),
    });

    // Ask for model
    const { model } = await inquirer.prompt({
      type: 'list',
      name: 'model',
      message: 'Select model:',
      choices: PROVIDER_MODELS[provider as ProviderType],
    });

    // Remove (default) from model name
    const cleanModel = model.replace(' (default)', '');

    // Check for existing API key
    let apiKey = ApiKeyManager.getApiKey(provider);

    // Only prompt for API key if not present
    if (!apiKey) {
      const { newApiKey } = await inquirer.prompt({
        type: 'input',
        name: 'newApiKey',
        message: `Enter your ${provider.toUpperCase()} API key:`,
        validate: (input: string) => {
          if (input.length < 10) {
            return 'API key must be at least 10 characters long';
          }
          return true;
        },
      });
      apiKey = newApiKey;
      // Store API key
      if (apiKey) {
        ApiKeyManager.storeApiKey(apiKey, provider);
      }
    }

    // Save preferences
    Storage.setPreferences({ provider, model: cleanModel });

    return { provider, model: cleanModel, apiKey };
  }

  static async resetPreferences() {
    const { provider } = await inquirer.prompt({
      type: 'list',
      name: 'provider',
      message: 'Select AI provider:',
      choices: Object.keys(PROVIDER_MODELS).concat('All'),
    });

    if (provider === 'All') {
      // remove api keys for all providers
      Object.keys(PROVIDER_MODELS).forEach((provider) => {
        ApiKeyManager.removeApiKey(provider, true);
      });
    } else {
      // remove api key for selected provider
      ApiKeyManager.removeApiKey(provider);
    }
  }
} 