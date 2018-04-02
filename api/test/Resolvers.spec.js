import { graphql } from 'graphql';
import schema from '../Schema';

describe('Resolver File', ()=> {
    describe('rewrite', () => {
        it('should return a rewrite',()=> {
            const newRewrite = {
                text: 'rewrite this text in english with some additional changes',
                language: 'en',
                processingLanguages: ['es', 'pl'],
                translator: 'google',
                thesaurus: true,
                autocorrect: false
            }
            const createRewrite = `mutation {rewrite(` +
                `text: \"${newRewrite.text}\",` +
                `language: \"${newRewrite.language}\",` +
                `processingLanguages: ${JSON.stringify(newRewrite.processingLanguages)},` +
                `translator: \"${newRewrite.translator}\",`+
                `autocorrect: ${newRewrite.autocorrect},`+
                `thesaurus: ${newRewrite.thesaurus}`+
                `){rewrite}}`
            console.log('mutation is', createRewrite)
            return graphql(schema, createRewrite).then(results => {
                const newRewriteResponse = results.data.rewrite;
                expect(newRewriteResponse).to.exist;
                expect(newRewriteResponse).to.have.property('rewrite').and.be.a('string')
            })
        })
    })
    describe('Language Combinations', () => {
        it('should query all with args', () => {
            const languageCombinationsQuery = '{LanguageCombinations { id processingLanguages language translator avgRating ratingCount }}'
            return graphql(schema, languageCombinationsQuery).then(results => {
                const languageCombinations = results.data.LanguageCombinations
                const firstLanguageCombination = languageCombinations[0]
                expect(languageCombinations).to.not.be.empty;
                expect(firstLanguageCombination).to.have.property('id').and.be.a('string')
                expect(firstLanguageCombination).to.have.property('language').and.be.a('string')
                expect(firstLanguageCombination).to.have.property('translator').and.be.a('string')
                expect(firstLanguageCombination).to.have.property('avgRating').and.be.a('string')
                expect(firstLanguageCombination).to.have.property('ratingCount').and.be.a('number')
                expect(firstLanguageCombination).to.have.property('processingLanguages').and.be.an('array').and.not.be.empty;
            })
        })
        /* QUERY FOR RATINGS {VARIABLES} ON LANGUAGECOMBINATION, currently doesn't work ***
        it('should have Ratings with args', () => {
        const languageCombinationsQuery = '{LanguageCombinations { id ratings {id}}'
            return graphql(schema, languageCombinationsQuery).then(results => {
                const firstLanguageCombination = results.data.LanguageCombinationsQuery[0]
                expect(firstLanguageCombination).to.have.property('ratings').and.be.an('array').and.not.be.null;
                expect(firstLanguageCombination.ratings[0]).to.have.property('id').and.be.a('string')
                expect(firstLanguageCombination.ratings[0]).to.have.property('languageCombinationId').and.be.a('string')
                expect(firstLanguageCombination.ratings[0]).to.have.property('rating').and.be.a('number')
                expect(firstLanguageCombination.ratings[0]).to.have.property('wordCount').and.be.a('number')
            })
        })
        */
    })
    describe('ratings', () => {
        // it(' rateRewrite should add rating to language combination', () => {
        // const newRating = {rating: 3, language: 'en', processingLanguages: ['es', 'pl'], translator: 'google', wordCount: 349}
        // const createRatingMutation = `mutation {rateRewrite(`+
        //         `rating: ${newRating.rating},`+
        //         `language: \"${newRating.language}\",`+
        //         `processingLanguages: ${newRating.processingLanguages},`+
        //         `translator: \"${newRating.translator}\",`+
        //         `wordCount: ${newRating.wordCount}){`+
        //             `id languageCombinationId rating wordCount}}`
        // return graphql(schema, createRatingMutation).then(results => {
        //     const newRatingResponse = results.data.rateRewrite;
        //     expect(newRatingResponse).to.exist;
        //     expect(newRatingResponse).to.have.property('id')
        //     expect(newRatingResponse).to.have.property('languageCombinationId').and.be.a('string')
        //     expect(newRatingResponse).to.have.property('rating').and.equal(newRating.rating)
        //     expect(newRatingResponse).to.have.property('rating').and.equal(newRating.rating)
        // })
    })
})

// Casual Data Generator https://github.com/boo1ean/casual
