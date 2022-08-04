# Readme.md

## Authentication API

programming language : node JS
framework : express JS
author : Oceanbal

## Detail Project

The API authentication process validates the identity of the client attempting to make a connection by using an authentication protocol.
In this project Iam using JWT Token for validation.
why used JWT ? because JWT create a secure encodes token, sterilizes, and adds a signature with a secret key. And JWT have a expires time that supports our tokens are not always alive.

Database : NO SQL (MongoDB)
Why use MongoDB ? because mongodb is simple databse for beginer and flexible schema makes it easy to evolve and store data in a way that is easy for programmers to work with.

## End Points API :

### /api/auth/register => for register user

    this endpoint required body request username(unique) and password

### /api/auth/login => for login user

    this endpoint required body request username and password

### /api/auth/change-password

    this endpoint required body request newpassword and header authorization access token

### /api/auth/refresh-token

    this endpoint required header request authorization refresh token to get new access token and refresh token
