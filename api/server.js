import express from 'express';
import cors from 'cors';
import graphqlHTTP from 'express-graphql';
import ENV_FILE from './envFileConfigs'

import schema from './Schema';

const app = express();

app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(
    '/graphql',
    graphqlHTTP(request => ({
        schema: schema,
        graphiql: ENV_FILE.graphiqlOn,
    })),
);
const port = ENV_FILE.apiPort
app.listen(port);
console.log('Running a GraphQL API server at http://localhost:'+port+'/graphql');

export default app //for testing
// Exmaple from https://github.com/marmelab/GraphQL-example/tree/master/server/src
