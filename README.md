# Pizza App

This is an api for a Blog

---

## Requirements

1. User should be able to register
2. User should be able to login with Passport using JWT
3. Logged in and not logged in users should be able to get posts
4. Logged and not logged in users should be able to get a single post
5. Logged in users should be able to create a blog
6. When a blog is created, it is in draft state
   The owner of the blog should be able to edit nd delete the blog
7. Users should be able to update and delete orders
8. The owner of the blog should be able to get a list of their blogs and be filterable by state.
9. Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.
10. The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated and defaulted to 20 blogs per page.
11. The list of blogs endpoint that can be accessed by both logged in and not logged in users should also be searchable by author, title and tags
12. The list of blogs endpoint that can be accessed by both logged in and not logged in should also be orderable by read_count, reading_time and timestamp
13. When a single blog is requested, the api should return the user information(the author) with the blog and the read_count of the blog too should be updated by 1.
14. Test application

---

https://www.getpostman.com/collections/57dd34b5218b0b9b1dd1

## Setup

- Install NodeJS, mongodb
- pull this repo
- update env with example.env
- run `npm install`
- run `npm run start:dev`

---

## Base URL

- somehostsite.com

## Models

---

### User

| field     | data_type | constraints |
| --------- | --------- | ----------- | ------------------------------------------------ | --- |
| id        | string    | required    |
| firstname | string    | required    |
| lastname  | string    | required    |
| email     | string    | required    |
| password  | string    | required    |
| <!--      | user_type | string      | required, default: user, enum: ['user', 'admin'] | --> |

### Blog

| field        | data_type | constraints              |
| ------------ | --------- | ------------------------ | ------ |
| id           | string    | required                 |
| title        | string    | required                 | unique |
| body         | string    | required                 |
| description  | string    | optional                 |
| author       | string    | optional                 |
| timestamp    | date      | required                 |
| state        | number    | required,default:'draft' |
| read_count   | number    | optional                 |
| reading_time | number    | optional                 |
| tags         | array     | optional                 |

### Postman collection
https://www.getpostman.com/collections/57dd34b5218b0b9b1dd1
## APIs

---

### Signup User

- Route: /auth/signup
- Method: POST
- Body:

```
{
  "email": "doe@example.com",
  "password": "Password1",
  "firstname": "jon",
  "lastname": "doe",
}
```

- Responses

Success

```

{
    "email": "doe@example.com",
    "password": "Password1",
    "firstname": "jon",
    "lastname": "doe",
    "fullName": 'jon doe",
}

```

Error

```
{
    "message": 'unable to signup user - email is already in use',
}
```

```
{
    message: 'unable to signup user - check credentials',
}
```

---

### Login User

- Route: /auth/login
- Method: POST
- Body:

```
{
  "email": 'doe@example.com",
  "password": "Password1",
}
```

- Responses

Success

```
{
    token: 'sjlkafjkldsfjsd'
}
```

Error

```
{
    "message": "Email or password is incorrect"
}
```

### Create Post

- Route: /post
- Method: POST
- Header
  - Authorization: Bearer {token}
- Body:

```
{
    "title":"provident occaecati excepturi optio reprehenderit",
    "description": "description",
    "body":"dolore placeat quibusdam ea quo vitae\nmagni quis enim qui quis quo nemo aut saepe\nquidem repellat    excepturi ut quia\nsunt ut sequi eos ea sed quas",
    "tags":["dolor", "ipsum"]
}
```

- Responses

Success

```
 {
    "title": "provident occaecati excepturi purpode",
    "body": "dolore placeat quibusdam ea quo vitae\nmagni quis enim qui quis quo nemo aut saepe\nquidemrepellat excepturi ut quia\nsunt ut sequi eos ea sed quas",
    "description": "description",
    "author": "635ffcb799aa94dab9c35ba6",
    "state": "draft",
    "read_count": 0,
    "reading_time": "1m",
    "tags": [
        "dolor",
        "ipsum"
    ],
    "_id": "6362df9ea2c0d67fd6780de6",
    "timestamp: "2022-11-02T21:22:38.621Z",
    }
```

### Get all published posts

- Route: posts/
- Method: GET
- Query params: if a query starts with negative (-) sign it sorts from descending to ascending and vice versa, like in the case of time -timestamp
    - page (default: 1)
    - limit (default: 20)
    - author
    - title
    - tags
    - order_by(default: -timestamp)
        - author
        - title
        - tags

        
- Responses

Success

```
[{
    "_id": "63600722f02426919ff47e90",
    "title": "dolorem dolore est ipsam",
    "body": "ignissimos aperiam dolorem qui eum\nfacilis quibusdam animi sint suscipit qui sinpossimus cum\nquaerat magniea quo vitae\nmagni quis enim qui quis quo nemo aut saepe\nquidem repellat excepturi uquia\nsunt ut sequi eos ea sed quas",
    "description": "dolorem",
    "author": "635ffcb799aa94dab9c35ba6",
    "state": "published",
    "read_count": 3,
    "reading_time": "1m",
    "tags": [
        "index"
    ],
    "timestamp": "2022-10-31T17:34:26.355Z"
}]
```

---

### Get single published blog post

- Route: posts/:id
- Method: GET

- Responses

Success

```
[
    {
        "_id": "63600722f02426919ff47e90",
        "title": "dolorem dolore est ipsam",
        "body": "ignissimos aperiam dolorem qui eum\nfacilis quibusdam animi sint suscipit qui sint possimus cum\nquaerat magni maiores excepturi\nipsam ut commodi dolor voluptatum modi aut vitae ignissimos aperiam dolorem qui eum\nfacilis quibusdam animi sint suscipit qui sint possimus cum\nquaerat magni maiores excepturi\nipsam ut commodi dolor voluptatum modi aut vitae ignissimos aperiam dolorem qui eum\nfacilis quibusdam animi sint suscipit qui sint possimus cum\nquaerat magni maiores excepturi\nipsam ut commodi dolor voluptatum modi aut vitae dolore placeat quibusdam ea quo vitae\nmagni quis enim qui quis quo nemo aut saepe\nquidem repellat excepturi ut quia\nsunt ut sequi eos ea sed quas",
        "description": "dolorem",
        "state": "published",
        "read_count": 5,
        "reading_time": "1m",
        "tags": [
            "index"
        ],
        "timestamp": "2022-10-31T17:34:26.355Z",
        "author_doc": {
            "name": "sope fola",
            "email": "fola@gmail.com"
        }
    }
]
```

Error
```
{
    message: 'No posts match the ID provided',

}

```
---


### Get registered user posts

- Route: posts/my-posts
- Method: GET
- Header
  - Authorization: Bearer {token}

- Responses

Success

```
[
    {
        "_id": "63600748f02426919ff47e93",
        "title": "changed title",
        "body": "ignissimos aperiam dolorem qui eum\nfacilis quibusdam animi sint suscipit qui sint possimus cum\nquaerat magni maiores excepturi\nipsam ut commodi dolor voluptatum modi aut vitae ignissimos aperiams quo nemo aut saepe\nquidem repellat excepturi ut quia\nsunt ut sequi eos ea sed quas",
        "description": "ipsum teet",
        "author": "635ffcb799aa94dab9c35ba6",
        "state": "draft",
        "read_count": 1,
        "reading_time": "1m",
        "tags": [
            "sint",
            "qui"
        ],
        "timestamp": "2022-10-31T17:35:04.482Z",
    },
]

```
---

### Get a single post by owner

- Route: posts/my-posts/:id
- Method: GET
- Header
  - Authorization: Bearer {token}

- Responses

Success
```
[
    {
        "_id": "63600722f02426919ff47e90",
        "title": "dolorem dolore est ipsam",
        "body": "ignissimos aperiam dolorem qui eum\nfacilis quibusdam animi sint suscipit qui sint possimus cum\nquaerat magni maiores excepturi\nipsam ut commodi dolor voluptatum modi aut vitae ignissimos aperiam dolorem qui eum\nfacilis quibusdam animi sint suscipit qui sint possimus cum\nquaerat magni maiores excepturi\niemo aut saepe\nquidem repellat excepturi ut quia\nsunt ut sequi eos ea sed quas",
        "description": "dolorem",
        "state": "published",
        "read_count": 5,
        "reading_time": "1m",
        "tags": [
            "index"
        ],
        "timestamp": "2022-10-31T17:34:26.355Z",
        "author_doc": {
            "name": "sope fola",
            "email": "fola@gmail.com"
        }
    }
]

```

### Edit post by owner

- Route: posts/my-posts/:id
- Method: PATCH
- Header
  - Authorization: Bearer {token}

- Body:

```
{
    "title":"provident occaecati excepturi optio reprehenderit",
    "description": "description",
    "body":"dolore placeat quibusdam ea quo vitae\nmagni quis enim qui quis quo nemo aut saepe\nquidem repellat    excepturi ut quia\nsunt ut sequi eos ea sed quas",
    "tags":["dolor", "ipsum"],
    "state:"published"
}
```
Success

```
{
    "_id": "636015825f82b9e023524852",
    "title": "provident occaecati excepturi optio reprehenderit",
    "body": "dolore placeat quibusdam ea quo vitae\nmagni quis enim qui quis quo nemo aut saepe\nquidem repellat    excepturi ut quia\nsunt ut sequi eos ea sed quas",
    "description": "description",
    "author": "635ffcb799aa94dab9c35ba6",
    "state": "published",
    "read_count": 3,
    "reading_time": "1m",
    "tags":["dolor", "ipsum"],

    "timestamp": "2022-10-31T18:35:46.237Z",
}
```

Error
```
{
    message: 'No posts match the ID provided',
}

```

### Delete post by owner

- Route: posts/my-posts/:id
- Method: DELETE
- Header
  - Authorization: Bearer {token}


Success

```
{
    message: 'deletion successful',
}
```

Error
```
{
    message: 'No posts match the ID provided',
}

```
---

## Contributor
- Adebanjo Afolasope
```
