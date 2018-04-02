import ENV_FILE from '../envFileConfigs'
import server from '../server'


describe('Server', () => {
    it('should have GraphIQL if turned on', ()=>{
        if(ENV_FILE.graphiqlOn) { //fails because gets 400 when should get 201
            return request(server)
                .get('/graphql')
                // .end((err, res)=>{
                //     console.log(res.response)
                //     res.to.have.status(201)
                // }) //WORKED WHEN USED THE .END FUNCTIONALITY https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai
                .then(res => {
                       expect(res).to.have.status(200)
                    })
        } else {
            return request(server)
                .get('/graphql')
                .then(res => {
                    expect(res).to.have.status(400)
                })
        }
    })
})
//graphql-tools moch testing https://github.com/apollographql/graphql-tools/blob/master/src/test/testMocking.ts
