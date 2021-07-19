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
