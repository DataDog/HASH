# HASH (HTTP Agnostic Software Honeypot)
Hash is a framework for creating and lunching a low interactive honeypots. The main philosophy of it is to be easy to configure and be flexible to mimic any software running on HTTP/HTTPs.



# Installation

##  Using Docker and docker-compose (recommended)

1. Copy `.env.example` to `.env` and add your secrets

```
appKey=<random key used to encrypt cookies)
DD_SERVICE=<Service name>
DD_API_KEY=<Datadog API KEY>
```

2. run `docker-compose`
```
docker-compose up 
```

## Without Docker 

```
npm install
```

```
node app.js
```


Roadmap
- [ ] CLI Wizard
- [ ] Built-in modules
    - [ ] session.set / session.get
    - [ ] http simulator
    - [ ] Shell simulator
    - [ ] Database simulator



id: confluence
info:
    title: "333"
    description: "333"
requests:
  - hidden: false # if true, it will not be exposed in sitemap nor the index page
    log: true # this is legit, dont log it unless this user is malicious from a previous request
    expect:
        method: GET
        path: '/xxx/' #oShell.Exec('whoami')
            
    reply:
        status: 200
        headers:
            content-type: "text/html"
        body: 
            contents: "gogo {{command}}"
            variables:
                command: request.query.id.match(/Exec('.*')/))




id: confluence
info:
    title: "333"
    description: "333"
requests:
  - hidden: false # if true, it will not be exposed in sitemap nor the index page
    log: true # this is legit, dont log it unless this user is malicious from a previous request
    expect:
        method: GET
        path: '/xxx2/'
    reply:
        handler: "xx.js"
        


# xx.js

```
module.exports = function(request, response) {
    //do what you whant with the request parameter
    //prepare your response dymanically
    response.send('Hello world xx')
}
```
            