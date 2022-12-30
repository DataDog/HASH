const fs = require('fs')
const randomizer = require('../randomizer')
const log = require('../log')

module.exports = (http) => {
    
    let files = {
        ".env": randomizer.fakeIt(fs.readFileSync(__dirname + '/files/dotenv', {encoding: 'utf-8'})),
        "readme.txt": randomizer.fakeIt(fs.readFileSync(__dirname + '/files/readme.txt', {encoding: 'utf-8'})),
        "changelog.txt": randomizer.fakeIt(fs.readFileSync(__dirname + '/files/changelog.txt', {encoding: 'utf-8'}))
    };



    for (const route in files) {
        const content = files[route];        
        http.get("/"+route, (req,res) => {
            log('Simulator', 'Exposed files trap hit, marking the session as malicious /' + route, 'warning')
            req.session.isMalicious = true
            res.set('Content-Type', 'text/plain') 
            res.status(500).send(content)
        });
    }

   
}