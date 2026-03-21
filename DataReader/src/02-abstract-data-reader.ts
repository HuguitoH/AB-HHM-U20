/**
 * DataReader that uses a Reader object instead of a function to 
 * read and process file contents.
 * 
 * Declares an abstract Reader class.
 * 
 * Implements a concrete ReaderCSV class.
 */

import fs from 'node:fs';

/**
 *  POJO is a plain object (key:value)
 * 
 * Example:
 * {
 *   nombre: 'Carlos',
 *   edad: 22,
 *   ciudad: 'Sevilla'
 * }
 */

interface POJO {
  [key:string]: unknown;
}

// Item Class
// 
class Item {
  private rowNumber?: number;
  private data: POJO;

  constructor(rowNumber: number, data: POJO) {
    this.rowNumber = rowNumber;
    this.data = data;
  }

  getRowNumber(): number | undefined {
    return this.rowNumber;
  }

  getData(): POJO {
    return this.data;
  }

}


// Reader Class  (ABSTRACT)
abstract class AbstractReader {
  private path: string;  // File to read
  protected dataStream: string;  // Data stream

  constructor(path: string) {
    this.path = path;
    try {
    this.dataStream = fs.readFileSync(path, 'utf8');
    } catch (error: any) {
      throw new Error(`Unable to open and read file: ${error?.message}`);
    }
  }
  public abstract read(): { header: Item, rows: Item[]};

}


// ReaderCSV Class 
class ReaderCSV extends AbstractReader {

  // Read a file and returns an array of rows
  public read(): { header: Item, rows: Item[]} {
    // Split input file in lines
    const lines = this.dataStream.trim().split('\n');
    const headerLine = <string>lines[0];
    lines.shift();

    // Split header fields separated by comma, and convert to array
    const headerArray = headerLine.split(',').filter(v => v !== '');

    // Create a header POJO object, and then fill it with the header values
    const headerData = {} as POJO;
    for(const key of headerArray) {
      headerData[key] = key;
    }

    // Build header item
    const header = new Item(0, headerData);

    // For each of the other lines, we build an object
    const rows: Item[] = [];

    let counter = 0;
    for (const line of lines) {
      
      // Build an object with row data in key-value pairs
      const pojo:POJO = {};
      const rowArray = line.split(',').filter(v => v !== '');
      
      // For each element in the row array, we add a key->value pair to pojo
      let n = 0;
      while (n < headerArray.length) {
        const key = <string>headerArray[n];
        const value = rowArray[n];
        pojo[key] = value;
        n++;
      }

      const item = new Item(counter++, pojo);
      rows.push(item);
    }
    return { header, rows };
  }
}


// Parse parameters
const args = process.argv.slice(2)
const [command, file] = process.argv;

if(args.length != 2 || args[0] !== '--input-file') {
  console.error(`Usage: ${command} ${file} --input-file filename`)
  process.exit(1);
}
const dataFile= args[1] as string;

// Show Data in Console
const reader = new ReaderCSV(dataFile);

const { header, rows } = reader.read();

console.log('Header: ', header);
console.log('Rows: ', rows);
