import { OpenAIProvider } from '../providers/openai';
import { GroqProvider } from '../providers/groq';
import ora from 'ora';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { Storage } from './utils/storage';
import { ApiKeyManager } from './utils/apiKeyManager';

// Initialize provider
let provider: OpenAIProvider | GroqProvider;

// Function to initialize provider with API key
export function initializeProvider(apiKey: string, providerType: string) {
  if (providerType === 'openai') {
    provider = new OpenAIProvider(apiKey);
  } else {
    provider = new GroqProvider(apiKey);
  }
}

// Function to ask question to AI with streaming
export async function askAI(question: string, model: string) {
  if (!provider) {
    throw new Error('Provider not initialized. Please provide an API key.');
  }

  const spinner = ora('Thinking...').start();
  const startTime = Date.now();
  
  try {
    spinner.succeed('Response:');
    console.log('\n');

    const response = await provider.ask(question, model);

    const endTime = Date.now();
    const responseTime = (endTime - startTime) / 1000;
    
    process.stdout.write('\n');
    console.log(chalk.gray(`Response time: ${responseTime.toFixed(2)}s | Model: ${model}`));
    return response;
  } catch (error: any) {
    spinner.fail('Error occurred');
    
    // Check if error is due to incorrect API key
    if (error.message?.includes('Incorrect API key provided')) {
      // Remove preferences file
      const prefsPath = path.join(process.cwd(), '.ai-chat-preferences.json');
      if (fs.existsSync(prefsPath)) {
        fs.unlinkSync(prefsPath);
      }
      
      // Remove API key from .env
      const preferences = Storage.getPreferences();
      if (preferences) {
        ApiKeyManager.removeApiKey(preferences.provider);
      }
      
      console.error(chalk.red('Incorrect API key provided. Please set up your provider again.'));
    }
    
    throw error;
  }
} 