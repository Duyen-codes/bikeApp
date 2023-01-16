# Solita Dev Academy pre-assignment

Application for displaying data from journeys made with city bikes in the Helsinki Capital area.

## Project Description

## Tech Stack

Since there are no limits to which technologies to use, I have decided to go with MERN stack since I'm mostly familiar with and have really enjoyed working with JavaScript.

### Database

During the time of studies in Business College Helsinki, I was equipped with fundamentals of both relational databases (MariaDB, MySQL) and non-relational database (MongoDB). But I've gained more hands-on experience by building several projects with MongoDB so for this particular project, I still choose MongoDB atlas as cloud database.

### Frontend: ReactJS

React is my first JavaScript framework that I have picked up and built several web projects with it.

- React
- axios
- Material UI

### Backend: NodeJS + Express

My first experience with backend development was with PHP when I was studying fullstack development program. But since I've seen that NodeJS is more of in demand and it always appears in job search with React so I self-taught NodeJS and Express by doing personal projects and taking an online course by University of Helsinki. I have found it quite nice to work with since I always want to go for fullstack development. I'm also interested in Java and C#/.NET so I definitely want to extend my tech skills with other technologies in the future.

- nodejs
- express
- mongodb
- cors
- dotenv
- needle
- fastcsv
- csvtojson
- node-fetch

## Installation

- clone the repo
- go to bikeApp-backend directory

  - install all up-to-date dependencies of the project defined in package.json with running the below commands in the bikeApp-backend root directory

  ```shell
    npm install
  ```

  ```shell
  npm run dev
  ```

- go to bikeApp-frontend directory
  - install dev dependencies by running
  ```shell
  npm install
  ```
  - start the app
  ```shell
  npm start
  ```

## App features

### Home

- [img will be here]
- description

### Data import

data is fetch from provided links and inserted into cloud database hosted on MongoDB Atlas

As required:
journeys that lasted for less than 10 seconds are not imported
journeys that covered distances shorter than 10 meters

### Journey list view

pagination was implemented for listing journeys
[add image here]

### Station list

all stations are fetched and displayed (457 items in total)

- pagination
- searching
  [image here]

### Single Station view

all recommended features are implemented:

- [x] Station name
- [x] Station address
- [x] Total number of journeys starting from the station
- [x] Total number of journeys ending at the station

some of the additional features are implemented:

- [x] Station location on the map
- [x] The average distance of a journey starting from the station
- [x] The average distance of a journey ending at the station
- [x] Top 5 most popular return stations for journeys starting from the station
- [x] Top 5 most popular departure stations for journeys ending at the station
      [image here ]

### Extra features

- REST API endpoints for storing new journeys data and new bicycle stations were implemented.
- UI for adding journeys and bicycle stations were created. Unfortunately because of the limited database quota, these adding features and API endpoints could not be tested so the code blocks when the form is submitted is commented out for the time being.

## TODO

- Running backend in Docker
- Running backend in Cloud
- Implement E2E tests

## Conclusion
