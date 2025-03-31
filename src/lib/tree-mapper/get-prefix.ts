import { Style } from './style';

export type GetPrefixFunction = (depth: number, style: Style, isLastItem?: boolean, isFile?: boolean) => string;

export const getPrefix: GetPrefixFunction = (depth, style, isLastItem = false, isFile = false) => {
  // Only repeat spaces for items not at root level
  const repeatStr = depth > 0 ? '    '.repeat(depth) : '';
  let prefix;

  const folderPrefixes: Record<Style, string> = {
    [Style.ClassicDashes]: `└── `,
    [Style.SlashSeparators]: `/ `,
  };

  const filePrefixes: Record<Style, string> = {
    [Style.ClassicDashes]: `├── `,
    [Style.SlashSeparators]: `/ `,
  };

  const lastItemPrefixes: Record<Style, string> = {
    [Style.ClassicDashes]: `└── `,
    [Style.SlashSeparators]: `/ `,
  };

  if (isFile) {
    prefix = isLastItem ? lastItemPrefixes[style] : filePrefixes[style];
  } else {
    prefix = isLastItem ? lastItemPrefixes[style] : folderPrefixes[style];
  }

  return repeatStr + prefix;
};
