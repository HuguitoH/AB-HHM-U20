
/**
 * Data Reader
 * 
 * Implements a process that reads a file, process it as a csv 
 * and then shows the data read in the console.
 */
import fs from 'node:fs';

type CsvRow = string[];

// Read a file and returns an array of rows
function readCSV(path: string): { header: CsvRow, rows: CsvRow[]} {
  const data = fs.readFileSync(path, 'utf8');

  // Split input file in lines
  const lines = data.trim().split('\n');
  const headerLine = <string>lines[0];
  lines.shift();

  // Split each line in fields separated by comma, and convert to array
  const header: CsvRow = headerLine.split(',');
  const rows: CsvRow[] = lines.map(line => line.split(','));

  return { header, rows };
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
const rows = readCSV(dataFile);
console.log(rows);
