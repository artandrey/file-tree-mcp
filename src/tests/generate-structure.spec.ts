import { generateStructure } from '../lib/tree-mapper/generate-structure';
import { Style } from '../lib/tree-mapper/style';

describe('generate structure', () => {
  it('should generate file tree', async () => {
    // Using existing 'mock-tree' fixture
    const structure = await generateStructure('./mock-tree', ['.git', 'node_modules'], Style.ClassicDashes, true, true);
    expect(structure).toBe(`└── folder
    ├── nested-file.txt
├── desc-file.txt
├── file.txt
└── file2.txt`);
  });

  it('should read file description when enableDescription is true', async () => {
    const structure = await generateStructure('./mock-tree', [], Style.ClassicDashes, false, false, true, '##');
    expect(structure).toBe(`└── folder
├── desc-file.txt: This is a test description
├── file.txt: <no-description>
└── file2.txt: <no-description>`);
  });
});
