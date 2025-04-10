import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import os from 'os';

// Load environment variables
dotenv.config();

export class ApiKeyManager {
  private static getApiKeysFilePath(): string {
    return path.join(os.homedir(), '.terminal-ai-api-keys.json');
  }

  private static readApiKeysFile(): Record<string, string> {
    const filePath = this.getApiKeysFilePath();
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
      } catch (error) {
        console.error('Error reading API keys file:', error);
        return {};
      }
    }
    return {};
  }

  private static writeApiKeysFile(apiKeys: Record<string, string>) {
    const filePath = this.getApiKeysFilePath();
    fs.writeFileSync(filePath, JSON.stringify(apiKeys, null, 2));
  }

  static storeApiKey(apiKey: string, providerType: string) {
    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';

    // Read existing .env file if it exists
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    const envVar = providerType === 'openai' ? 'OPENAI_API_KEY' : 'GROQ_API_KEY';

    // Check if API key already exists in .env
    if (envContent.includes(`${envVar}=`)) {
      // Replace existing API key
      envContent = envContent.replace(
        new RegExp(`${envVar}=.*`),
        `${envVar}=${apiKey}`
      );
    } else {
      // Append new API key
      envContent += `\n${envVar}=${apiKey}`;
    }

    // Write back to .env file
    fs.writeFileSync(envPath, envContent.trim());
    console.log(`${providerType.toUpperCase()} API key has been stored in .env file`);

    // Store in JSON file
    const apiKeys = this.readApiKeysFile();
    apiKeys[providerType] = apiKey;
    this.writeApiKeysFile(apiKeys);
    console.log(`${providerType.toUpperCase()} API key has been stored in ${this.getApiKeysFilePath()}`);
  }

  static removeApiKey(providerType: string, all: boolean = false) {
    const envPath = path.join(process.cwd(), '.env');

    if (!fs.existsSync(envPath)) {
      console.log('No API key found to remove');
      return;
    }

    let envContent = fs.readFileSync(envPath, 'utf8');
    const envVar = all ? 'all' : providerType === 'openai' ? 'OPENAI_API_KEY' : 'GROQ_API_KEY';

    if (all) {
      envContent = envContent.replace(/OPENAI_API_KEY=.*\n?/g, '');
      envContent = envContent.replace(/GROQ_API_KEY=.*\n?/g, '');
      fs.writeFileSync(envPath, envContent.trim());
      console.log('All API keys have been removed from .env file');

      // Remove all keys from JSON file
      this.writeApiKeysFile({});
      console.log('All API keys have been removed from JSON file');
      return;
    }

    if (envContent.includes(`${envVar}=`)) {
      // Remove the API key line
      envContent = envContent.replace(new RegExp(`${envVar}=.*\n?`), '');
      fs.writeFileSync(envPath, envContent.trim());
      console.log(`${providerType.toUpperCase()} API key has been removed from .env file`);

      // Remove from JSON file
      const apiKeys = this.readApiKeysFile();
      delete apiKeys[providerType];
      this.writeApiKeysFile(apiKeys);
      console.log(`${providerType.toUpperCase()} API key has been removed from JSON file`);
    } else {
      console.log('No API key found to remove');
    }
  }

  static getApiKey(providerType: string): string | undefined {
    // First try to get from JSON file
    const apiKeys = this.readApiKeysFile();
    if (apiKeys[providerType]) {
      return apiKeys[providerType];
    }

    // Fallback to environment variable
    const envVar = providerType === 'openai' ? 'OPENAI_API_KEY' : 'GROQ_API_KEY';
    return process.env[envVar];
  }
} 