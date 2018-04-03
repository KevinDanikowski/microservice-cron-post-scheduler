import db from './models/db'
import axios from 'axios'
import ENV_FILE from './envFileConfigs'

const GRAPHCOOL_PROJECT_ID = ENV_FILE.graphCoolProjectId

const getSocialProfileInformation = (socialProfileId) => {
    const image = {}
    const testId = 'cjarh57w039af0145mzoj1wm9'
    const GraphQLEndPoint ='https://api.graph.cool/simple/v1/'+GRAPHCOOL_PROJECT_ID

    const query = `query socialProfileQuery($socialProfileId: ID){
        SocialProfile(id: $socialProfileId){
            id 
            postingPlatform {id} } 
        }`
    axios.post(GraphQLEndPoint, {
        query: query,
        variables: {
            socialProfileId: socialProfileId
        }
    }).then(function({data}) {
        if(data.errors) console.log(data.errors)
        else {
            const GraphQLData = data.data
            console.log(GraphQLData)
            const stillPosting = GraphQLData.SocialProfile !== null //todo check if profile exists
            const postingPlatform =  GraphQLData.SocialProfile.postingPlatform || {}
            return {
                stillPosting: stillPosting,
                postingPlatform:postingPlatform
            }
        }
    })
}
const getImage = (imageUrl) => {

}
const sendPost = (postingPlatform) => {

}
const updateDB = (scheduledPostId) => {

}
export const postToSocialProfile = async (scheduledPostId, socialProfileId, socialPost) => {
    const {stillPosting, postingPlatform} = await getSocialProfileInformation(socialProfileId)
    if (stillPosting) {
        const {imageStream} = await getImage(socialPost.image.url)
        await sendPost(postingPlatform, )
        await updateDB(scheduledPostId)
    }
}