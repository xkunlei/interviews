import express, { Express, Request, Response } from 'express';
import { detectPatterns, initRareIdSetDict } from "./RareId";

const app: Express = express();
const port = 8088;

app.get('/', (req: Request, res: Response) => {
  const { query } = req;
  const patterns = detectPatterns(query.name as any);
  const result = JSON.stringify([...patterns]);
  res.send(result);
});

app.listen(port, async () => {
  await initRareIdSetDict();
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});