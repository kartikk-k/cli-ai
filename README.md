# Terminal AI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.0.0-blueviolet.svg)](https://bun.sh/)

A powerful command-line AI assistant that helps you get answers to your questions directly from your terminal. Supports multiple AI providers including OpenAI and Groq.

## Features

- 🔍 Ask questions directly from your terminal
- 🤖 Multiple AI provider support (OpenAI, Groq)
- ⚙️ Configurable model selection
- 🔑 Secure API key management
- 🎨 Beautiful terminal output formatting
- 📝 Markdown support in responses

## Installation

### Prerequisites

- [Bun](https://bun.sh/) (v1.0.0 or later)
- Node.js (v18 or later)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/terminal-ai.git
cd terminal-ai
```

2. Install dependencies:
```bash
bun install
```


## Usage

### Basic Usage

```bash
bun run index.ts "your question here"
```

### Advanced Usage

```bash
# Specify AI provider
bun run index.ts "your question" --provider openai

# Specify model
bun run index.ts "your question" --model gpt-4

# Reset API keys
bun run index.ts --reset
```

### Command Alias

Add the following to your `~/.zshrc` or `~/.bashrc`:

```bash
alias ask-ai="bun run /path/to/terminal-ai/index.ts"
```

Then reload your shell:
```bash
source ~/.zshrc  # or source ~/.bashrc
```

Now you can use:
```bash
ask-ai "your question"
```

## Configuration

### Available Providers
- OpenAI
- Groq

### Available Models
- OpenAI: gpt-3.5-turbo, gpt-4, etc.
- Groq: mixtral-8x7b-32768, llama2-70b-4096, etc.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [OpenAI](https://openai.com/)
- [Groq](https://groq.com/)
- [Bun](https://bun.sh/)
