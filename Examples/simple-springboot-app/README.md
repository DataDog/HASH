
Springboot Sample Application
-------

## Features

- Springboot Favicon, to be easily identified via `http.favicon.hash:116323821`
- Default Actuators endpoints
- Sample API endpoints
- default 404 error page


## Usage
Copy this folder to `/profiles/simple-springboot-app` and change the value in the `.env` file to `HONEYPOT_PROFILE=simple-springboot-app` 


## Endpoints list

### Auth

| Method | Url | Decription | Sample Valid Request Body | 
| ------ | --- | ---------- | --------------------------- |
| POST   | /api/login | Log in |  |


### Articles & Authors

| Method | Url | Description | Sample Valid Request Body |
| ------ | --- | ----------- | ------------------------- |
| GET    | /api/articles | Get all articles | |
| GET    | /api/article/{id} | Get article by id | |
| GET    | /api/authors | Get all authors | |
| GET    | /api/author/{id} | Get author info | |



