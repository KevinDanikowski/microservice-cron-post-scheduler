FROM node

RUN mkdir -p /usr/src/cron-post-scheduler
WORKDIR /usr/src/cron-post-scheduler

COPY package.json /usr/src/cron-post-scheduler
COPY .env /usr/src/cron-post-scheduler
RUN npm install
COPY . /usr/src/cron-post-scheduler

EXPOSE 3020
RUN ["npm", "start"]