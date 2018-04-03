const axios = require('axios')

const query = `query socialProfileQuery($socialProfileId: ID){
        SocialProfile(id: $socialProfileId){
            id} 
        }`
const GraphQLEndPoint ='https://api.graph.cool/simple/v1/cj8adz6qz09jy0105s1gkdpoy'

axios.post(GraphQLEndPoint, {
    query: query,
    variables: {
        socialProfileId: 'cjarh57w039af0145mzoj1wm'
    }
}).then(function({data}) {
    if(data.errors) console.log(data.errors)
    else {
        var socialProfile = data.data.SocialProfile
        console.log(socialProfile)
    }
})