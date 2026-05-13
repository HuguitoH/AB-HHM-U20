import { createInterface, emitKeypressEvents } from 'node:readline';

/**
 * Prompts the user to select the report mode interactively.
 * Validates input and re-prompts on invalid selection.
 * @returns 'all' or 'no-highway' based on user selection
 */
export async function selectReportMode(): Promise<'all' | 'no-highway'> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    const ask = () => {
      console.log('  Report mode:');
      console.log('  [1] All stations (includes highways)');
      console.log('  [2] Exclude highway stations');
      console.log('');

      rl.question('  Select [1/2]: ', answer => {
        const input = answer.trim();

        if (input === '1') {
          rl.close();
          resolve('all');
        } else if (input === '2') {
          rl.close();
          resolve('no-highway');
        } else {
          console.log('\n  Invalid option. Please enter 1 or 2.\n');
          ask();
        }
      });
    };

    ask();
  });
}

/**
 * Displays report pages one at a time with keyboard navigation.
 * ENTER/→ = next page, B/← = previous page, Q/Ctrl+C = quit.
 * @param pages - Array of formatted page strings to display
 */
export async function paginateReport(pages: string[]): Promise<void> {
  if (pages.length === 0) return;

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);

  let current = 0;

  const showPage = () => {
    console.clear();
    console.log(pages[current]);
    console.log('');
    console.log(`  Page ${current + 1}/${pages.length}`);
    console.log('  [ENTER] next   [B] back   [Q] quit');
  };

  showPage();

  return new Promise(resolve => {
    process.stdin.on('keypress', (_, key) => {
      if (!key) return;

      if (key.name === 'return' || key.name === 'right') {
        if (current < pages.length - 1) {
          current++;
          showPage();
        } else {
          cleanup();
          resolve();
        }
      } else if (key.name === 'b' || key.name === 'left') {
        if (current > 0) {
          current--;
          showPage();
        }
      } else if (key.name === 'q' || (key.ctrl && key.name === 'c')) {
        cleanup();
        resolve();
      }
    });

    function cleanup() {
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
      process.stdin.removeAllListeners('keypress');
      rl.close();
    }
  });
}
