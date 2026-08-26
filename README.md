# @pipeworx/wordnik

[Wordnik](https://developer.wordnik.com/) MCP — English dictionary, word lookups, related words. Free dev key.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/wordnik/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Wordnik data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
