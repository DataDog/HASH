# Views rendering

Views are stored in `templates/resources`, you can store any kind of files there `html`, `json`, `xml` ...etc and your static assets as well `css`, `js`, `favicon` ..etc

You can use it easily like this in your request templates

> `templates/example1.yaml`

```yaml
id: view-example
info:
    title: 'View Example'
requests:
    - expect:
          method: GET
          path: '/articles'
      reply:
          status: 200
          headers:
              content-type: 'text/html'
          body:
              view: 'articles.html' #<- the name of the file
```

If you want to use static file (no randomization of content or any text processing) just use the property `static`

> `templates/example2.yaml`

```yaml
id: favicon-example
info:
    title: 'favicon Example'
requests:
    - expect:
          method: ALL
          path: '/favicon.ico'
      reply:
          status: 200
          headers:
              content-type: 'image/x-icon'
          body:
              static: 'favicon.ico' #<- the name of the file
```

> note: make sure to use the correct content-type if you want to make it work properly in the browser

## Randomization via FakerJS

In order to make it realistic enough and avoid being detected as honeypot, HASH support content randomization using [fakerJs](https://fakerjs.dev)

Example template

> `templates/resources/user-api.json`

```json
{
  "login": "$<faker.lorem.slug()>",
  "id": {{ params.userId }},
  "node_id": "$<faker.datatype.uuid()>",
  "avatar_url": "$<faker.internet.avatar()>",
  "gravatar_id": "$<faker.datatype.uuid()>",
  "url": "$<faker.internet.url()>",
  "html_url": "$<faker.internet.url()>",
  "type": "user",
  "site_admin": $<faker.datatype.boolean()>,
  "name": "$<faker.name.fullName()>",
  "company": "$<faker.company.name()>",
  "blog": "https://github.com/blog",
  "location": "$<faker.address.country()>",
  "email": "$<faker.internet.email()>",
  "hireable": $<faker.datatype.boolean()>,
  "bio": "$<faker.lorem.paragraphs(2)>"
}
```

For any fakerJS api just use the following conversion `$<faker.class.method(param)>`.
So for example if you want to generate 5 paragraphs, You can use `$<faker.lorem.paragraph(5)>` which is equilivant to `faker.lorem.paragraph(5)`

Check [FakerJs documentation](https://fakerjs.dev/api/) for the full list of APIs you can use

## Template via Mustache

HASH is using [Mustache](https://mustache.github.io) to handle the view rendering, So basically you can use Mustache capabilities to render the views

For Mustache syntax use the standard `{{` `}}` to wrap the dynamic contents. And you can set the template variable inside request templates in `reply.body.vars`

Example:

> `templates/articles.yaml`

```yaml
id: view-example
info:
    title: 'View Example'
requests:
    - expect:
          method: GET
          path: '/articles'
      reply:
          status: 200
          headers:
              content-type: 'text/html'
          body:
              view: 'articles.html'
              vars:
                  links:
                      - title: home
                        link: '/'
                      - title: about
                        link: '/about'
                      - title: contact
                        link: '/contact'
```

And in the template

> `templates/resources/articles.html`

```html
{{#links}}
<a href="{{ link }}">{{title}}</a>
{{/links}}
```

Mustache will take care of rendering your content. See the full documentation [here](https://mustache.github.io/mustache.5.html)

## dates

Dates is special componenet, because sometimes it needs to be refreshed with every request and sometime it needs to be static (eg. date in the past)

-   static dates

```js
$<faker.datatype.datetime()> //2050-05-15T16:19:19.092Z
$<faker.date.past(10)> //2013-10-25T21:34:19.488Z
```

-   live date

```js
$<date.iso> //2023-02-09T14:24:04.243442922Z
$<date.timestamp> //4102444800
```
