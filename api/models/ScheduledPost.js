import SocialPost from './SocialPost'
import Schedule from './Schedule'

const ScheduledPost = `
type ScheduledPost {
    id: String
    socialPost: SocialPost
    schedule: Schedule
    dateToBePosted: String
    posted: Boolean
    canceled: Boolean
    socialProfileId: String
}
extend type Query {
    allScheduledPosts: [ScheduledPost]
}
extend type Mutation {
    SchedulePost ( 
        socialProfileId: String,
        socialPost: SocialPostInput,
        schedule: ScheduleInput
     ): ScheduledPost
}`

export default () => [ScheduledPost, Schedule, SocialPost]
/*
{ socialPost: { id: '4', message: 'message 4', image: [Object] },
    schedule: { month: 3, date: 26, hour: '19', minute: '19' }
 */
//may not need both social profile id and user id, but will need to make call to get all scheduled from social profile id