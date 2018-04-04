import db from './models/db'
import axios from 'axios'
import ENV_FILE from './envFileConfigs'

const GRAPHCOOL_PROJECT_ID = ENV_FILE.graphCoolProjectId
const GraphQLEndPoint = 'https://api.graph.cool/simple/v1/' + GRAPHCOOL_PROJECT_ID

const getSocialProfileInformation = (socialProfileId) => {
    return new Promise((resolve, reject)=> {
        const query = `query socialProfileQuery($socialProfileId: ID){
        SocialProfile(id: $socialProfileId){
            id 
            postingPlatform {id platform iftttKey iftttEventName zapierUrl} } 
        }`
        axios.post(GraphQLEndPoint, {
            query: query,
            variables: {
                socialProfileId: socialProfileId
            }
        }).then(function ({data}) {
            if (data.errors) console.log('couldnt get profile with id '+socialProfileId, data.errors)
            else {
                const GraphQLData = data.data
                const okToPost = GraphQLData.SocialProfile !== null && GraphQLData.SocialProfile.postingPlatform
                const postingPlatform = GraphQLData.SocialProfile.postingPlatform || {}
                resolve({
                    okToPost: okToPost,
                    postingPlatform: postingPlatform
                })
            }
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
            console.log('tried to get stream for image')
            //need to be able to use stream for this to work
            resolve({imageStream: null})
        })
    }
}
const sendPost = (postingPlatform, imageStream, socialPost) => {
    const platform = postingPlatform.platform
    if (imageStream !== null){
        return new Promise((resolve, reject)=>{
            //upload with stream once able
            resolve()
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
                    resolve({successfullyPosted: true})
                } else {
                    resolve({successfullyPosted: false})
                }
            })
        }
        if(platform==='ZAPIER'){
            const sampleZapierUrl = 'https://hooks.zapier.com/hooks/catch/2429269/kj15cb/'
        }

        console.log(postingPlatform)
        resolve()
    })
}
const updateDB = (scheduledPostId, socialPost) => {
    return new Promise((resolve, reject)=>{
        db.models.scheduledPost.update(
            { posted: true },
            { where: { id: scheduledPostId } }
        ).then(id=>{
            return new Promise((resolve, reject)=> {
                // tell graphcool database
                const date = Date.now()
                const mutation = `mutation UpdateSocialPost($socialPostId: ID, $lastPosted: String, $lastMessage: String){
                    updateSocialPost(id: $socialPostId, lastPosted: $lastPosted, lastMessage: $lastMessage){
                        id lastPosted lastMessage
                    }`
                axios.post(GraphQLEndPoint, {
                    query: mutation,
                    variables: {
                        socialPostId: socialPost.GCID,
                        lastPosted: date,
                        lastMessage: socialPost.message
                    }
                }).then(function ({data}) {
                    if (data.errors) console.log(data.errors)
                    console.log('graph cool data', data.data)
                    resolve()
                })
            })
        })
    })
}
const sendErrorToGraphCool = (errorMessage, socialPost, schedule) => {
    //will need to add notifications
    console.log('unsuccessful posting')
}
export const postToSocialProfile = async (scheduledPostId, socialProfileId, socialPost, schedule) => {
    const {okToPost, postingPlatform} = await getSocialProfileInformation(socialProfileId)
    if (okToPost) {
        const { imageStream } = await getImage(postingPlatform, socialPost) //returns null depending on platform and such
        const { successfullyPosted } = await sendPost(postingPlatform, imageStream, socialPost)
        if (successfullyPosted) await updateDB(successfullyPosted, scheduledPostId)
        else await sendErrorToGraphCool('Failed to post', socialPost, schedule)
    } else {
        const err = 'Failed to fetch social profile or social profile doesn\'t have a posting platform'
        await sendErrorToGraphCool(err, socialPost, schedule)
    }
}
