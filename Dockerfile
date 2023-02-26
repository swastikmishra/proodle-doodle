FROM node:16

RUN yarn global add nodemon

RUN yarn global add ts-node typescript

WORKDIR /app