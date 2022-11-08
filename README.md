# CS3219-AY22-23-Project-Skeleton

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

## User Service
1. Rename `.env.sample` file to `.env`.
2. Create a Cloud DB URL using Mongo Atlas.
3. Enter the DB URL created as `DB_CLOUD_URI` in `.env` file.
4. Install npm packages using `npm i`.
5. Run User Service using `npm run dev`.

## Frontend
1. Install npm packages using `npm i`.
2. Run Frontend using `npm run dev`.
