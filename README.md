# Model Context Protocol - File Tree Generator

A Model Context Protocol (MCP) server that generates visual file tree representations. This tool allows AI agents to easily visualize directory structures and file relationships in a project.

## About MCP

Model Context Protocol (MCP) is an open protocol that standardizes how applications provide context to LLMs (Large Language Models). MCP helps AI models integrate with external data sources and tools, providing a standardized way to connect AI models to different data sources and tools.

## Installation

```bash
# Install globally from npm
npm install -g file-tree-mcp

# Or with yarn
yarn global add file-tree-mcp

# Or with pnpm
pnpm add -g file-tree-mcp
```

## Usage

### Using with Claude Desktop or other MCP-compatible clients

This package provides an MCP server that can be configured in your MCP client (such as Claude Desktop). After installing globally, you can set it up in your MCP client configuration:

Example `.cursor/mcp.json` configuration:

```json
{
  "mcpServers": {
    "file-tree": {
      "command": "generate-file-tree",
      "args": [
        "--directory-rules",
        "\"Use absolute Windows paths starting with drive letter. No relative paths.\"",
        "--style",
        "ClassicDashes",
        "--recursion",
        "--gitignore",
        "--exclude",
        ".git",
        "--enable-description-by-default",
        "--description-prefix",
        "##"
      ]
    }
  }
}
```

## CLI Options

The file tree generator accepts the following command-line options:

| Flag | Long Option                       | Description                                        | Example                                  |
| ---- | --------------------------------- | -------------------------------------------------- | ---------------------------------------- |
| `-s` | `--style`                         | Output style: `ClassicDashes` or `SlashSeparators` | `--style ClassicDashes`                  |
| `-r` | `--recursion`                     | Enable recursive directory traversal               | `--recursion`                            |
| `-g` | `--gitignore`                     | Respect .gitignore files                           | `--gitignore`                            |
| `-e` | `--exclude`                       | Patterns to exclude from the tree                  | `--exclude node_modules`                 |
| `-d` | `--directory-rules`               | Rules for directory path formatting                | `--directory-rules "Use absolute paths"` |
|      | `--enable-description-by-default` | Default enable reading file descriptions           | `--enable-description-by-default`        |
|      | `--description-prefix`            | Prefix for file descriptions                       | `--description-prefix "##"`              |

### Directory Rules

The `--directory-rules` option is particularly important as it provides instructions about how paths should be formatted when passed to the `directory` parameter in MCP. This helps AI models understand the required format for paths in your specific environment.

Examples for different operating systems in `mcp.json`:

- **Windows**:

  ```json
  {
    "mcpServers": {
      "file-tree": {
        "command": "generate-file-tree",
        "args": [
          "--directory-rules",
          "\"Use absolute Windows paths starting with drive letter. No relative paths.\""
          // other options...
        ]
      }
    }
  }
  ```

  - Valid path: `C:\Projects\my-app`
  - Invalid path: `./my-app`

- **Unix/Linux/macOS**:
  ```json
  {
    "mcpServers": {
      "file-tree": {
        "command": "generate-file-tree",
        "args": [
          "--directory-rules",
          "\"Use absolute paths starting with /. No relative paths.\""
          // other options...
        ]
      }
    }
  }
  ```
  - Valid path: `/home/user/projects/my-app`
  - Invalid path: `./my-app`

When used in a tool like Cursor or other code editors, these rules help ensure the AI model provides correctly formatted paths that work in your environment.

## API Options

When using the MCP server, the following parameters are available:

| Option              | Type     | Description                                        | Default         |
| ------------------- | -------- | -------------------------------------------------- | --------------- |
| `directory`         | string   | The directory path to generate the tree from       | Required        |
| `exclude`           | string[] | Patterns to exclude from the tree                  | `['.git']`      |
| `style`             | enum     | Output style: `ClassicDashes` or `SlashSeparators` | `ClassicDashes` |
| `recursion`         | boolean  | Whether to include subdirectories recursively      | `true`          |
| `gitignore`         | boolean  | Whether to respect .gitignore files                | `true`          |
| `enableDescription` | boolean  | Whether to read and display file descriptions      | `false`         |
| `descriptionPrefix` | string   | Prefix used to identify description lines          | `""`            |

### Output Styles

#### ClassicDashes

```
└── folder
    ├── file1.txt
    ├── file2.txt
    └── subfolder
        └── file3.txt
```

#### SlashSeparators

```
/ folder
    / file1.txt
    / file2.txt
    / subfolder
        / nested-file.txt
```

## Example Output

Here's an example of the file tree output using SlashSeparators style:

```
/ src
    / lib
        / args-parser.ts
        / index.ts
        / tree-mapper
            / find-files.ts
            / generate-structure.ts
            / get-prefix.ts
            / style.ts
    / tests
        / generate-structure.spec.ts
/ .gitignore
/ package.json
/ README.md
/ tsconfig.json
```

## File Descriptions

This tool can now read and display descriptions from the first line of files. When `enableDescription` is set to `true`, the tool will check if the first line of each file starts with the specified `descriptionPrefix`. If it does, the rest of that line will be used as the file's description in the generated tree.

### Examples

1. **With `--enable-description-by-default` and `--description-prefix "##"`:**

If a file contains:

```
##This is a file that handles user authentication
import { ... }
```

The tree will display:

```
└── auth.js: This is a file that handles user authentication
```

2. **For files without a description:**

Files that don't have a description line starting with the specified prefix will show `<no-description>`:

```
└── index.js: <no-description>
```

> **Note:** For performance reasons, this feature should be used on small modules of your application rather than the entire project source.

## License

MIT
