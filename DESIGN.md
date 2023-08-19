# Design Document

## All Users

- GET `/profile`

## Rides

- GET `/rides/:id` ride info by ID
- GET `/rides` all rides by the current customer
- POST `/rides` request a new ride
- PUT `/rides` update ride status
- DELETE `/rides` cancels a ride

## Driver Specific

- GET `/drivers` list all drivers
- GET `/drivers/:id` driver by id

### Self

- GET `/account/balance` account balanced
