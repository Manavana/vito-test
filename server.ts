const express = require('express');
const app = express();

const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema.ts');

let port = 3000;


app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

app.listen(port, () => {
    console.log(`Running a GraphQL API server at localhost:${port}`);
});