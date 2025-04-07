import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export class ApiKeyManager {
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
  }

  static removeApiKey(providerType: string) {
    const envPath = path.join(process.cwd(), '.env');
    
    if (!fs.existsSync(envPath)) {
      console.log('No API key found to remove');
      return;
    }

    let envContent = fs.readFileSync(envPath, 'utf8');
    const envVar = providerType === 'openai' ? 'OPENAI_API_KEY' : 'GROQ_API_KEY';
    
    if (envContent.includes(`${envVar}=`)) {
      // Remove the API key line
      envContent = envContent.replace(new RegExp(`${envVar}=.*\n?`), '');
      fs.writeFileSync(envPath, envContent.trim());
      console.log(`${providerType.toUpperCase()} API key has been removed from .env file`);
    } else {
      console.log('No API key found to remove');
    }
  }

  static getApiKey(providerType: string): string | undefined {
    const envVar = providerType === 'openai' ? 'OPENAI_API_KEY' : 'GROQ_API_KEY';
    return process.env[envVar];
  }
} 