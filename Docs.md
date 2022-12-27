# Create app or use the default one

```
apps
├── default
│   ├── init.yaml
│   └── templates
│       |__ request1.yaml
│       |__ request2.yaml
```

init.yaml
```yaml
honeypot-name: "default"
port: 3000
headers:
    header1K: header1V
    header2K: header2V
built-in-traps:
  enable: true
  list:
    header1K: true
    header2K: false
```


request template
```yaml
id: default
info:
    title: "Default"
requests:
  - expect:
      method: GET
      path: '/'
    reply:
      status: 200
      headers:
        content-type: "text/html"
      body: 
        view: "index.html"
```


build-in traps / Honeytrap Baits

- [x] hidden directory in robots.txt
- [x] exposed .env 
- [x] exposed readme.txt, changelog.txt
- [ ] exposed archives
- [ ] exposed admin panels
- [ ] Fake Cookie Data
- [ ] Fake Hidden Form 
- [ ] Fake HTML comments
