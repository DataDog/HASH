const { faker } = require('@faker-js/faker')
const Mustache = require('mustache');
const crypto = require('crypto');
const fs = require('fs')

const getRandomArbitrary = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
}

const fakeIt = (string) => { 
    //let stringArr = string.split(/(\${[a-zA-Z\.\:\d]+})/)
    let stringArr = string.split(/(\${faker[^}]+})/)
    console.log(stringArr.length,stringArr);
    for (let i = 0; i < stringArr.length; i++) {
        const chunk = stringArr[i];
        console.log('CHUNK', chunk)
        if(chunk.indexOf('${faker.') === 0){
            //found calling to faker, lets parse and excute it;
            let fakerCall = chunk.replace(/\${([a-zA-Z\.0-9]+)(:([^}]+))?}/, "return this.$1($3)");
            console.log('THe Code', fakerCall)
            let res = new Function(fakerCall).apply({faker});
            stringArr[i] = res;
        } 
    }

    return stringArr.join('');
}


const Cache = {
    cacheDir: function(){
        return __dirname + '/../cache/';
    },
    key: function(text){
        return crypto.createHash('md5').update(text).digest('hex');
    },
    set: function(key, contents){
        return fs.writeFileSync(this.cacheDir() + key, contents);
    },
    get: function(key){
        try { //just in case of IO error
            if(fs.existsSync(this.cacheDir() + key)){
                return fs.readFileSync(this.cacheDir() + key, {encoding:'utf-8'})
            }
            return false;
        } catch (error) {
            return false;
        }
    }
}



const render = (httpRequest, contents, vars) => {
    let renderedContents;

    //check cache first
    let cacheKey = Cache.key(httpRequest.path);
    let res = Cache.get(cacheKey)
    if(res){
        console.log('Cache: Found, return result')
        return res;
    }

    console.log('Cache: Not Found, lets create it')

    //cache not found, create it
    renderedContents = fakeIt(contents)

    renderedContents = Mustache.render(renderedContents, vars);
    Cache.set(cacheKey, renderedContents);

    return renderedContents;
}

module.exports = {
    faker,
    fakeIt,
    render
}