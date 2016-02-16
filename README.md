# Lunch Finder [![Build Status](https://travis-ci.org/Budmore/node-lunch-finder.svg?branch=master)](https://travis-ci.org/Budmore/node-lunch-finder)


Find random place for the lunch.



## Endpoints

#### Slack commands

- **<code>POST</code> /command**
```
Slack commands:
  /lunch zztop
  /lunch random
```


#### Places

- **<code>POST</code> /places-to-eat**
- **<code>GET</code> /places-to-eat**
- **<code>GET</code> /places-to-eat/:id**
- **<code>PUT</code> /places-to-eat/:id**
- **<code>DELETE</code> /places-to-eat/:id**


## Build & development
Create config.json (follow by the config.example.json)

```
npm install
npm start

```

Run `npm install` for building and `npm start` for preview.
Do not commit your config.json file to any repo!


## Testing
```
npm test
npm run tdd
npm run coverage

```

Running `npm test` or `npm run tdd` will run the unit tests with Mocha and Chai.
`npm run coverage` will create coverage report.

