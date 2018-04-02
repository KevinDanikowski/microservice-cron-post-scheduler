import { find, filter } from 'lodash'
import db from './models/db'

export default {
    Query: {
        allScheduledPosts: () => {
            return db.models.scheduledPost.findAll({
                include: [{model: db.models.schedule},{model: db.models.socialPost}]
            }).then(scheduledPosts => {
                return scheduledPosts.map(scheduledPost=>{
                    return Object.assign({},
                        {
                            id: scheduledPost.id,
                            dateToBePosted: scheduledPost.dateToBePosted,
                            posted: scheduledPost.posted,
                            socialPost: Object.assign({},
                                    {
                                        id: scheduledPost.socialPost.id,
                                        GCID: scheduledPost.socialPost.GCID,
                                        message: scheduledPost.socialPost.message,
                                        image: {}
                                    }),
                            schedule: Object.assign({},
                                {
                                    month: scheduledPost.schedule.month,
                                    date: scheduledPost.schedule.date,
                                    hour: scheduledPost.schedule.hour,
                                    minute: scheduledPost.schedule.minute
                                })
                        })
                })
        })
    },
    Mutation: {
        SchedulePost: async (_, data) => {
            return new Promise((resolve, reject) => {
                resolve(Object.assign({},
                    {
                        socialPost: {},
                        schedule: {},
                        dateToBePosted: '',
                        posted: false
                    }))
            })
        }
    }
};
