# Blogly
A web application made using MERN Stack.

## Description

In this project I build REST API (Representational State Transfer) for communication between client and server instead of rendering views from the server to client.
For authentication I used JWT token (JSON Web Tokens). Also used web sockets to add real time web services in my project.

## Features

1. ### Authentication of the user (with JWT Tokens) with proper validation checks.
2. ### Added Real-time services using Web Sockets.
3. ### Create, edit and delete Posts.

## Languages & Tools Used 

### MERN 

## Screenshots

![image](https://user-images.githubusercontent.com/67829453/86776901-353bb200-c076-11ea-9bb0-99a1634e6ab2.png)
![image](https://user-images.githubusercontent.com/67829453/86777020-4dabcc80-c076-11ea-8e02-f59d52ce8092.png)
![image](https://user-images.githubusercontent.com/67829453/86777125-661be700-c076-11ea-923d-004b7eac88da.png)
![image](https://user-images.githubusercontent.com/67829453/86777221-79c74d80-c076-11ea-9205-0a45aabb06bd.png)

## Setup

To run the project go to the terminal and write the below code in both client and server windows 

```
npm start
```

Install all the dependencies needed to run the project
1. ### Client
```
npm install
npm install --save socket.io
```

2. ### Server
```
npm install --save bcryptjs body-parser express express-validator jsonwebtoken mongoose multer socket.io uuid
```

I have used Mongodb Atlas for database storage

See the below link to setup Atlas

<a href="https://docs.atlas.mongodb.com/getting-started/">Click Here</a>

# Documentation

<a href="https://nodejs.org/en/docs/">Nodejs Docs</a><br/>
<a href="https://mongoosejs.com/docs/api.html/">Mongoose Docs</a><br/>
<a href="https://docs.mongodb.com/">Mongodb Docs</a><br/>
<a href="https://socket.io/docs/">Web Sockets</a><br/>
<a href="https://jwt.io/introduction/">JSON Web Tokens</a><br/>

