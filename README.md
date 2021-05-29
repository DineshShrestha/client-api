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
|1  |`/v1/user`                            |GET   |    DONE      | Yes       | Get user Info                                    |
|1  |`/v1/user`                            |POST  |    DONE      | No        | Create a user                                    |
|2  |`/v1/user/login`                      |POST  |    DONE      | No        | Verify user Authentication and return JWT        |
|3  |`/v1/user/reset-password`             |POST  |    DONE      | No        | Verify email and email pin to reset the password |
|4  |`/v1/user/reset-password`             |PATCH |    DONE      | No        | Replace with new                                 |
|1  |`/v1/user/logout`                     |Delete|    DONE      | Yes       | Delete user accessJWT                            |


### Ticket API Resources 

ALl the user API router follows `/v1/user/`

|#  | Routers                              |Verbs |   Progress   | Is Private|            Description                           |
|---|--------------------------------------|------|--------------|-----------|--------------------------------------------------|
|1  |`/v1/ticket`                          |GET   |    DONE      | Yes        | Get all ticket for the logined user             |
|2  |`/v1/ticket/{id}`                     |GET   |    DONE      | Yes        | Get ticket details                              |
|3  |`/v1/ticket`                          |POST  |    DONE      | Yes        | Create a new ticket                             |
|4  |`/v1/ticket{id}`                      |PUT   |    DONE      | Yes        | Update ticket detail ie. reply essage           |
|4  |`/v1/ticket/close-ticket/{id}`        |PATCH |    DONE      | Yes        | Update ticket status to close                   |
|4  |`/v1/ticket/{id}`                     |DELETE|    DONE      | Yes        | Delete a ticket                                 |

### Token API Resources 

ALl the tokens API router follows `/v1/tokens`

|#  | Routers                              |Verbs |   Progress   | Is Private|            Description                           |
|---|--------------------------------------|------|--------------|-----------|--------------------------------------------------|
|1  |`/v1/tokens`                          |GET   |    DONE      | Yes       | Get a fresh access JWT                           |
