# Amazon-like Ecommerce Project (Express, MongoDB)

## Description

A fullstack Amazon-like ecommerce webisite using Express.js and MongoDB.

Hosted at: https://amazon-like-ecommerce-project-express.onrender.com

(takes ~30sec to spin up after after inactivity due to free hosting)

## Features

- Shopping cart
- User account: click [username] (top right)
  - Update info
  - Order history
    - Order details: click "DETAILS" (right)
      - Pay unpaid orders.
- Order
  - Shipping
  - Payment
    - Updates to paid on payment.
    - PayPal API (Stripe not supported)
      - Sandbox account
        - email: sb-5kmkv37730207@personal.example.com
        - password: x<K{8S]]
  - Place order
    - Creates the order and clears cart, allowing you to pay later (Order details).

## Frameworks / Libraries / Technologies

- Express
- MongoDB
- Webpack
- Babel
- Postman
- JWT
- PayPal SDK

## Purpose

Refresh knowledge of fullstack web-development.

## Resources

https://www.youtube.com/playlist?list=PLeh2GWv22bmSkMEpSv5Wme56XVpKG1Tr5 - Admin Dashboard

## Tickets

- Prevent adding unavailable items to cart.
- Form validation (front and backend)
  - Re-enter password should be required to submit.
- Format date paid.
- Personalize a bit.

## Notes

- --watch flag > Nodemon
- package.json, type: module > babel (backend) (for ES6)
- dialog tag / popover > manual modals (show/hide-Loading, showMessage)
- PayPal API has changed.
- Passwords not hashed.

### Dev

- Front end testing is served on a different port, meaning it does not use the express "/" and public routes.

### Production

- Add env to render.
  - Render can't read env from process.env, but can from dotenv.
- Change front end config before building to make requests to hoster.
- Responses don't return statusText on render, so I switched to status.
