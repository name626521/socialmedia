FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install 

COPY . .

RUN npm run build

CMD ["node", "build/server.js"]

EXPOSE 8000