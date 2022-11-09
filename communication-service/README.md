# Communication Service

## Overview

Handles messaging between 2 users in a collaborative session.

# Set Up Guide

## Navigate to the `communication-service` directory

Run `cd communication-services` from the root of the project.

## Installing Dependencies

Run `npm install` to install dependencies

## Environment variables

Ensure that environment variables are set.

## Running Locally

1. After installing dependencies, run `npm run dev` to start the application.
2. The service should be started on http://localhost:8005.

## Running Tests

Run `npm run test` to execute tests. Tests depend on the deployment URL in the environment variables.

## Endpoints

### Get messages belonging to a session

GET request to `/api/communication/message/:sessionId`

### Creates a message to send the session

POST request to `/api/communication/message`

Example request body:
```
{
	"sessionId": String,
    "senderName": String,
    "senderId": String,
}
```
