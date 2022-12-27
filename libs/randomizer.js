const { faker } = require('@faker-js/faker')

// console.log(faker.datatype.datetime({min: Date.now() - (8760*60*60*1000), max: Date.now()}))

const replace = (txt) => {
    //random
    txt = txt.replace("${rand:number}", faker.datatype.number())
    txt = txt.replace("${rand:string}", faker.random.alpha(getRandomArbitrary(3,10)))
    txt = txt.replace("${rand:uuid}", faker.datatype.uuid())
    txt = txt.replace("${rand:date}", faker.datatype.datetime(Date.now()))
    txt = txt.replace("${rand:date:thisyear}", faker.datatype.datetime({min: Date.now() - (8760*60*60*1000), max: Date.now()}))
    txt = txt.replace("${rand:text}", faker.lorem.paragraphs(getRandomArbitrary(5,20),"\n\n"))
    txt = txt.replace("${rand:ipv4}", faker.internet.ipv4() )
    //general
    txt = txt.replace("${current:date}", new Date)
    return txt;
}


const getRandomArbitrary = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
}


// console.log(randomize("okokok ${rand:number} ${rand:number}"))

// parse("okokwe qwkemoqwk jmdkljajns kfjlnadslfniladsnadilshngildfshg kljsdfhgklj dfsgjklhdfsjklghkldfjshgkldfshjg kljdfshg klsdfhg dflsk")
module.exports = {
    faker,
    replace
}