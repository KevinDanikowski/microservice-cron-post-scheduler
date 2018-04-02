import SocialPost from './SocialPost'
import Schedule from './Schedule'

const ScheduledPost = `
type ScheduledPost {
    id: String
    socialPost: SocialPost
    schedule: Schedule
    dateToBePosted: String
    posted: Boolean
}
extend type Query {
    allScheduledPosts: [ScheduledPost]
}
extend type Mutation {
    SchedulePost (
        socialPost: String, 
        schedule: String ): ScheduledPost!
}`

export default () => [ScheduledPost, Schedule, SocialPost]
/*
{ socialPost: { id: '4', message: 'message 4', image: [Object] },
    schedule: { month: 3, date: 26, hour: '19', minute: '19' }
 */