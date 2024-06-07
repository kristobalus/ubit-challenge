import cors from 'cors';
import express from 'express';
import { faker } from '@faker-js/faker';

import companies from './data/companies.json';
import { SpellingService } from "./spelling-service";

const spellingService = new SpellingService(companies)
const COINS = [
  'btc',
  'eth',
  'ada',
  'bnb',
  'trx',
  'doge',
  'dot',
  'eos',
];

const app = express();
const port = 3001;

app.use(cors());

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/companies', async (req, res) => {
  const searchQuery = req.query.query as string | undefined;
  // const filteredCompanies = companies.filter((company) =>
  //   searchQuery ? company.name.toLowerCase().includes(searchQuery.toLowerCase()) : true,
  // );
  const filteredCompanies = searchQuery ? await spellingService.search(searchQuery) : companies

  res.send(filteredCompanies);
});

app.get('/companies/random', (_req, res) => {
  const randomCompanies = Array(100)
    .fill(undefined)
    .map((_, index) => {
      const id = index + 1;

      return {
        id,
        name: faker.company.name(),
        logoUrl: `https://picsum.photos/seed/ubit-${id}/200`,
        coins: faker.helpers.arrayElements(
          COINS,
          faker.datatype.number({ min: 1, max: 4 }),
        ),
      };
    });

  res.send(randomCompanies);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on port ${port}`);
});
