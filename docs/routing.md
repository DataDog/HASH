# Using route parameters

Because HASH is built on top of expressJS we can leverage all the power of express js routing, using named parameters and regex in the URL

Here is some examples. see more [here](https://expressjs.com/en/guide/routing.html)

-   `/ab?cd` match `acd` and `abcd`.
-   `/.*fly$` match `butterfly` and `dragonfly`, but not `butterflyman`, `dragonflyman`

HASH support using the route parameters, you can leverage it in the body view. Look at the next example

```yaml
id: api
info:
    title: 'API'
requests:
    - expect:
          method: GET
          path: '/user/:userId(\d+)'
      reply:
          status: 200
          headers:
              content-type: 'application/json'
          body:
              view: 'example.html'
```

The parameter `userId` will be available to be used directly in the body view `example.html`

```html
<h1>Hello User {{ params.userId }}</h1>
```

This will be replaced with userId giving it a realistic behaviour.
