module.exports = function (req, res, next){
    // 401 Unauthorised : Means token is wrong, so the credentials of user are wrong, user can try more times
    // 403 Forbidden : User don't have access to a particular resource, so that user can't
    // access the resource, so user should not try anymore
    
    if(!req.user.isAdmin) return res.status(403).send('Access denied');

    next();
}