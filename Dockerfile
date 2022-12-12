FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm cache clean -f 

RUN npm install 

RUN npm install redis

COPY . .

RUN npm install -g nodemon


CMD ["nodemon"]

EXPOSE 8000