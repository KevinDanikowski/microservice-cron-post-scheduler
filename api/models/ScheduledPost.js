import SocialPost from './SocialPost'
import Schedule from './Schedule'

const ScheduledPost = `
type ScheduledPost {
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
        socialPost: SocialPost, 
        schedule: Schedule ): ScheduledPost!
}`

export default () => [ScheduledPost, Schedule, SocialPost]
/*
{ socialPost: { id: '4', message: 'message 4', image: [Object] },
    schedule: { month: 3, date: 26, hour: '19', minute: '19' }
 */