interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Wordnik MCP.
 */


const BASE = 'https://api.wordnik.com/v4';
const UA = 'pipeworx-mcp-wordnik/1.0 (+https://pipeworx.io)';

const wordParams = (extras: string[]) =>
  ({
    type: 'object' as const,
    properties: Object.fromEntries(
      [['word', { type: 'string' }] as const, ...extras.map((k) => [k, { type: ['boolean', 'number', 'string'] }] as const)],
    ) as Record<string, unknown>,
    required: ['word'],
  } as const);

const tools: McpToolExport['tools'] = [
  {
    name: 'definitions',
    description: 'Definitions.',
    inputSchema: { type: 'object', properties: { word: { type: 'string' }, limit: { type: 'number' }, partOfSpeech: { type: 'string' }, includeRelated: { type: 'boolean' }, sourceDictionaries: { type: 'string' }, useCanonical: { type: 'boolean' }, includeTags: { type: 'boolean' } }, required: ['word'] },
  },
  { name: 'examples', description: 'Usage examples.', inputSchema: { type: 'object', properties: { word: { type: 'string' }, limit: { type: 'number' }, skip: { type: 'number' }, includeDuplicates: { type: 'boolean' }, useCanonical: { type: 'boolean' } }, required: ['word'] } },
  { name: 'top_example', description: 'Single top example.', inputSchema: { type: 'object', properties: { word: { type: 'string' }, useCanonical: { type: 'boolean' } }, required: ['word'] } },
  { name: 'related', description: 'Related words.', inputSchema: { type: 'object', properties: { word: { type: 'string' }, relationshipTypes: { type: 'string' }, limitPerRelationshipType: { type: 'number' }, useCanonical: { type: 'boolean' } }, required: ['word'] } },
  { name: 'phrases', description: 'Bigram phrases.', inputSchema: { type: 'object', properties: { word: { type: 'string' }, limit: { type: 'number' }, wlmi: { type: 'number' }, useCanonical: { type: 'boolean' } }, required: ['word'] } },
  { name: 'pronunciations', description: 'Pronunciations.', inputSchema: { type: 'object', properties: { word: { type: 'string' }, sourceDictionary: { type: 'string' }, typeFormat: { type: 'string' }, useCanonical: { type: 'boolean' }, limit: { type: 'number' } }, required: ['word'] } },
  { name: 'hyphenation', description: 'Hyphenation.', inputSchema: { type: 'object', properties: { word: { type: 'string' }, sourceDictionary: { type: 'string' }, useCanonical: { type: 'boolean' }, limit: { type: 'number' } }, required: ['word'] } },
  { name: 'frequency', description: 'Usage frequency.', inputSchema: { type: 'object', properties: { word: { type: 'string' }, useCanonical: { type: 'boolean' }, startYear: { type: 'number' }, endYear: { type: 'number' } }, required: ['word'] } },
  { name: 'word_of_the_day', description: 'WotD.', inputSchema: { type: 'object', properties: { date: { type: 'string' } } } },
  {
    name: 'random_word',
    description: 'Random word.',
    inputSchema: { type: 'object', properties: { hasDictionaryDef: { type: 'boolean' }, includePartOfSpeech: { type: 'string' }, excludePartOfSpeech: { type: 'string' }, minCorpusCount: { type: 'number' }, minDictionaryCount: { type: 'number' }, minLength: { type: 'number' }, maxLength: { type: 'number' } } },
  },
  {
    name: 'random_words',
    description: 'N random words.',
    inputSchema: { type: 'object', properties: { hasDictionaryDef: { type: 'boolean' }, includePartOfSpeech: { type: 'string' }, excludePartOfSpeech: { type: 'string' }, minCorpusCount: { type: 'number' }, minDictionaryCount: { type: 'number' }, minLength: { type: 'number' }, maxLength: { type: 'number' }, limit: { type: 'number' } } },
  },
  {
    name: 'search',
    description: 'Word search.',
    inputSchema: { type: 'object', properties: { query: { type: 'string' }, caseSensitive: { type: 'boolean' }, includePartOfSpeech: { type: 'string' }, excludePartOfSpeech: { type: 'string' }, minCorpusCount: { type: 'number' }, minDictionaryCount: { type: 'number' }, minLength: { type: 'number' }, maxLength: { type: 'number' }, skip: { type: 'number' }, limit: { type: 'number' } }, required: ['query'] },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = (args._apiKey as string | undefined)?.trim();
  if (!apiKey) throw new Error('Wordnik requires an API key. Set PLATFORM_WORDNIK_KEY or pass ?_apiKey=… (free at https://developer.wordnik.com/).');
  const get = async (path: string, extras: Record<string, unknown> = {}) => {
    const p = new URLSearchParams({ api_key: apiKey });
    for (const [k, v] of Object.entries(extras)) {
      if (k === '_apiKey' || v == null) continue;
      p.set(k, String(v));
    }
    const res = await fetch(`${BASE}${path}?${p}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
    if (res.status === 401 || res.status === 403) throw new Error('Wordnik: invalid API key.');
    if (!res.ok) throw new Error(`Wordnik: ${res.status}`);
    return res.json();
  };
  const word = (ex: string) => {
    const v = args.word;
    if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "word" is missing. Pass a string like ${ex}.`);
    return encodeURIComponent(v);
  };
  const pick = (keys: string[]) => Object.fromEntries(keys.map((k) => [k, args[k]]));
  switch (name) {
    case 'definitions':
      return get(`/word.json/${word('"perspicacious"')}/definitions`, pick(['limit', 'partOfSpeech', 'includeRelated', 'sourceDictionaries', 'useCanonical', 'includeTags']));
    case 'examples':
      return get(`/word.json/${word('"perspicacious"')}/examples`, pick(['limit', 'skip', 'includeDuplicates', 'useCanonical']));
    case 'top_example':
      return get(`/word.json/${word('"perspicacious"')}/topExample`, pick(['useCanonical']));
    case 'related':
      return get(`/word.json/${word('"perspicacious"')}/relatedWords`, pick(['relationshipTypes', 'limitPerRelationshipType', 'useCanonical']));
    case 'phrases':
      return get(`/word.json/${word('"perspicacious"')}/phrases`, pick(['limit', 'wlmi', 'useCanonical']));
    case 'pronunciations':
      return get(`/word.json/${word('"perspicacious"')}/pronunciations`, pick(['sourceDictionary', 'typeFormat', 'useCanonical', 'limit']));
    case 'hyphenation':
      return get(`/word.json/${word('"perspicacious"')}/hyphenation`, pick(['sourceDictionary', 'useCanonical', 'limit']));
    case 'frequency':
      return get(`/word.json/${word('"perspicacious"')}/frequency`, pick(['useCanonical', 'startYear', 'endYear']));
    case 'word_of_the_day':
      return get('/words.json/wordOfTheDay', pick(['date']));
    case 'random_word':
      return get('/words.json/randomWord', pick(['hasDictionaryDef', 'includePartOfSpeech', 'excludePartOfSpeech', 'minCorpusCount', 'minDictionaryCount', 'minLength', 'maxLength']));
    case 'random_words':
      return get('/words.json/randomWords', pick(['hasDictionaryDef', 'includePartOfSpeech', 'excludePartOfSpeech', 'minCorpusCount', 'minDictionaryCount', 'minLength', 'maxLength', 'limit']));
    case 'search':
      return get(`/words.json/search/${encodeURIComponent(reqStr(args, 'query', '"perspicac"'))}`, pick(['caseSensitive', 'includePartOfSpeech', 'excludePartOfSpeech', 'minCorpusCount', 'minDictionaryCount', 'minLength', 'maxLength', 'skip', 'limit']));
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
