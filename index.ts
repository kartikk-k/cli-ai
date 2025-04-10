import { Command } from 'commander';
import { marked } from 'marked';
import TerminalRenderer from 'marked-terminal';
import inquirer from 'inquirer';
import { Storage } from './src/utils/storage';
import { ApiKeyManager } from './src/utils/apiKeyManager';
import { Setup } from './src/utils/setup';
import { initializeProvider, askAI } from './src/askAI';
import { PROVIDER_MODELS } from './src/utils/config';
import { getOS } from './src/utils/getOS';

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
  $ ai-chat --set-api "your-api-key"
  $ ai-chat --remove-api
  $ ai-chat --reset
  $ ai-chat --help
`);

program
    .option('--set-api <key>', 'Set and store API key')
    .option('--remove-api', 'Remove stored API key')
    .option('--provider', 'Select AI provider')
    .option('--model', 'Select model')
    .option('--reset', 'Reset API keys')
    .argument('[question]', 'Question to ask the AI')
    .action(async (question: string, options: {
        setApi?: string;
        removeApi?: boolean;
        provider?: string;
        model?: string;
        reset?: string;
    }) => {
        try {
            if(options.reset) {
                await Setup.resetPreferences();
                console.log('Preferences reset successfully');
                return;
            }

            // Handle API key operations
            if (options.removeApi) {
                const { provider } = await inquirer.prompt({
                    type: 'list',
                    name: 'provider',
                    message: 'Select provider to remove API key from:',
                    choices: Object.keys(PROVIDER_MODELS),
                });
                ApiKeyManager.removeApiKey(provider);
                return;
            }

            let providerType: string;
            let model: string;
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
                    // Only ask for provider if --provider flag is used
                    if (options.provider) {
                        const setup = await Setup.setupProvider();
                        providerType = setup.provider;
                        model = setup.model;
                        apiKey = setup.apiKey;
                    } else {
                        providerType = preferences.provider;
                    }

                    // Only ask for model if --model flag is used
                    if (options.model) {
                        const setup = await Setup.setupProvider();
                        providerType = setup.provider;
                        model = setup.model;
                        apiKey = setup.apiKey;
                    } else {
                        model = preferences.model;
                    }
                } else {
                    const setup = await Setup.setupProvider();
                    providerType = setup.provider;
                    model = setup.model;
                    apiKey = setup.apiKey;
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

            await askAI(`Operating System: ${getOS()}\n` + question, model!);
            process.exit(0); // Exit after one question
        } catch (error: any) {
            console.error('Error:', error.message);
            process.exit(1);
        }
    });

program.parse(process.argv);