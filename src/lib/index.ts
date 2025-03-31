#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { parseArgs } from './args-parser';
import { generateStructure } from './tree-mapper/generate-structure';
import { Style } from './tree-mapper/style';

// Get default values from command line args
const defaults = parseArgs();

const server = new McpServer({
  name: 'file-tree',
  version: '1.0.0',
});

server.tool(
  'generate-file-tree',
  {
    directory: z.string().describe(defaults.directoryRules),
    exclude: z.array(z.string()).default(defaults.exclude),
    style: z.nativeEnum(Style).default(defaults.style),
    recursion: z.boolean().default(defaults.recursion),
    gitignore: z.boolean().default(defaults.gitignore),
  },
  async (input) => {
    const structure = await generateStructure(
      input.directory,
      input.exclude,
      input.style,
      input.recursion,
      input.gitignore,
    );

    return {
      content: [
        {
          type: 'text',
          text: structure,
        },
      ],
    };
  },
);

const init = async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
};

init();
