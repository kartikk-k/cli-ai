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

    // Ask for API key
    const { apiKey } = await inquirer.prompt({
      type: 'password',
      name: 'apiKey',
      message: `Enter your ${provider.toUpperCase()} API key:`,
      validate: (input) => {
        if (input.length < 10) {
          return 'API key must be at least 10 characters long';
        }
        return true;
      },
    });

    // Store API key
    ApiKeyManager.storeApiKey(apiKey, provider);

    // Save preferences
    Storage.setPreferences({ provider, model: cleanModel });

    return { provider, model: cleanModel, apiKey };
  }
} 