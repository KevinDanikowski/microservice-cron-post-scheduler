import Rating from './Rating'

const LanguageCombination = `
type LanguageCombination {
    id: ID!
    processingLanguages: [String]
    language: String
    translator: String
    ratings: [Rating]
    ratingCount: Int
    avgRating: String
}
extend type Query {
    LanguageCombinations: [LanguageCombination]  
}`

export default () => [LanguageCombination, Rating]
