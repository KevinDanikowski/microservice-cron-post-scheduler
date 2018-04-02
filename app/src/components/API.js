import React, { Component } from 'react';

class Footer extends Component {
    render(){
        const mutationString = 'mutation{rewrite(text: YOUR_TEXT, language: SEE_GOOGLE_LANGUAGE_SYMBOLS, translator: "google", processingLanguages: ["STRING","OF","GOOGLE","LANGUAGES"], autocorrect: BOOLEAN, thesaurus: BOOLEAN){language processingLanguages text rewrite autocorrect thesaurus translator}}'

        return(
            <div className=''>
                <div className='row'>
                    <div className='col-12 d-flex justify-content-center align-items-center'>
                        <div>
                            <h1>API</h1>
                            <h2>How To Use It</h2>
                            <ol>
                                <li>
                                    <p>Familiarize yourself with Graphql</p>
                                </li>
                                <li>
                                    <p>Make a post query to <a href='https://rewriter.smodin.me/graphql'>rewriter.smodin.me/graphql</a> which looks like so:</p>
                                    <code>
                                        {mutationString}
                                    </code>
                                </li>
                                <li>
                                    <p>There are 2 Rules to Follow:</p>
                                    <ol>
                                        <li>No more than 5 processing languages at a time</li>
                                        <li>Languages and string input must match ISO-639-1 Code found at <a href="https://cloud.google.com/translate/docs/languages">Google translate api cloud docs</a></li>
                                    </ol>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Footer;
