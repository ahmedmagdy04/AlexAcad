# AlexAcad Backend

Base URL:
http://localhost:5000/api

## Authentication

POST /auth/register

Request:
{
  "name": "",
  "email": "",
  "password": "",
  "department": "",
  "level": "",
  "cumulativeGPA": 0,
  "warnings": 0
}

Response:
{
  "token": "",
  "user": {}
}

--------------------------------

POST /auth/login

Request:
{
  "email": "",
  "password": ""
}

Response:
{
  "token": "",
  "user": {}
}

--------------------------------

GET /profile

Headers:
Authorization: Bearer TOKEN

Response:
{
  "user": {}
}

--------------------------------

PUT /profile

Headers:
Authorization: Bearer TOKEN

Request:
{
  ...
}

--------------------------------

POST /chat/send

Headers:
Authorization: Bearer TOKEN

Request:
{
  "message": ""
}

Response:
{
  "reply": "",
  "courses": [],
  "chat": {}
}

--------------------------------

GET /chat/courses

Headers:
Authorization: Bearer TOKEN

Response:
{
  ...
}

--------------------------------

POST /documents/certificate

Headers:
Authorization: Bearer TOKEN

Body:
form-data

certificate: PDF

Response:
{
  "success": true,
  "text": ""
}