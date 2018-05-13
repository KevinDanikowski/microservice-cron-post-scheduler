require('dotenv').config({path: '.env'})

const ENV_FILE = {
    apiPort: process.env.API_PORT || 3334,
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbDatabase: process.env.DB_DATABASE,
    graphCoolProjectId: process.env.GRAPHCOOL_PROJECT_ID,
    graphiqlOn: process.env.GRAPHIQL_ON  || true
}

export default ENV_FILE
