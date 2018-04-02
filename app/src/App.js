import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom'
import API from './components/API'
import Home from './components/Home'
import Footer from './components/Footer'
import './scss/index.scss'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        return (
            <div className="App">
                <Switch>
                    <Route exact path='/api' component={()=><API />} />
                    <Route component={()=><Home />} />
                </Switch>
                <Footer />
            </div>
        )
    }
}

export default App;
