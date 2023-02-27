FROM node:16

RUN yarn global add nodemon

RUN yarn global add ts-node typescript

RUN yarn global add pm2

RUN pm2 install ts-node typescript

WORKDIR /app
