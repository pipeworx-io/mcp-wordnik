# @pipeworx/wordnik

[Wordnik](https://developer.wordnik.com/) MCP — English dictionary, word lookups, related words. Free dev key.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Auth

- Platform: `PLATFORM_WORDNIK_KEY`. BYO: `?_apiKey=…`.

## Tools

- `definitions(word, limit?, partOfSpeech?, includeRelated?, sourceDictionaries?, useCanonical?, includeTags?)` — definitions
- `examples(word, limit?, skip?, includeDuplicates?, useCanonical?)` — usage examples
- `top_example(word, useCanonical?)` — single top example
- `related(word, relationshipTypes?, limitPerRelationshipType?, useCanonical?)` — related words (syn/ant/etc)
- `phrases(word, limit?, wlmi?, useCanonical?)` — bigram phrases
- `pronunciations(word, sourceDictionary?, typeFormat?, useCanonical?, limit?)` — pronunciations
- `hyphenation(word, sourceDictionary?, useCanonical?, limit?)` — hyphenation
- `frequency(word, useCanonical?, startYear?, endYear?)` — usage frequency over time
- `word_of_the_day(date?)` — WotD
- `random_word(hasDictionaryDef?, includePartOfSpeech?, excludePartOfSpeech?, minCorpusCount?, minDictionaryCount?, minLength?, maxLength?)` — random word
- `random_words(...)` — N random words
- `search(query, caseSensitive?, includePartOfSpeech?, excludePartOfSpeech?, minCorpusCount?, minDictionaryCount?, minLength?, maxLength?, skip?, limit?)` — word search

## Data source

`https://api.wordnik.com/v4`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "wordnik": {
      "url": "https://gateway.pipeworx.io/wordnik/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Wordnik data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
