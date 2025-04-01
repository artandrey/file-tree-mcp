import { createReadStream, statSync } from 'fs';
import { basename, resolve, sep } from 'path';

import { findFiles } from './find-files';
import { getPrefix } from './get-prefix';
import { Style } from './style';

async function readFirstLine(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = createReadStream(filePath, { encoding: 'utf8', highWaterMark: 1024 });
    let acc = '';
    stream.on('data', (chunk: string | Buffer<ArrayBufferLike>) => {
      acc += chunk;
      const newlineIndex = acc.indexOf('\n');
      if (newlineIndex !== -1) {
        stream.destroy();
        let line = acc.slice(0, newlineIndex);
        // Remove BOM if present
        line = line.replace(/^\uFEFF/, '');
        resolve(line);
      }
    });
    stream.on('error', (err: Error) => reject(err));
    stream.on('end', () => {
      const line = acc.replace(/^\uFEFF/, '');
      resolve(line);
    });
  });
}

export async function generateStructure(
  folderPath: string,
  excludePatterns: string[],
  style: Style,
  allowRecursion: boolean = true, // Toggle recursive search
  respectGitignore: boolean = false, // Toggle .gitignore usage
  enableDescription: boolean = false, // New parameter to enable description reading
  descriptionPrefix: string = '',
): Promise<string> {
  let structure = '';

  const items = await findFiles(
    folderPath, // Base directory
    ['**/*'], // Include all files
    excludePatterns, // Exclude patterns
    allowRecursion, // Toggle recursion
    respectGitignore, // Toggle .gitignore usage
  );

  // Normalize the folder path to correctly calculate depth
  const normalizedFolderPath = resolve(folderPath);

  // Iterate over each item and generate the structure
  for (const [index, item] of items.entries()) {
    const fullPath = resolve(item); // Ensure full path
    const isFolder = statSync(fullPath).isDirectory();
    const isLastItem = index === items.length - 1;

    // Calculate the depth of the current item relative to the base directory
    const relativePath = fullPath.replace(normalizedFolderPath, '').replace(/^[\\/]+/, '');
    // For the root level, depth should be 0
    const currentDepth = relativePath === '' ? 0 : relativePath.split(sep).length - 1;

    // Get the prefix for the current item
    const prefix = getPrefix(currentDepth, style, isLastItem, !isFolder);

    let displayName = basename(item);
    // If description reading is enabled and this is a file, read its first line
    if (enableDescription && !isFolder) {
      let description = '<no-description>';
      try {
        const firstLine = await readFirstLine(fullPath);
        if (firstLine.startsWith(descriptionPrefix)) {
          description = firstLine.substring(descriptionPrefix.length).trim() || '<no-description>';
        }
      } catch {
        description = '<failed to read description>';
      }
      displayName = `${displayName}: ${description}`;
    }

    // Add the item to the structure
    if (isLastItem) {
      structure += `${prefix}${displayName}`;
    } else {
      structure += `${prefix}${displayName}\n`;
    }
  }

  return structure;
}
