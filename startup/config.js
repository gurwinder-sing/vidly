const config = require('config');

// For best practice always throw error object(not throw error string), this is becuase
// stack is available when we throw error object
module.exports = function(){
    if(!config.get('jwtPrivateKey')){
        throw new Error('FATAL ERROR : jwtPrivateKey is not defined');
    }
}