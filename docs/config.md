# HASH Config

A typical honeypot profile follows the file structure below:

```
|____templates
|     |____resources
|     |     |____index.html
|     |     |____style.css
|     |     |____favicon.ico
|     |____404.yaml
|     |____default.yaml
|____init.yaml
```

The main configurations live inside `init.yaml` and `templates/` folder

## init.yaml

The main configuration file, loaded when the framework initialized.

```yaml
name: 'default'
port: 3000
headers:
    - Server: 'Apache/2.4.19'
```

| Name           | Description                                  | Default |
| -------------- | -------------------------------------------- | ------- |
| name           | the honeypot name                            | default |
| port           | the application port                         | 3000    |
| headers        | list of the headers to be exposed            | none    |
| disableBuiltIn | list of builtin features you want to disable | none    |

### disable builtIn features

HASH is shipped with some builtIn features like cookie tracking and traps, you can disable anyof them by defining this in your init.yaml file

```yaml
honeypot-name: 'service'
port: 5000
headers:
    'Api-Version': 2.1
    'Server': 'Service/5.5.5 (linux)'
disableBuiltIn:
    - traps
```

## Request template

Thie is the main component which define the endpoints the honeypot will implement, and their behavior.

Example:

```yaml
id: cgi-bin
info:
    title: 'cgi-bin trap'
requests:
    - isTrap: true
      expect:
          method: GET
          path: '/cgi-bin'
      reply:
          status: 500
          headers:
              content-type: 'text/plain'
          body:
              contents: 'You are not allowed to access this folder'
```

| Name              | Description                                                                   | Default | Optional |
| ----------------- | ----------------------------------------------------------------------------- | ------- | -------- |
| id                | the request Id (must be unique)                                               | -       | No       |
| info              | key/value pairs for request metadata - its helpful when review the logs       | -       | Yes      |
| requests          | an array of the requests in this yaml file                                    | -       | No       |
| -- isTrap         | if true, any hit to this route will be marked as malicious and will be logged | false   | Yes      |
| -- expect         | description of the route                                                      | -       | No       |
| -- -- method      | the HTTP request method (GET/POST/HEAD/PUT/DELETE/OPTIONS)                    | GET     | No       |
| -- -- path        | the route's name                                                              | -       | No       |
| -- reply          | the response template for the request                                         | -       | No       |
| -- -- status      | response status code                                                          | 200     | No       |
| -- -- headers     | list of headers to be returned with the response                              | -       | Yes      |
| -- -- body        | the response body                                                             | -       | No       |
| -- -- -- contents | the content of the response                                                   | -       | Yes      |
| -- -- -- view     | the file containing the view (see: using rendered template)                   | -       | Yes      |
| -- -- -- static   | static file rendering                                                         | -       | Yes      |

### Using multiple requests

```yaml
id: sqli-error
info:
    title: 'SQL error honeytrap'
requests:
    - isTrap: false
      expect:
          method: GET
          path: '/author/:Id([0-9]+)'
      reply:
          status: 200
          headers:
              content-type: 'text/html'
          body:
              view: 'author.html'
    - isTrap: true
      expect:
          method: GET
          path: '/author/:Id'
      reply:
          status: 500
          headers:
              content-type: 'text/html'
          body:
              contents: "You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '' at line 2"
```

In the above example you can see two requests definition for the same endpoint. The first one define the legitimate call (ex: `author/1`) where the application reply with `author.html`. But if the attacker tries to manipulate the argument and provide a non-numeric value (such as `author/999 or 1=1`), it will fall in the trap and the framework will reply with a `500` error along with the standard MySQL error message `You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '' at line 2`
