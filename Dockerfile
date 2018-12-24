FROM node:10.14.1

#OS Dependencies
RUN apt-get update && apt-get install -y apt-utils cron

VOLUME "/usr/src/app"

WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
RUN npm install --silent
COPY . /usr/src/app

ARG GITHUB_API_KEY
ENV GITHUB_API_KEY=${GITHUB_API_KEY}

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG ES_HOST=localhost
ENV ES_HOST=${ES_HOST}

ARG ES_PORT=9200
ENV ES_PORT=${ES_PORT}

ARG ES_URI=http://elastic:changeme@localhost:9200
ENV ES_URI=${ES_URI}

ARG ES_USER=elastic
ENV ES_USER=${ES_USER}

ARG ES_PASSWORD=changeme
ENV ES_PASSWORD=${ES_PASSWORD}

EXPOSE 100
