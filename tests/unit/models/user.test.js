const {User} = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
    it('should generate auth token', () => {

        // Here _id should be valid one, so we use mongoose to create one, otherwise test will fail
        // In the decoded format, _id will be set to 24 byte hexadecimal string, but when
        // we create this id using ObjectId function, it is not in hex string, so we are converting
        // it using toHexString function
        // When we use jest, the environment variable(NODE_ENV) automatically sets to test,
        // so we also need config file for test, which is test.json
        
        const payload = { 
            _id : new mongoose.Types.ObjectId().toHexString(),
            isAdmin : true 
        };
        const user = new User(payload);
        const token = user.generateAuthToken();

        const decoded =  jwt.verify(token, config.get('jwtPrivateKey'));

        expect(decoded).toMatchObject(payload);
    })
})
