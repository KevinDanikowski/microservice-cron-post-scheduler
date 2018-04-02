import React, { Component } from 'react';
import {graphql, compose} from 'react-apollo'
import gql from 'graphql-tag'
import { languages } from "../constants";
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faTimes, faAngleDoubleRight, faCheck, faAngleDown, faStar } from '@fortawesome/fontawesome-free-solid'

const defaultAddedLanguage = 'es'

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            language: 'en',
            processingLanguages: ['es'],
            lastCalledLanguage: '',
            lastProcessedLanguages: '',
            loading: false,
            rated: false,
            text: '',
            rewrite: '',
            autocorrect: false,
            thesaurus: false,
            translator: 'google'
        }
    }

    render() {
        const LanguageSelectorMap = () => {
            const LanguageOptionsMap = () => languages.map(language=>{
                return <option key={language.symbol} value={language.symbol}>{language.language}</option>
            })

            //map options of languages here up to 5
            const updateProcessingLanguages = (newLanguage, index) => {
                const processingLanguages = this.state.processingLanguages
                processingLanguages[index] = newLanguage
                this.setState({processingLanguages: processingLanguages})
                console.log(processingLanguages)
            }
            return this.state.processingLanguages.map((language, index)=> {
                return(
                    <div key={index} className='flex flex-column'>
                        <div className='flex justify-around'>
                            {(index !== 0) ? <FontAwesomeIcon icon={faAngleDown}/> : null}
                            {(index !== 0) ? <FontAwesomeIcon icon={faAngleDown}/> : null}
                            {(index !== 0) ? <FontAwesomeIcon icon={faAngleDown}/> : null}
                        </div>
                        <div className='flex mt1 mb1 ' >
                            <select className='form-control' value={this.state.processingLanguages[index]} onChange={(e) => updateProcessingLanguages(e.target.value, index)}>
                                <LanguageOptionsMap/>
                            </select>
                            {(index !== 0) ? <div className='btn btn-danger ml1' onClick={()=>this._removeProcessingLanguage(index)}><FontAwesomeIcon icon={faTimes}/></div> : null}
                        </div>
                    </div>
                )
            })
        }
        const LanguageCombinationsMap = () => {
            if (this.props.languageCombinationsQuery &&
                !this.props.languageCombinationsQuery.loading &&
                !this.props.languageCombinationsQuery.error){
                return this.props.languageCombinationsQuery.LanguageCombinations.map((languageCombination,index)=>{
                    //mapping languageCombinations
                    const languageIndex = languages.map(language=>language.symbol).indexOf(languageCombination.language)
                    const languageStartEnd = languages[languageIndex].language
                    const ProcessingLanguageMap = () => {
                        //mapping processingLanguages
                        return languageCombination.processingLanguages.map((processingLanguage, index) => {
                            const processingLanguageIndex = languages.map(language=>language.symbol).indexOf(processingLanguage)
                            const processingLanguageL = languages[processingLanguageIndex].language
                            return(
                                <div className='flex justify-between items-center' key={index}>
                                    {(index===0)?null:<FontAwesomeIcon className='ml2 mr2' icon={faAngleDoubleRight} size='lg'/>}
                                    <div className='btn btn-info'>{processingLanguageL}</div>
                                </div>
                            )
                        })
                    }
                    return(
                        <tr key={index}>
                            <th scope='row'>{index+1}</th>
                            <td>
                                <div className='btn btn-primary'>{languageStartEnd}</div>
                            </td>
                            <td className='flex justify-center items-center'>
                                <ProcessingLanguageMap />
                            </td>
                            <td>{languageCombination.avgRating}</td>
                            <td>{languageCombination.ratingCount}</td>
                        </tr>
                    )
                })
            } else {
                return(
                    <tr>
                        <th scope='row'>1</th>
                        <td>English</td>
                        <td>Processing Language</td>
                        <td>Score</td>
                        <td>Ratings</td>
                    </tr>
                )
            }
        }
        return (
            <div className=''>
                {/*HEADER*/}
                <div className='row'>
                    <div className='col-12 d-flex justify-content-center align-items-center'>
                        <div>
                            <h1>Full Text Rewriter</h1>
                            <h4>How It Works</h4>
                            <div className=' flex justify-between items-center'>
                                <div className='btn btn-primary'>English</div>
                                <FontAwesomeIcon className='ml2 mr2' icon={faAngleDoubleRight} size='lg'/>
                                <div className='btn btn-info'>Processing Languages</div>
                                <FontAwesomeIcon className='ml2 mr2' icon={faAngleDoubleRight} size='lg'/>
                                <div className='btn btn-success'>English</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*REWRITER*/}
                <div className='row mt3'>
                    <div className='container'>
                        <h2>Rewriter</h2>
                        <div className="row rewriter-container">
                            <div className="col-sm-4 flex flex-column">
                                <h3>Input</h3>
                                <textarea className='form-control flex-1' value={this.state.text} onChange={(e)=>this.setState({text: e.target.value})}/>
                                <div className='flex justify-center mt3'>
                                    <div className="btn btn-primary" onClick={()=>this.setState({text: 'alright, we are about to try something here!'})}>Sample Text</div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <h3>Processing Languages:</h3>
                                <LanguageSelectorMap />
                                {(this.state.processingLanguages.length < 5)?
                                    <div className='btn btn-info mt1' onClick={this._addProcessingLanguage}>Add Language</div>: null}
                            </div>
                            <div className="col-sm-4 flex flex-column">
                                <h3>Result</h3>
                                <div className='rewrite-result flex-1'>{this.state.rewrite}</div>
                                {(this.state.lastCalledLanguage && !this.state.loading) ?
                                    <div className='w-100'>
                                        {(!this.state.rated)?<span>Please Rate</span>:<div className='w-100'>Thank You :)</div>}
                                        {(!this.state.rated)?
                                        <ul className='pagination pagination-sm flex'>
                                            <li onClick={()=>this._rateRewrite(1)} className='page-item page-link flex-1'><FontAwesomeIcon icon={faStar}/><br/>1</li>
                                            <li onClick={()=>this._rateRewrite(2)} className='page-item page-link flex-1'><FontAwesomeIcon icon={faStar}/><br/>2</li>
                                            <li onClick={()=>this._rateRewrite(3)} className='page-item page-link flex-1'><FontAwesomeIcon icon={faStar}/><br/>3</li>
                                            <li onClick={()=>this._rateRewrite(4)} className='page-item page-link flex-1'><FontAwesomeIcon icon={faStar}/><br/>4</li>
                                            <li onClick={()=>this._rateRewrite(5)} className='page-item page-link flex-1'><FontAwesomeIcon icon={faStar}/><br/>5</li>
                                        </ul>: null}
                                    </div>
                                : null}
                            </div>
                        </div>
                        <div className="btn btn-success w-100 mt3 btn_rewrite" onClick={this._rewrite}>REWRITE</div>
                    </div>
                </div>
                {/*OPTIONS*/}
                <div className='row'>
                    <div className='container pb3'>
                        <h2>Options</h2>
                        <div className='row'>
                            <div className='col-12 col-sm-4 flex items-center'>
                                <div className='check-box' onClick={()=>this.setState({autocorrect: !this.state.autocorrect})}>{(this.state.autocorrect)? <FontAwesomeIcon className='red' icon={faCheck}/> : null}</div>
                                <h4>Autocorrect</h4>
                            </div>
                            <div className='col-12 col-sm-4 flex items-center'>
                                <div className='check-box' onClick={()=>this.setState({thesaurus: !this.state.thesaurus})}>{(this.state.thesaurus)? <FontAwesomeIcon className='red' icon={faCheck}/> : null}</div>
                                <h4>Use Thesaurus</h4>
                            </div>
                            <div className='col-12 col-sm-4 flex items-center'>
                                <h4 >Translator</h4>
                                <select className='form-control ml2' onChange={(e)=>this.setState({translator: e.target.value})}>
                                    <option value='google'>Default</option>
                                    <option value='google'>Google API</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                {/*RATINGS*/}
                <div className='mt5 col-12'>
                    <h1>Ratings</h1>
                </div>
                <div className='row mb5'>
                    <div className='container'>
                        <h2>Popular Combinations</h2>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th scope='col'>#</th>
                                    <th scope='col'>Start/End Language</th>
                                    <th scope='col'>Processing Language</th>
                                    <th scope='col'>Score</th>
                                    <th scope='col'>Ratings</th>
                                </tr>
                            </thead>
                            <tbody>
                                <LanguageCombinationsMap />
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
    _addProcessingLanguage = () => {
        this.state.processingLanguages.push(defaultAddedLanguage)
        this.setState({processingLanguages: this.state.processingLanguages})
    }
    _removeProcessingLanguage = (index) => {
        this.state.processingLanguages.splice(index, 1)
        this.setState({processingLanguages: this.state.processingLanguages})
    }
    _rateRewrite = async (rating) => {
        const wordCount = this.state.text.trim().replace(/\s+/gi, ' ').split(' ').length
        this.setState({rated: true})
        const variables = {
            rating: rating,
            language: this.state.language,
            processingLanguages: this.state.processingLanguages,
            translator: this.state.translator,
            thesaurus: false,
            autocorrect: false,
            wordCount: wordCount
        }
        console.log(variables)
        await this.props.rateRewriteMutation({
            variables: variables,
            update: (store, {data: {rateRewrite}})=> {
                this.props.languageCombinationsQuery.refetch()
            }
        })
    }
    _rewrite = async ()=>{
        const text = this.state.text
        const language = this.state.language
        const processingLanguages = this.state.processingLanguages
        this.setState({
            lastCalledLanguage: this.state.language,
            lastProcessedLanguages: this.state.processingLanguages,
            loading: true,
            rated: false
        })
        await this.props.rewriteMutation({
            variables: {
                text: text,
                language: language,
                processingLanguages: processingLanguages
            },
            update: (store, {data: {rewrite}})=>{
                console.log(rewrite)
                this.setState({
                    rewrite: rewrite.rewrite,
                    loading: false
                })
            }
        })
    }
}

const REWRITE_MUTATION = gql`
mutation RewriteMutation($text: String!, $language: String!, $processingLanguages: [String]) {
    rewrite(text: $text, language: $language, processingLanguages: $processingLanguages){
        rewrite
}}`
const LANGUAGE_COMBINATIONS_QUERY = gql`
query { LanguageCombinations { 
    id processingLanguages language translator ratingCount avgRating
}}`
const CREATE_RATING_MUTATION = gql`
mutation rateRewrite(
    $rating: Int, 
    $language: String!, 
    $processingLanguages: [String], 
    $translator: String, 
    $wordCount: Int){
    rateRewrite(
        rating: $rating, 
        language: $language, 
        processingLanguages: $processingLanguages,
        translator: $translator, 
        wordCount: $wordCount){
            id languageCombinationId rating wordCount
}}`
export default compose(
    graphql(REWRITE_MUTATION, {name: 'rewriteMutation'}),
    graphql(LANGUAGE_COMBINATIONS_QUERY, {name: 'languageCombinationsQuery'}),
    graphql(CREATE_RATING_MUTATION, {name: 'rateRewriteMutation'})
)(Home)
