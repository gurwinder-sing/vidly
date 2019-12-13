const config = require('config');
const jwt = require('jsonwebtoken');
function auth(req, res, next)
{
    const token = req.header('x-auth-token');
    console.log(token);
    if(!token) res.status(401).send('Access denied . No token provided');

    try {
        const decoded = jwt.verify(token,config.get('jwtPrivateKey'));
        // Adding new property in our req object and with value of that of decoded(payload)
        req.user = decoded;
        next();
    }
    catch(ex){
        res.status(400).send('Invalid token');
    }
}

module.exports = auth ;