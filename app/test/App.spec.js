import React from 'react';
import App from '../src/App';

describe('App component', () => {
    const wrapper = shallow(<App />);
    const mountedWrapper = mount(<App />)
    const renderedWrapper = mount(<App />)

    it('should have a div wrapper', () => {
        expect(wrapper.type()).to.equal('div');
    });

    it('renders h1 contents', () => {
        expect(wrapper.find('h1').text()).equal('Welcome to React')
    })

    it('should have the alert-class div', (done)=>{
        expect(wrapper.find('.alert-class').exists()).to.equal(true)
        done()
    })

    it('should have a button with ID #alert-button', (done)=>{
        //https://stackoverflow.com/questions/27158945/how-to-test-showing-an-element-after-a-click
        expect(wrapper.find('#alert-button').exists()).to.equal(true)
        expect(wrapper.find('#alert-button').type()).to.equal('button')
        done()
    })

    it('should have #alert-button show menu .dropdown on click', (done)=>{
        wrapper.find('#alert-button').simulate('click') //opens
        expect(wrapper.find('.dropdown').exists()).to.equal(true)
        wrapper.find('#alert-button').simulate('click') //closes
        expect(wrapper.find('.dropdown').exists()).to.equal(false)
        done()
    })

});


/*
notes: to.equal mean === while to.eql means deeply equal
 */

/* CSS TEST, WAITING ON SO QUESTION TO BE ANSWERED
    it('should have a header with display: block', (done)=>{
        const body = $('body')
        console.log(body) // Returns <body></body>
        expect(body).exist; // Returns true
        expect(body).to.have.css('background-color', '#ffffff'); //nothing in body, doesn't work

        expect(wrapper.find('#body').get(0).props).to.have.property({display: 'block'}) //not in the props because CSS comes from className
        expect(mountedWrapper.find('#app-header').get(0).getDOMNode().getComputedStyle()).to.have.property({display: 'block'})

        done()
    })*/
