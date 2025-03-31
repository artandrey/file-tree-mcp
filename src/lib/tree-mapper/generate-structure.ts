import { statSync } from 'fs';
import { basename, resolve, sep } from 'path';

import { findFiles } from './find-files';
import { getPrefix } from './get-prefix';
import { Style } from './style';

export async function generateStructure(
  folderPath: string,
  excludePatterns: string[],
  style: Style,
  allowRecursion: boolean = true, // Toggle recursive search
  respectGitignore: boolean = false, // Toggle .gitignore usage
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
    const currentDepth = relativePath.split(sep).length - 1;

    // Get the prefix for the current item
    const prefix = getPrefix(currentDepth, style, isLastItem, !isFolder);

    // Add the item to the structure
    if (isLastItem) {
      structure += `${prefix}${basename(item)}`;
    } else {
      structure += `${prefix}${basename(item)}\n`;
    }
  }

  return structure;
}
