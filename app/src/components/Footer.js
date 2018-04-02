import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Footer extends Component {
    render(){
        return(
            <div className='footer flex justify-end items-center'>
                <a className='mr4' href='https://smodin.me/home'>Main Site</a>
                <Link to='/api' className='mr3'>API</Link>
            </div>
        )
    }
}

export default Footer;

