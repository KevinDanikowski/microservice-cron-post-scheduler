//dummy not used, only here so that all other types are extend mutation/query
//these mutations and queries are NOT used
const Base = `
type Query {
    unUsed: Boolean
}

type Mutation {
    unUsed: Boolean
}
`;

export default () => [Base];
