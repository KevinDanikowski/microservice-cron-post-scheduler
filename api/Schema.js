import { makeExecutableSchema } from 'graphql-tools';
import Base from './models/Base'
import Rating from './models/Rating';
import Rewrite from './models/Rewrite';
import LanguageCombination from './models/LanguageCombination'
import resolvers from './Resolvers';

export default makeExecutableSchema({
    typeDefs: [Base, Rating, Rewrite, LanguageCombination],
    resolvers,
    //logger: { log: e => console.log(e) },
});
