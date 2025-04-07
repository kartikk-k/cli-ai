import { Command } from 'commander';
import { marked } from 'marked';
import TerminalRenderer from 'marked-terminal';
import inquirer from 'inquirer';
import { Storage } from './src/utils/storage';
import { ApiKeyManager } from './src/utils/apiKeyManager';
import { Setup } from './src/utils/setup';
import { initializeProvider, askAI } from './src/askAI';

// Configure marked for terminal output
marked.setOptions({
    renderer: new TerminalRenderer() as any
});

const program = new Command();

// Main CLI setup
program
    .name('ai-chat')
    .description('CLI tool for interacting with AI')
    .version('1.0.0')
    .addHelpText('after', `
Examples:
  $ ai-chat "What is the capital of France?"
  $ ai-chat --set-api "your-api-key" --provider openai
  $ ai-chat --remove-api --provider openai
  $ ai-chat --model "gpt-4" "What is the capital of France?"
  $ ai-chat --help
`);

program
    .option('--set-api <key>', 'Set and store API key')
    .option('--remove-api', 'Remove stored API key')
    .option('--provider <provider>', 'Set AI provider to use (openai or groq)')
    .option('--model <model>', 'Set model to use')
    .argument('[question]', 'Question to ask the AI')
    .action(async (question: string, options: {
        setApi?: string;
        removeApi?: boolean;
        provider?: string;
        model?: string
    }) => {
        try {
            // Handle API key operations
            if (options.removeApi) {
                ApiKeyManager.removeApiKey(options.provider || 'openai');
                return;
            }

            let providerType = options.provider;
            let model = options.model;
            let apiKey = options.setApi;

            // Check if we have valid preferences
            if (!Storage.hasValidPreferences()) {
                const setup = await Setup.setupProvider();
                providerType = setup.provider;
                model = setup.model;
                apiKey = setup.apiKey;
            } else {
                const preferences = Storage.getPreferences();
                if (preferences) {
                    providerType = providerType || preferences.provider;
                    model = model || preferences.model;
                }
            }

            // Initialize provider
            if (apiKey) {
                initializeProvider(apiKey, providerType!);
            } else if (providerType === 'openai' && ApiKeyManager.getApiKey('openai')) {
                initializeProvider(ApiKeyManager.getApiKey('openai')!, 'openai');
            } else if (providerType === 'groq' && ApiKeyManager.getApiKey('groq')) {
                initializeProvider(ApiKeyManager.getApiKey('groq')!, 'groq');
            } else {
                console.error('Error: No API key provided. Use --set-api flag or set appropriate API key environment variable.');
                process.exit(1);
            }

            // If no question provided, prompt user
            if (!question) {
                const { question: userQuestion } = await inquirer.prompt({
                    type: 'input',
                    name: 'question',
                    message: 'What would you like to ask?',
                });
                question = userQuestion;
            }

            await askAI(question, model!);
            process.exit(0); // Exit after one question
        } catch (error: any) {
            console.error('Error:', error.message);
            process.exit(1);
        }
    });

program.parse(process.argv);