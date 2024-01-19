'use strict';
import express from 'express';
import cors from 'cors';
import { NodejsClient } from 'contensis-management-api/lib/client/nodejs-client.js';

// Set some variables.
const port = 3001;
const ROOT_URL = `https://cms-chesheast.cloud.contensis.com/`;
const PROJECT = website;
const pwd = process.env.pwd
//import {} from 'dotenv/config';

const client = NodejsClient.create({
  clientType: 'client_credentials',
  clientDetails: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
  projectId: PROJECT,
  rootUrl: ROOT_URL,
});

//Log all the env vars
let env = [];
Object.keys(process.env).forEach(k => env.push(`${k}: ${process.env[k]}`));
env.sort();
env.forEach(e => console.log(e));

// Start the server.
const app = express();
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});

// Log all requests to the server
const myLogger = function (req, _, next) {
  console.log(`Incoming: ${req.url}`);
  next();
};

// Middleware
app.use(express.json());
//app.use(express.static('public'));
app.use(cors());
app.use(myLogger);

// Routes
app.get('/:id', (req, res) => {
  if (req.params.id === pwd) {
    client.entries
      .list({
        contentTypeId: 'ceciliaLogsRaw2',
        versionStatus: 'latest',
        pageOptions: {
          pageSize: 5000,
        },
      })
      .then((result) => {
        res.json(result);
        return;
      })
      .catch((error) => {
        console.log('API call fetch error: ', error);
        res.status(400).send('Something went wrong');
      });
  } else {
    res.status(400).send('Something went wrong');
  }
});

