# History Service

## Overview

History service stores the records of each user and makes meaningful calculations out of these records.

# Set Up Guide

## Navigate to the `history-service` directory

Run `cd history-services` from the root of the project.

## Installing Dependencies

Run `npm install` to install dependencies

## Environment variables

Ensure that environment variables are set.

## Running Locally

1. After installing dependencies, run `npm run dev` to start the application.
2. The service should be started on http://localhost:8003.

## Running Tests

Run `npm run test` to execute tests. Tests depend on the deployment URL in the environment variables.

## Endpoints

### Get a user's records

GET request to `/api/history/records/:username`

### Create a new user record

POST request to `/api/history/records/:username`

Example request body:
```
{
	"questionName": String,
    "firstUsername": String,
    "secondUsername": String,
    "startedAt": String,
    "questionDifficulty": String,
    "duration": Number;
}
```

### Gets list of completed question titles by user

GET request to `/api/user/completed/:username`

### Gets number of questions completed by user for each difficulty

GET request to `/api/history/completed/difficultyCount/:username`

### Gets number of questions completed by user for each month

GET request to `/api/history/completed/monthCount/:username`

### Gets the experience points and level obtained by user

GET request to `/api/history/experience/:username`
