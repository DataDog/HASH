const randomizer = require('../randomizer')
const log = require('../log');

module.exports = (http) => {
    //add couple of fake cookies
    //list of cookies to implement 
    let cookie_set = {
        key: randomizer.faker.internet.domainWord(),
        value: randomizer.faker.git.commitSha()
    } 

   

    http.use(function(req, res, next) {
        //if not exists create it
        if(!req.cookies || !req.cookies[cookie_set.key]){
            res.cookie(cookie_set.key, cookie_set.value, {
                httpOnly: true
            })
            next()
            return
        }

        if(req.cookies && req.cookies[cookie_set.key] != cookie_set.value){
            //cookie manipulated
            log('Simulator', 'Cookie trap hit, marking the session as malicious' + req.cookies[cookie_set.key], 'warning')
            req.session.isMalicious = true
        }

        //all good
        next()
    });
}