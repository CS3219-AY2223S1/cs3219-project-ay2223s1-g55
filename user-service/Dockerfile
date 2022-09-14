FROM node:16

# Create app directory
WORKDIR /usr/src/app/user-service

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY user-service/package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY user-service .

EXPOSE $PORT
CMD [ "node", "index.js" ]
