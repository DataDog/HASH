# HASH Config


## init.yaml
the main configuration file, loaded when the framework initialized.

```yaml
name: "default"
port: 3000
headers:
    - Server: "Apache/2.4.19"
```


| Name    | Description     | Default
| ------------- |-------------| -----|
| name | the honeypot name | default |
| port | the application port | 3000 |
| headers | list of the headers to be exposed | none |



## Request template
Thie is the main component which define single request or group of requested

example:

```yaml
id: cgi-bin
info:
    title: "cgi-bin trap"
requests:
  - isTrap: true 
    expect:
      method: GET
      path: '/cgi-bin'
    reply:
      status: 500
      headers:
        content-type: "text/plain"
      body: 
        contents: "You are not allowed to access this folder"
```

| Name    | Description     | Default | Optional
| ------------- |-------------| -----| -----|
| id | the request Id (must be unique) | - | No |
| info | key/value pairs for request metadata - its helpful when review the logs | - | Yes |
| requests | an array of the requests in this yaml file | - | No |
| -- isTrap | if true, any hit to this request will be marked as malicious and will be logged | false | Yes |
| -- expect | The request route looks like | - | No |
| -- -- method | the HTTP request method (GET/POST/HEAD/PUT/DELETE/OPTIONS) | GET | No |
| -- -- path | the route | - | No |
| -- reply | The response template for the request | - | No |
| -- -- status | The response status code | 200 | No |
| -- -- headers | List of headers to be returned with the response | - | Yes |
| -- -- body | the response body | - | No |
| -- -- -- contents | the contents of the response | - | Yes |
| -- -- -- view | the file which contains the view (see: using rendered template) | - | Yes |


### Using multiple requests

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

In the above example you can see two requests, the first one is the legit call ex: `author/1` but if the attacker tries to manipulate it by inserting other characters ex: `author/999 or 1=1` it falls in the trap and the framework will reply with `500` error along with the standard MySQL error message `You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '' at line 2`