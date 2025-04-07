import fs from 'fs';
import path from 'path';
import { ApiKeyManager } from './apiKeyManager';

interface Preferences {
  provider: string;
  model: string;
}

const STORAGE_FILE = path.join(process.cwd(), '.ai-chat-preferences.json');

export class Storage {
  static getPreferences(): Preferences | null {
    try {
      if (fs.existsSync(STORAGE_FILE)) {
        const data = fs.readFileSync(STORAGE_FILE, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading preferences:', error);
    }
    return null;
  }

  static setPreferences(preferences: Preferences) {
    try {
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(preferences, null, 2));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }


  static hasValidPreferences(): boolean {
    const prefs = this.getPreferences();
    if (!prefs) return false;
    
    const hasApiKey = ApiKeyManager.getApiKey(prefs.provider) !== undefined;
    return Boolean(prefs.provider && prefs.model && hasApiKey);
  }
} 