# HASH (HTTP Agnostic Software Honeypot)
Hash is a framework for creating and launching small interactive honeypots. 

# 🌟 Why HASH?
The main philosophy of HASH is to be easy to configure and flexible to mimic any software running on HTTP/HTTPs. With the minimum footprint possible to avoid being detected.


# ⚡ Features

* Single framework to deploy HTTP/HTTPs based honeypots
* Easily configurable via YAML files
* Built-in honeytraps
* Out-of-the box integration with Datadog to review the honeypot logs
* Fully randomize capabilities based on `fakerJS`


# 🚀 Getting Started
HASH is built using Node.js but it can mimic any web based language / server based on the configuration. Read the full docs here:

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

3. Update the default templates at `apps/default`

    a. Update `apps/default/init.yaml`

    b. Add/update the request templates here `apps/default/templates`

> You can also create a new application templates (documentation link)


4. Run HASH

```
nodejs app.js
```
> For production grade deployment explore running with PM2 or advanced deployment with Docker & Kubernetes


## Customization and configuration

You can customize the default application in `apps/default` or create a new application `apps/<your-app>`

Example request template:

```yaml
id: sqli-error
info:
    title: "SQL error honeytrap"
requests:
  - isTrap: false 
    expect:
      method: GET
      path: '/author/:Id([0-9]+)'
    reply:
      status: 200
      headers:
        content-type: "text/html"
      body: 
        view: "author.html"
  - isTrap: true 
    expect:
      method: GET
      path: '/author/:Id'
    reply:
      status: 500
      headers:
        content-type: "text/html"
      body: 
        contents: "You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '' at line 2"
```

Read the config documentation [here](./docs/config.md)


## License and Contribution
TBD



## Contacts
TBD