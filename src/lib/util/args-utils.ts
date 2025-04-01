import { Style } from '../tree-mapper/style';

// Define the type for the command line arguments
export interface Args {
  style: Style;
  recursion: boolean;
  gitignore: boolean;
  exclude: string[];
  directoryRules: string;
  enableDescription: boolean;
  descriptionPrefix: string | null;
}

/**
 * Parse command line arguments
 * @returns Parsed command line arguments
 */
export function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const result: Args = {
    style: Style.ClassicDashes,
    recursion: false,
    gitignore: false,
    exclude: [] as string[],
    directoryRules: '',
    enableDescription: false,
    descriptionPrefix: null,
  };

  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    switch (flag) {
      case '--style':
      case '-s':
        if (i + 1 < argv.length) {
          result.style = argv[i + 1] as Style;
          i++;
        }
        break;
      case '--recursion':
      case '-r':
        result.recursion = true;
        break;
      case '--gitignore':
      case '-g':
        result.gitignore = true;
        break;
      case '--exclude':
      case '-e':
        if (i + 1 < argv.length) {
          result.exclude.push(argv[i + 1]);
          i++;
        }
        break;
      case '--directory-rules':
      case '-d':
        if (i + 1 < argv.length) {
          let value = '';
          // Move past the flag and take the initial token as start
          const token = argv[i + 1];
          i += 2;
          if (token.startsWith('"')) {
            // Token is quoted
            if (token.endsWith('"') && token.length > 1) {
              // Fully quoted in one token, remove quotes
              value = token.slice(1, -1);
            } else {
              // Remove starting quote
              value = token.slice(1);
              // Continue joining tokens until we find one that ends with '"'
              while (i < argv.length && !argv[i].endsWith('"')) {
                value += ' ' + argv[i];
                i++;
              }
              if (i < argv.length) {
                // Append the final token without the ending quote
                value += ' ' + argv[i].slice(0, -1);
                i++;
              }
            }
          } else {
            // Not quoted: join tokens until a token starting with '-' is encountered
            value = token;
            while (i < argv.length && !argv[i].startsWith('-')) {
              value += ' ' + argv[i];
              i++;
            }
          }
          result.directoryRules = value;
        }
        break;
      case '--enable-description-by-default':
        result.enableDescription = true;
        break;
      case '--description-prefix':
        if (i + 1 < argv.length) {
          result.descriptionPrefix = argv[i + 1];
          i++;
        }
        break;
      default:
        // Unknown argument, ignore or log
        break;
    }
  }
  return result;
}
