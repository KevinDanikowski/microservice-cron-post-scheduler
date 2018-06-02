import Sequelize from 'sequelize'
import ENV_FILE from '../envFileConfigs'

/* DB NOTES AND SCHEMAS
votes of one language into anther - save success of translation 1-5
option for multiple languages, option to see what it translated it into
will need to put a throttle on translator
languages that spin it backwards
additional spinning = add thesaurus

 */
const Conn = new Sequelize(ENV_FILE.dbDatabase, ENV_FILE.dbUser, ENV_FILE.dbPassword, {
    host: ENV_FILE.dbHost,
    dialect: 'mysql',
    port: 3306,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
})
const Schedule = Conn.define('schedule',{
    month: { type: Sequelize.INTEGER },
    date: { type: Sequelize.INTEGER },
    hour: { type: Sequelize.INTEGER },
    minute: { type: Sequelize.INTEGER },
})
const SocialPost = Conn.define('socialPost',{
    message: { type: Sequelize.STRING },
})
const Image = Conn.define('image',{
    url: { type: Sequelize.STRING }
})
const ScheduledPost = Conn.define('scheduledPost',{
    posted: { type: Sequelize.BOOLEAN, defaultValue: false },
    canceled: { type: Sequelize.BOOLEAN, defaultValue: false },
    socialProfileId: { type: Sequelize.STRING },
    dateToBePosted: { type: Sequelize.STRING },
    error: { type: Sequelize.STRING, defaultValue: null }
})

/*   Relations   */
ScheduledPost.hasOne(Schedule)
Schedule.belongsTo(ScheduledPost)
ScheduledPost.hasOne(SocialPost)
SocialPost.belongsTo(ScheduledPost)
SocialPost.hasOne(Image)
Image.belongsTo(SocialPost)

/* add sample data */
// only add data once, this destoys the data tables and makes new ones with the data
/*
const sampleScheduledPostsData = [
    {
        schedule: {
            month: 1,
            date: 1,
            hour: 1,
            minute: 1
        },
        socialPost: {
            GCID: '12345',
            message: 'message 1',
            image: {
                url: 'url.com'
            }
        },
        socialProfileId: '1234'
    },
    {
        schedule: {
            month: 2,
            date: 2,
            hour: 2,
            minute: 2
        },
        socialPost: {
            GCID: '12345',
            message: 'message 2',
            image: {
                url: 'url2.com'
            }
        },
        socialProfileId: '1234'
    },
    {
        schedule: {
            month: 3,
            date: 3,
            hour: 3,
            minute: 3
        },
        socialPost: {
            GCID: '12345',
            message: 'message 3',
            image: {
                url: 'url3.com'
            }
        },
        socialProfileId: '1234'
    }
]
Conn.sync({force: true}).then(()=>{ //forces tables to be overwritten
    sampleScheduledPostsData.map(scheduledPost => {
        return ScheduledPost.create().then(scheduledPostReturn => {
            const schedule = scheduledPost.schedule
            const socialPost = scheduledPost.socialPost
            return scheduledPostReturn.createSchedule({
                month: schedule.month,
                date: schedule.date,
                hour: schedule.hour,
                minute: schedule.minute
            }).then(scheduleReturn => {
                return scheduledPostReturn.createSocialPost({
                    GCID: socialPost.GCID,
                    message: socialPost.message,
                }).then(socialPostReturn => {
                    return socialPostReturn.createImage({
                        url: socialPost.image.url
                    })
                })
            })
        })
    })
})
*/


export default Conn
