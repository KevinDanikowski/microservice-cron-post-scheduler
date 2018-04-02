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
const Rating = Conn.define('rating',{
    rating: {
        type: Sequelize.INTEGER
    },
    wordCount: {
        type: Sequelize.INTEGER
    }
})
const LanguageCombination = Conn.define('languageCombination',{
    processingLanguages: {
        type: Sequelize.STRING, //DOESN'T WORK
        get: function(){
            return JSON.parse(this.getDataValue('processingLanguages'))
        },
        set: function(val){
          const stringifiedArray = JSON.stringify(val) //removes spaces and uses only " not '
          this.setDataValue('processingLanguages', stringifiedArray)
        },
    },
    language: {
        type: Sequelize.STRING
    },
    translator: {
        type: Sequelize.STRING
    },
})

/*   Relations   */
LanguageCombination.hasMany(Rating)
Rating.belongsTo(LanguageCombination)

/* add sample data */
// only add data once, this destoys the data tables and makes new ones with the data
/*
const sampleLanguageCombinationData = [
    {
        processingLanguages: ['es','pl','nl'],
        language: 'en',
        translator: 'google',
        ratings: [{rating: 3, wordCount: 36}, {rating: 2, wordCount: 253}]
    },{
        processingLanguages: ['es','pl'],
        language: 'en',
        translator: 'google',
        ratings: [{rating: 5, wordCount: 15}, {rating: 4, wordCount: 117}]
    },{
        processingLanguages: ['es'],
        language: 'en',
        translator: 'google',
        ratings:[{rating: 1, wordCount: 15}]
    }
]
Conn.sync({force: true}).then(()=>{ //forces tables to be overwritten
  sampleLanguageCombinationData.map(languageCombination => {
        console.log('going to create languageCombination ', languageCombination)
        return LanguageCombination.create({
          processingLanguages: languageCombination.processingLanguages,
          language: languageCombination.language,
          translator: languageCombination.translator
        }).then(languageCombinationReturn => {
            return languageCombination.ratings.map(rating=>{
                languageCombinationReturn.createRating({
                    rating: rating.rating,
                    wordCount: rating.wordCount
                })
            })
        })
    })
})
*/


export default Conn
