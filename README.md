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

