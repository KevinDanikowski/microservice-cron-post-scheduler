import db from './models/db'
import axios from 'axios'
import ENV_FILE from './envFileConfigs'

const GRAPHCOOL_PROJECT_ID = ENV_FILE.graphCoolProjectId
const GraphQLEndPoint = 'https://api.graph.cool/simple/v1/' + GRAPHCOOL_PROJECT_ID

const getSocialProfileInformation = (socialProfileId) => {
    return new Promise((resolve, reject)=> {
        const query = `query socialProfileQuery($socialProfileId: ID){
        SocialProfile(id: $socialProfileId){
            id user {id}
            postingPlatform {id platform iftttKey iftttEventName zapierUrl} 
        }}`
        axios.post(GraphQLEndPoint, {
            query: query,
            variables: {
                socialProfileId: socialProfileId
            }
        }).then(function ({data}) {
            if (data.error) {
                console.log('couldnt get profile with id ' + socialProfileId, data.error)
                resolve({okToPost: false})
            } else {
                const GraphQLData = data.data
                const okToPost = GraphQLData.SocialProfile !== null && GraphQLData.SocialProfile.postingPlatform
                const postingPlatform = GraphQLData.SocialProfile.postingPlatform || {}
                resolve({
                    okToPost: okToPost,
                    postingPlatform: postingPlatform,
                    userId: GraphQLData.SocialProfile.user.id
                })
            }
        }).catch(error =>{
            console.log('post call failure')
            resolve({okToPost: false})
        })
    })
}
const getImage = (postingPlatform, socialPost) => {
    //todo check there is an image at the url
    const platform = postingPlatform.platform
    if (!socialPost.image.url ||
        platform !== 'FACEBOOK_API' ||
        platform !== 'TWITTER_API' ||
        platform !== 'LINKEDIN_API') {
            return {imageStream: null} //returns null so doesn't upload via stream
    } else {
        return new Promise((resolve, reject) => {
            //need to be able to use stream for this to work
            resolve({imageStream: null})
        })
    }
}
const sendPost = (postingPlatform, imageStream, socialPost) => {
    const platform = postingPlatform.platform
    if (imageStream !== null){
        return new Promise((resolve, reject)=>{
            console.log('image stream')
            //upload with stream once able
            resolve({successfullyPosted: false})
        })
    }
    return new Promise((resolve, reject)=>{
        if(platform === 'IFTTT'){
            const iftttEventName = postingPlatform.iftttEventName || ''
            const iftttKey = postingPlatform.iftttKey || ''
            const iftttUrl = 'https://maker.ifttt.com/trigger/'+iftttEventName+'/with/key/'+iftttKey
            const message = socialPost.message
            const photoUrl = socialPost.image.url || null
            const postLink = socialPost.link || null
            axios.post(iftttUrl, {
                value1: message,
                value2: photoUrl,
                value3: postLink//link if link post todo add link to message
                //todo recommend to send to buffer, they can only schedule 10 posts, will upload image directly
            }).then(response=>{
                if(response.status === 200) {
                    console.log('posted to IFTTT')
                    resolve({successfullyPosted: true})
                } else {
                    console.log('ifttt response not 200')
                    resolve({successfullyPosted: false})
                }
            }).catch(err => {
                console.log('failed to post to IFTTT')
                resolve({successfullyPosted: false})
            })
        }
        else if(platform==='ZAPIER'){
            const sampleZapierUrl = 'https://hooks.zapier.com/hooks/catch/2429269/kj15cb/'
        } else {
            console.log('about to resolve wrong')
            resolve({successfullyPosted: false})
        }
    })
}
const updateDB = (successfullyPosted, scheduledPostId, socialPost) => {
    return db.models.scheduledPost.update(
            { posted: true },
            { where: { id: scheduledPostId } }
        ).then(id=>{
            return new Promise((resolve, reject)=> {
                // tell graphcool database
                const date = new Date().toISOString()
                const mutation = `mutation UpdateSocialPost($socialPostId: ID!, $lastPosted: DateTime, $lastMessage: String){
                    updateSocialPost(id: $socialPostId, lastPosted: $lastPosted, lastMessage: $lastMessage){
                        id lastPosted lastMessage
                    }}`
                axios.post(GraphQLEndPoint, {
                    query: mutation,
                    variables: {
                        socialPostId: socialPost.GCID,
                        lastPosted: date,
                        lastMessage: socialPost.message
                    }
                }).then(function ({data}) {
                    if (data.error) console.log('failed to update post', data.error)
                    else console.log('updated Graphcool social post');
                    resolve()
                }).catch(error=>{
                    console.log('post call error')
                    resolve()
                })
            })
        })
}
const sendErrorToGraphCool = (errorMessage, socialPost, schedule, userId) => {
    return new Promise((resolve, reject)=> {
        // tell graphcool database
        const mutation = `mutation CreateUserNotification($userId: ID, $message: String, $stringifiedObjects: String){
            createUserNotification(userId: $userId, message: $message, stringifiedObjects: $stringifiedObjects){
                id message stringifiedObjects
            }}`
        const objects = {
            socialPost: socialPost,
            schedule: schedule
        }
        const stringifiedObjects = JSON.stringify(objects)
        console.log(typeof stringifiedObjects, stringifiedObjects, errorMessage, userId )
        axios.post(GraphQLEndPoint, {
            query: mutation,
            variables: {
                userId: userId,
                message: errorMessage,
                stringifiedObjects: stringifiedObjects
            }
        }).then(function ({data}) {
            if (data.error) console.log('failed to createUserNotification, see errors: ', data.error)
            //data is data.data.createUserNotification
            else console.log('created user notification');
            resolve()
        }).catch(error => {
            console.log('post call error')
        })
    })
}
export const postToSocialProfile = async (scheduledPostId, socialProfileId, socialPost, schedule) => {
    const {okToPost, postingPlatform, userId} = await getSocialProfileInformation(socialProfileId)
    if (okToPost) {
        const { imageStream } = await getImage(postingPlatform, socialPost) //returns null depending on platform and such
        const { successfullyPosted } = await sendPost(postingPlatform, imageStream, socialPost)
        if (successfullyPosted) await updateDB(successfullyPosted, scheduledPostId, socialPost)//todo don't forget ! off
        else await sendErrorToGraphCool('Failed to post', socialPost, schedule, userId)
    }
    if (!okToPost) {
        const err = 'Failed to fetch social profile or social profile doesn\'t have a posting platform'
        await sendErrorToGraphCool(err, socialPost, schedule, userId)
    }
    console.log('finished')
}
