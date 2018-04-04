import { find, filter } from 'lodash'
import db from './models/db'
import cron from 'cron'
import { postToSocialProfile } from './postToSocialProfile.cron'

const timeZone = 'America/Chicago'

export default {
    Query: {
        allScheduledPosts: () => {
            return db.models.scheduledPost.findAll({
                include: [{
                    model: db.models.schedule
                }, {
                    model: db.models.socialPost,
                    include: [{model: db.models.image}]
                }]
            }).then(scheduledPosts => {
                return scheduledPosts.map(scheduledPost => {
                    return Object.assign({},
                        {
                            id: scheduledPost.id,
                            dateToBePosted: scheduledPost.dateToBePosted,
                            posted: scheduledPost.posted,
                            canceled: scheduledPost.canceled,
                            socialProfileId: scheduledPost.socialProfileId,
                            socialPost: Object.assign({},
                                {
                                    id: scheduledPost.socialPost.id,
                                    GCID: scheduledPost.socialPost.GCID,
                                    message: scheduledPost.socialPost.message,
                                    image: Object.assign({},{
                                        url: scheduledPost.socialPost.image.url
                                    })
                                }),
                            schedule: Object.assign({},
                                {
                                    id: scheduledPost.schedule.id,
                                    month: scheduledPost.schedule.month,
                                    date: scheduledPost.schedule.date,
                                    hour: scheduledPost.schedule.hour,
                                    minute: scheduledPost.schedule.minute
                                })
                        })
                })
            })
        }
    },
    Mutation: {
        SchedulePost: async (_, data) => {
            //todo send post ID and social profile ID in what is sent from main app
            //todo fix settings page on main app
            const sched = data.schedule
            const post = data.socialPost
            const socialProfileId = data.socialProfileId
            const fakeScheduledPostId = '12342321'
            //TODO MAKE THE SCHEDULED POST
            const cronTime = (true)? '* * * * * *' : //todo take true off when done
                sched.minute.toString()+' '+
                sched.hour.toString()+' '+
                sched.date.toString()+' '+
                sched.month.toString()+' '+
                '* *' // day of week, year todo need to add year value so wont repeat
            // const schedulePost = new cron.CronJob({
            //     cronTime: cronTime,
            //     onTick: ()=>console.log('tick!'),
            //     start: true,
            //     timeZone: timeZone
            // })
            postToSocialProfile(fakeScheduledPostId, socialProfileId, post, sched)
            return new Promise((resolve, reject) => {
                resolve(Object.assign({},
                    {
                        socialPost: post,
                        schedule: sched,
                        dateToBePosted: '',
                        posted: false
                    }))
            })
        }
    }
};
