import path from 'path';
import { Command } from 'commander';
import { serve } from '@coderaider/local-api';

const isProduction = process.env.NODE_ENV === 'production';

export const serveCommand = new Command()
  .command('serve [filename]')
  .description('Open a file for editing')
  .option('-p, --port <number>', 'port to run server on', '4005')
  .action(async (filename = 'notebook.js', options: { port: string }) => {
    try {
      const dir = path.join(process.cwd(), path.dirname(filename));
      //fourth argument set to !isproduction because we only want to use the proxy in development. In production it's set to false and not used.
      await serve(
        parseInt(options.port),
        path.basename(filename),
        dir,
        !isProduction
      );
      console.log(
        `opened ${filename}. Navigate to http://localhost:${options.port} to edit the file.`
      );
    } catch (err) {
      if (err.code === 'EADDRINUSE') {
        console.error(
          `Port ${options.port} is in use. Try running on a different port. Chain on -p <PortNumber> to specify the port.`
        );
      } else {
        console.log('Heres the error', err.message);
      }
      process.exit(1);
    }
  });
