import React from 'react';
import Child from '../src/Child';

const defaultProps = {
    text: 'this is my child ;)'
}

describe('Child component', () => {
    const wrapper = shallow(<Child text='ok' {...defaultProps} />);
    const mountedWrapper = mount(<Child/>)
    const renderedWrapper = mount(<Child/>)

    it('should have a div wrapper', () => {
        expect(wrapper.type()).to.equal('div');
    });
    it('should have text with \'this is my child ;)\'', () => {
        expect(wrapper).to.have.text('this is my child ;)');
    });

})

/*
props appears to refer to properties on div in the child
 */
