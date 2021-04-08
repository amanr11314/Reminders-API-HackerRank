# Reminders API

## Data:
Example of a reminder data JSON object:
```
{
    "id": 2,
    "user": 1,
    "description": "Drink Coffee",
    "date": "2020-08-24T07:28:24.000Z"
}
```

## Project Specifications:
The model implementation is provided and read-only.

The task is to implement the REST service that exposes the /reminders endpoint, which allows for managing the collection of reminder records in the following way:

- POST request to /reminders:
    - creates a new reminder
    - expects a JSON reminder object without the id property as the body payload. You can assume that the given object is always valid.
    - adds the given reminder object to the collection of reminders and assigns a unique integer id to it. The first created reminder must have id 1, the second one 2, and so on.
    - the response code is 201, and the response body is the created reminder object

- GET request to /reminders:
    - return a collection of all reminders
    - the response code is 200, and the response body is an array of all reminders objects ordered by their ids in increasing order
    - optionally accepts query parameters user and after, for example /reminders?user=1&after=1598448504000. All these parameters are optional. In case they are present, only objects matching the parameters must be returned.
    - The query param `after` accepts the time in milliseconds(Epoch) and can be used to find all the reminders that have the date property value after the queried time.
    - HINT: Query for date in Sequelize can be done using the `Op.gte` operator. It accepts the date as an epoch integer, JS Date object or ISODate String.
    ```text
    { date: { [Op.gte] : VALUE} } 
    //Where VALUE can be one of the above mentioned types	
    ```

- GET request to /reminders/<id>:
    - returns a reminder with the given id
    - if the matching reminder exists, the response code is 200 and the response body is the matching reminder object
    - if there is no reminder with the given id in the collection, the response code is 404 with the response body having the text `ID not found`.

- DELETE,PUT, PATCH request to /reminders/<id>:
    - the response code is 405 because the API does not allow deleting or modifying reminders for any id value

You should complete the given project so that it passes all the test cases when running the provided unit tests. The project by default supports the use of the SQLite3 database.

## Environment 
- Node Version: ^12.18.2
- Default Port: 8000

**Read Only Files**
- `test/*`

**Commands**
- run: 
```bash
bash bin/env_setup && . $HOME/.nvm/nvm.sh && npm start
```
- install: 
```bash
bash bin/env_setup && . $HOME/.nvm/nvm.sh && npm install
```
- test: 
```bash
bash bin/env_setup && . $HOME/.nvm/nvm.sh && npm test
```
