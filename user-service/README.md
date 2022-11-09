# User Service

## Overview

User service provides authentication functionalities using [JsonWebToken](https://github.com/auth0/node-jsonwebtoken)

# Set Up Guide

## Navigate to the `user-service` directory

Run `cd user-services` from the root of the project.

## Installing Dependencies

Run `npm install` to install dependencies

## Environment variables

Ensure that environment variables are set.

## Running Locally

1. After installing dependencies, run `npm run dev` to start the application.
2. The service should be started on http://localhost:8000.

## Running Tests

Run `npm run test` to execute tests. Tests depend on the deployment URL in the environment variables.

## Endpoints

### Creating a new user

POST request to `/api/user`

Example request body:
```
{ "username": String, "password": String  }
```

### Updating a user's credentials

PUT request to `/api/user`

Example request body:
```
{ "oldPassword": String, "newPassword": String, }
```

### Deleting a user

DELETE request to `/api/user`

### Logging in a user

POST request to `/api/user/login`

Example request body:
```
{ "username": String, "password": String, "currToken": String }
```

### Authorizing a user

GET request to `/api/user/session`
