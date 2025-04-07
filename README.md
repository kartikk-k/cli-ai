# terminal.ai

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts "your question"
```

### Flags

`--remove-api`: Remove stored API key

`--provider`: Select AI provider

`--model`: Select model

`--reset`: Reset API keys

### Use `ask-ai` command

Add alias in `~/.zshrc`

```bash
alias ask-ai="bun run path-to-your-project/index.ts"
```

Then reload the shell
