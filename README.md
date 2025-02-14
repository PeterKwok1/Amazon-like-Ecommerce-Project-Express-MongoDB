# Amazon-like Ecommerce Project (Express, MongoDB)

## Description

A fullstack Amazon-like ecommerce webisite using Express.js and MongoDB.

link: (warning, spin up time, ~30sec, free webhosting)

Other packages/technologies:

- Webpack
- Babel
- jwt
- Prettier
- ESlint

Features ... workflow

- PayPal API
  - Sandbox account
    - email: sb-5kmkv37730207@personal.example.com
    - password: x<K{8S]]
- Profile
  - Order history
  - Order details

## Purpose

Refresh knowledge of fullstack web-development basics.

## Resources

https://www.youtube.com/playlist?list=PLeh2GWv22bmSkMEpSv5Wme56XVpKG1Tr5 - Admin Dashboard

## Tickets

- prevent adding unavailable items to cart
- form validation
  - re-enter password should be required to submit
  - backend
- format date paid
- Personalize a bit
- spacing
- ommitted admin dashboard for timely application

## Notes

- --watch flag > Nodemon
- package.json, type: module > babel (backend) (for ES6)
- dialog tag / popover > manual modals
- paypal api has changed
- tutorial doesn't hash passwords

### Dev

- front end testing is served on a different port, meaning it does not use the express / and public routes.

### Production

- render requires env
- render can't read env from process.env, but it will from dotenv
- rebuild front end config to make requests to hoster
- for some reason, responses don't return statusText, so I'm using status
