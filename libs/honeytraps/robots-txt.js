const fs = require('fs');
const randomizer = require('../randomizer');

module.exports = (http) => {
    let robotsTxt = fs.readFileSync(__dirname + '/files/robots.txt', {
        encoding: 'utf-8',
    });
    robotsTxt = randomizer.fakeIt(robotsTxt);

    http.get('/robots.txt', (req, res) => {
        let content = robotsTxt;
        res.set('Content-Type', 'text/plain');
        res.send(content);
    });

    http.get('/[cd]/*', (req, res) => {
        //if accessed, this request is malicious
        req.session.isMalicious = true;
        res.status(500).send('Internal Server Error');
    });
};
