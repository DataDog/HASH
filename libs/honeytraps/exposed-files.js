const fs = require('fs')
const randomizer = require('../randomizer')

module.exports = (http) => {
    
    let files = {
        ".env": randomizer.replace(fs.readFileSync(__dirname + '/files/dotenv', {encoding: 'utf-8'})),
        "readme.txt": randomizer.replace(fs.readFileSync(__dirname + '/files/readme.txt', {encoding: 'utf-8'})),
        "changelog.txt": randomizer.replace(fs.readFileSync(__dirname + '/files/changelog.txt', {encoding: 'utf-8'}))
    };



    for (const route in files) {
        const content = files[route];
        console.log(route)
        http.get("/"+route, (req,res) => {
            console.log('Simulation: --- Trap hit, marking the session as malicious', req.session)
            req.session.isMalicious = true
            res.set('Content-Type', 'text/plain') 
            res.status(500).send(content)
        });
    }

   
}