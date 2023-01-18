FROM node:18

RUN npm install -g nodemon

# make the bikeApp-backend folder the current working directory
WORKDIR /bikeApp-backend

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json /bikeApp-backend/

# install project dependencies 
RUN npm install

# copy project files and folders to the current working directory (i.e 'bikeApp-backend' folder)
COPY . /bikeApp-backend/

EXPOSE 3003

CMD ['npm', 'start']