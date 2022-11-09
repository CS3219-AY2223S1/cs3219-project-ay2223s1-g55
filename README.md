### Overview

LeetWarriors is an coding collaboration platform and peer matching system where students can find peers to practice whiteboard style interview questions together. 

## Running Locally

Navigate to the following individual services to set up and run them locally:
1. [User Service](./user-service/)
2. [Matching Service](./matching-service/)
3. [Communication Service](./communication-service/)
4. [Editor Service](./editor-service/)
5. [Question Service](./question-service/)
6. [History Service](./history-service/)

Finally, start running the frontend service by following this [guide](./frontend/).

The application should start locally at http://localhost:3000.

## Production Deployments
frontend url: https://frontend-lemon-one.vercel.app/signup/

user-service url: https://user-service-q563p73okq-as.a.run.app/

matching-service url: https://matching-service-q563p73okq-as.a.run.app/

question-service url: https://question-service-q563p73okq-as.a.run.app/

history-service url: https://history-service-q563p73okq-as.a.run.app/

communication-service url: https://communication-service-q563p73okq-as.a.run.app/

editor-service url: https://editor-service-q563p73okq-as.a.run.app/

## Environments:
1. Production
  - Runs on production endpoints (Cloud Run deployments), production DB
2. Test
  - Runs on production endpoints, production-test DB
3. Development
  - Runs on local endpoints (localhost), local DB
  

## Final Report
Please refer to the [report folder](./docs/55-ProjectReport.pdf) for our final report.
