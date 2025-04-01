import { createReadStream } from 'fs';

/**
 * Efficiently reads the first line of a file without loading the entire file into memory.
 * @param filePath Path to the file to read
 * @returns Promise that resolves to the first line of the file
 */
export async function readFirstLine(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = createReadStream(filePath, { encoding: 'utf8', highWaterMark: 1024 });
    let acc = '';
    stream.on('data', (chunk: string | Buffer) => {
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
