#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { generateStructure } from './tree-mapper/generate-structure';
import { Style } from './tree-mapper/style';
import { parseArgs } from './util/args-utils';

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
    enableDescription: z
      .boolean()
      .default(defaults.enableDescription)
      .describe(
        'Enable reading file descriptions from first line. CAUTION: This tool should not be called for the entire project source and should preferably be used on small modules of the application for performance reasons.',
      ),
    descriptionPrefix: z
      .string()
      .default(defaults.descriptionPrefix ?? '')
      .describe(
        'The prefix string that identifies a description line. If the first line of a file starts with this prefix, the rest of the line will be used as the file description.',
      ),
  },
  async (input) => {
    const structure = await generateStructure(
      input.directory,
      input.exclude,
      input.style,
      input.recursion,
      input.gitignore,
      input.enableDescription,
      input.descriptionPrefix,
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
