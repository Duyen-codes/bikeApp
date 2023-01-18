FROM node:18

RUN npm install -g nodemon

WORKDIR /bikeApp-backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3003

CMD ['npm', 'start']