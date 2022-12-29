# HASH (HTTP Agnostic Software Honeypot)
Hash is a framework for creating and lunching a low interactive honeypots. 

# 🌟 Why HASH?
The main philosophy of HASH is to be easy to configure and flexible to mimic any software running on HTTP/HTTPs. With the minimum footprint as possible to avoid been detected.


# ⚡ Features

* Single framework to deploy HTTP/HTTPs based honeypots
* Easily configurable via YAML files
* Built-in honeytraps
* Out-of-the box integration with datadog to view the honeypot logs
* fully randomize capabilities based on `fakerJS`


# 🚀 Getting Started
HASH is built using Nodejs but it can mimic any web based language / server based on the configuration. Read the full docs here:

## Installation

1. Copy `.env.example` to `.env` and add your secrets

```
appKey=<random key used to encrypt cookies) 
DD_SERVICE=<Service name> 
DD_API_KEY=<Datadog API KEY> # Datadog api key
```

2. Install dependencies

```
npm install
```

3. update the default templates here `apps/default`

    a. update `apps/default/init.yaml`

    b. add/update the request templates here `apps/default/templates`

> you can also create a new application templates (read the document)


4. Run HASH

```
nodejs app.js
```
> For production grade deployment explore running with PM2 or advanced deployment with Docker & Kubernetes




## Customization and configuration

Read the full documentation here 




## License and Contribution
TBD



## Contacts
TBD