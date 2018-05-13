import { makeExecutableSchema } from 'graphql-tools';
import Base from './models/Base'
import ScheduledPost from './models/ScheduledPost'
import SocialPost from './models/SocialPost'
import Schedule from './models/Schedule'
import resolvers from './Resolvers';

export default makeExecutableSchema({
    typeDefs: [Base, ScheduledPost, SocialPost, Schedule],
    resolvers,
});
