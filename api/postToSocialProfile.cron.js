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
            postingPlatform {id platform iftttUrl zapierUrl} } 
        }`
        axios.post(GraphQLEndPoint, {
            query: query,
            variables: {
                socialProfileId: socialProfileId
            }
        }).then(function ({data}) {
            if (data.errors) console.log(data.errors)
            else {
                const GraphQLData = data.data
                const okToPost = GraphQLData.SocialProfile !== null
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
    const platform = postingPlatform.platform
    if (!socialPost.image.url ||
        platform !== 'FACEBOOK_API' ||
        platform !== 'TWITTER_API' ||
        platform !== 'LINKEDIN_API') {
            return {imageStream: null}
    } else {
        return new Promise((resolve, reject) => {
            //todo get image
            resolve({imageStream: ''})
        })
    }
}
const sendPost = (postingPlatform, imageStream, socialPost) => {
    const platform = postingPlatform.platform
    if (imageStream !== null){
        return new Promise((resolve, reject)=>{
            //upload with stream
            resolve()
        })
    }
    return new Promise((resolve, reject)=>{
        if(platform === 'IFTTT'){
            //post via axios, add image url, message, and data to say what to do with it
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
                    resolve()
                })
            })
        })
    })
}
export const postToSocialProfile = async (scheduledPostId, socialProfileId, socialPost) => {
    const {okToPost, postingPlatform} = await getSocialProfileInformation(socialProfileId)
    console.log(okToPost, postingPlatform)
    if (okToPost) {
        const {imageStream} = await getImage(postingPlatform, socialPost)//todo get image streem if image
        await sendPost(postingPlatform, imageStream, socialPost)
        await updateDB(scheduledPostId)
    }
}