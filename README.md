#CRM ticket system API
This api is a part of create CRM Ticket system with MERN stack from scratch tutorial series
Link for the series is 

## How to use
- run `git clone ...`
- run `npm start`

Note: Make sure you have nodemon installed in your system otherwise you can install as a dev dependencies in your project


## API resources

### User API Resources 

ALl the user API router follows `/v1/user/`

|#  | Routers                              |Verbs |   Progress   | Is Private|            Description                           |
|---|--------------------------------------|------|--------------|-----------|--------------------------------------------------|
|1  |`/v1/user/login`                      |POST  |    TODO      | No        | Verify user Authentication and return JWT        |
|2  |`/v1/user/reset-password`             |POST  |    TODO      | No        | Verify email and email pin to reset the password |
|3  |`/v1/user/reset-password`             |PATCH |    TODO      | No        | Replace with new                                 |
|4  |`/v1/user/{id}`                       |GET   |     TODO     | Yes       | Get users Info                                   |

### Ticket API Resources 

ALl the user API router follows `/v1/user/`

|#  | Routers                              |Verbs |   Progress   | Is Private|            Description                           |
|---|--------------------------------------|------|--------------|-----------|--------------------------------------------------|
|1  |`/v1/ticket`                          |GET   |    TODO      | Yes        | Get all ticket for the logined user             |
|2  |`/v1/ticket/{id}`                     |GET   |    TODO      | Yes        | Get ticket details                              |
|3  |`/v1/ticket`                          |POST  |    TODO      | Yes        | Create a new ticket                             |
|4  |`/v1/ticket{id}`                      |PUT   |    TODO      | Yes        | Update ticket detail ie. reply essage           |
|4  |`/v1/ticket/close-ticket/{id}`        |PUT   |    TODO      | Yes        | Update ticket detail ie. reply essage           |

### Token API Resources 

ALl the tokens API router follows `/v1/tokens`

|#  | Routers                              |Verbs |   Progress   | Is Private|            Description                           |
|---|--------------------------------------|------|--------------|-----------|--------------------------------------------------|
|1  |`/v1/tokens`                          |GET   |    DONE      | Yes       | Get a fresh access JWT                           |
