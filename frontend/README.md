This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Getting Started

## Navigate to the `frontend` directory

Run `cd frontend` from the root of the project.

## Installing dependencies

Run `npm install` to install dependencies.

## Running locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
You will automatically be directed to the login page at [http://localhost:3000/login](http://localhost:3000/login)

Register for an account at [http://localhost:3000/signup](http://localhost:3000/signup), and login at [http://localhost:3000/login](http://localhost:3000/login).

After successful login, it should show a graph of the questions completed thus far.

Questions will be listed at the bottom of the page, with the ability to filter based on difficulty and search for questions based on title.

## Pages

The following pages are available, protected pages require frontend authorization:
* /dashboard **(Protected)**  
    A dashboard page where users can view their progress and a list of questions available throughout the application.

* /settings **(Protected)**  
    A settings page where users can change their passwords or delete their account.

* /match **(Protected)**  
    A match page where users can request for a match with other users based on the difficulty chosen.

* /learning-pathway **(Protected)**  
    A page where users can see their past sessions, as well as completed questions and their progress. An experience bar is provided which will be filled as questions are completed.


* /questions/:title, where title is a [slug](https://itnext.io/whats-a-slug-f7e74b6c23e0).  
A dynamically routed page which displays the entire question, including a comment section used for discussion.  
e.g. Two Sum -> /questions/two-sum


# Deployed on Vercel

Our frontend has been [deployed](https://frontend-git-main-cs-3219-g55.vercel.app/) on [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
