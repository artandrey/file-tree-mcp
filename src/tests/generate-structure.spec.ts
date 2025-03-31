import { generateStructure } from '../lib/tree-mapper/generate-structure';
import { Style } from '../lib/tree-mapper/style';

describe('generate structure', () => {
  it('should generate file tree', async () => {
    const structure = generateStructure('./mock-tree', ['.git', 'node_modules'], Style.ClassicDashes, true, true);
    await expect(structure).resolves.toBe(
      `└── folder
    ├── nested-file.txt
├── file.txt
└── file2.txt`,
    );
  });
});
