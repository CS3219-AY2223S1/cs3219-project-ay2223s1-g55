# Question Service

## Overview

Question service leverages [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/) as a HTML Parser/Web Scraper, used on [this webpage](https://bishalsarang.github.io/Leetcode-Questions/out.html). The HTML parsed is then stored as a string in our database, using [html-react-parser](https://github.com/remarkablemark/html-react-parser) to convert the HTML string to DOM elements.

On top of that, it provides an **additional** comment/discussion section, which is meant to act as a discussion space for users to discuss potential solutions or give insights.

# Set Up Guide

## Navigate to the `question-service` directory

Run `cd question-service` from the root of the project.

## Installing Dependencies

Run `npm install` to install dependencies

## Running Locally

1. After installing dependencies, run `npm run dev` to start the application.
2. The service should be started on http://localhost:8002.

## Running Tests

Run `npm run test` to execute tests.

# Endpoints

## Getting all existing questions
**GET** request to http://localhost:8002/api/question/question.

## Getting a question based on the title
**GET** request to http://localhost:8002/api/question/question/:title

Example:  
**Title**: Two Sum  
**Endpoint**: http://localhost:8002/api/question/question/two-sum

## Adding a new question to the database
**POST** request to http://localhost:8002/api/question/question

Example request body:
```js
{
    title: 'Title',
    description: 'Description',
    difficulty: 'Easy'
}
```

## Adding a new comment to a question
**POST** request to http://localhost:8002/api/question/question/:title

Example:  
**Title**: Two Sum  
**Endpoint**: http://localhost:8002/api/question/question/two-sum  
**Request body**:
```js
{
    user: 'User',
    comment: 'Comment'
}
```
