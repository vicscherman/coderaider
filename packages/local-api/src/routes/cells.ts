import express from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json())

  const fullPath = path.join(dir, filename);

  //getting a list of cells
  router.get('/cells', async (req, res) => {
    try {
      // Read the file
      const result = await fs.readFile(fullPath, { encoding: 'utf-8' });
      // Parse a list of cells out of it
      // Send the list of cells back to the browser
      res.send(JSON.parse(result));
    } catch (err) {
      // If read throws error
      // Inspect the error, see if the file doesn't exist
      if (err.code === 'ENOENT') {
        //Add code to create a file and add default cells
        await fs.writeFile(fullPath, '[]', 'utf-8')
        res.send([])
      } else {
        throw err;
      }
    }
  });

  router.post('/cells', async (req, res) => {
    // Take the list of cells from the request object
    // Serialize them (turn them into a writable format)
    const { cells }: { cells: Cell[] } = req.body;
    // Write the cells into the file

    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');
    res.send({ status: 'ok' });
  });

  return router;
};
