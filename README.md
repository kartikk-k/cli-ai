# cli-ai

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts "your question"
```

### Flags

`--provider`: Switch AI provider [OpenAI, Groq]

`--model`: Switch model

`--reset`: Reset/Remove API keys

### Use `ask-ai` command

Add alias in `~/.zshrc`

```bash
alias ask-ai="bun run path-to-your-project/index.ts"
```

Reload the shell or open a new terminal
