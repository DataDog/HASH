const randomizer = require('../randomizer')

module.exports = (http) => {
    //add couple of fake cookies
    //list of cookies to implement
    let cookie_set = {
        key: randomizer.faker.internet.domainWord(),
        value: randomizer.faker.git.commitSha()
    }

   

    http.use(function(req, res, next) {
        //if not exists create it
        console.log('Cook',req.cookies);
        if(!req.cookies || !req.cookies[cookie_set.key]){
            console.log('cookie not exists, lets fake it')
            res.cookie(cookie_set.key, cookie_set.value, {
                httpOnly: true
            })
            next()
            return
        }

        if(req.cookies && req.cookies[cookie_set.key] != cookie_set.value){
            //cookie manipulated
            console.log('Simulation: --- Cookie trap hit, marking the session as malicious', req.cookies[cookie_set.key])
            req.session.isMalicious = true
        }

        //all good
        next()
    });

    console.log(randomizer.faker.internet.domainWord(), '=',randomizer.faker.git.commitSha());
}