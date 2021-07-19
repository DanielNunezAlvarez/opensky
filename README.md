# opensky

This project deploys a full-stack application that reads data from the Opensky Network API and visualize it in a web user interface.

## Deploy with Docker

### Build

To build this application run `docker-compose build`.

### Run

To run the application run `docker-compose up`, then navigate to `http://localhost:4200/` to visualize the UI.

## Repository content

### Backend

The backend consists in a microservice that encapsulates a call to an external API. These API retrieves flight data from `https://opensky-network.org/api/flights/arrival`.

### Frontend

The frontend project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.8.

It generates a single web user interface that shows:

  1. A dropdown list with the airports available to choose. The list of airports is contained in `/frontend/src/app/home/worldAirports.json`.
  2. A date time picker to choose the begin date and the end date.
  3. A table with the results retrieved from the API call. The table has pagination and its columns can be sorted and hidden/shown. It is possible to remove or add new data to the table in a very easy way.
  4. A interactive map with the location of the arrival airport and all departure aiports.

The frontend allows the possibility of adding additional pages that can be reached through the main menu.

### Docker

The file `docker-compose.yml` deploys a Docker container with one service for the API backend and one service for the Angular frontend. These services are based on the images created in the respective `Dockerfile`. 
