import Chai from 'chai'
import ChaiHttp from 'chai-http'
Chai.use(ChaiHttp)
import { sinon, spy } from 'sinon';
import 'babel-polyfill'; //imported because issue https://github.com/babel/babel/issues/5085

global.expect = Chai.expect;
global.request = Chai.request;
global.assert = Chai.assert;
global.sinon = sinon;
global.spy = spy;


