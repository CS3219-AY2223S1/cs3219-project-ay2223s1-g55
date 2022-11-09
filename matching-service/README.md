# Matching Service

## Overview

Matching service matches 2 users into a collaborative session.

# Set Up Guide

## Navigate to the `matching-service` directory

Run `cd matching-services` from the root of the project.

## Installing Dependencies

Run `npm install` to install dependencies

## Environment variables

Ensure that environment variables are set.

## Running Locally

1. After installing dependencies, run `npm run dev` to start the application.
2. The service should be started on http://localhost:8001.

## Running Tests

Run `npm run test` to execute tests. Tests depend on the deployment URL in the environment variables.

## Endpoints

### Get details of a session

GET request to `/api/match/sessions/:sessionId`

### Match users according to difficulty selected

POST request to `/api/match/request`

Example request body:
```
{
	"username": String,
    "difficulty": String,
    "requestId": String,
}
```

### Cancel a match request

POST request to `/api/match/cancel`

Example request body:
```
{
	"username": String,
    "difficulty": String,
}
```

### Delete a match request

DELETE request to `/api/match/request`

Example request body:
```
{
	"username": String,
  "difficulty": String,
}
```
