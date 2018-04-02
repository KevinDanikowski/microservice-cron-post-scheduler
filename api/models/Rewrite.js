const Rewrite = `
type Rewrite {
    language: String
    processingLanguages: [String]
    text: String
    rewrite: String
    autocorrect: Boolean
    thesaurus: Boolean
    translator: String
}
extend type Mutation {
    rewrite (text: String!, 
        language: String, 
        processingLanguages: [String],
        autocorrect: Boolean,
        thesaurus: Boolean,
        translator: String ): Rewrite!
}`

export default () => [Rewrite]
