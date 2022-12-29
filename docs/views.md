# Template views
HASH is using [Mustache](https://mustache.github.io) to handle the view rendering, So basically you can use Mustache capabilities to render the views

Beside Mustache, HASH also support randomized contents using [fakerJs](https://fakerjs.dev)


Example template

```json
{
  "login": "${faker.lorem.slug}",
  "id": {{ params.userId }},
  "node_id": "${faker.datatype.uuid}",
  "avatar_url": "${faker.internet.avatar}",
  "gravatar_id": "${faker.datatype.uuid}",
  "url": "${faker.internet.url}",
  "html_url": "${faker.internet.url}",
  "type": "User",
  "site_admin": ${faker.datatype.boolean},
  "name": "${faker.name.fullName}",
  "company": "${faker.company.name}",
  "blog": "https://github.com/blog",
  "location": "${faker.address.country}",
  "email": "${faker.internet.email}",
  "hireable": ${faker.datatype.boolean},
  "bio": "${faker.lorem.paragraphs:3}"
}
```

## Mustache
For Mustache syntax use the standard `{{`  `}}` to wrap the dynamic contents


## FakerJs
For any fakerJS api just use the following conversion `${faker.class.method:param}`.
So for example if you want to generate 5 paragraphs, You can use `${faker.lorem.paragraph:5}` which is equilivant to `faker.lorem.paragraph(5)`  

Check [FakerJs documentation](https://fakerjs.dev/api/) for the full list of APIs you can use 
