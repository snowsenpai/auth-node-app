# node-auth-api <br/>
Simple nodejs authentication api<br/>
Data generated is stored as an array of objects in a json file. This isn't a secure approach, feel free to clone the project and integrate any database.<br/>

# API Endpoints and HTTP Methods<br/>
API expects request body to have certain field(s) which will be used to validate, authorize and authenticate each request to the target endpoint.<br/>

## POST: '/signup'<br/>
Creates a new user, will return an error message if validation fails<br/>
Request body:<br/>
```
{  
    "email":"",  
    "password":"",  
    "confirmPassword":"",  
    "firstName":"",  
    "lastName":"",  
    "address":""  
}  
```

## POST: '/login'<br/>
Generates a `token` for existing user which is used to authenticate and authorize subsequent requests<br/>
Will return an error message if validation fails or user does not exist<br/>
Request body:<br/>
```
{  
    "email":"",  
    "password":""  
}  
```

## GET: '/hello' <br/>
Returns the details of the user making the request, does not return user's password<br/>
Only accessible to an authenticated user with role `USER`<br/>
Request body:<br/>
```
{  
    "token":""  
}  
```

## POST: '/update_user'<br/>
Updates the `address` field of the user making the request<br/>
Only accessible to an authenticated user with role `USER`<br/>
Request body:<br/>
```
{  
    "token":"",  
    "address":""  
}  
```

## GET: '/all_users'<br/>
Returns all users that have signed up, without their passwords<br/>
Only accessible to an authenticated admin with role `ADMIN`<br/>
Request body:<br/>
```
{  
    "token":""
}  
```

#### To Run this project Clone it and install modules using<br/>
```
npm install  
```

Then Create .env file add `JWT_SIGN` and `ADMIN_EMAIL` Variable and specify Value.<br/>
Value specified to `ADMIN_EMAIL` will be used to add `ADMIN` role to a user<br/>
That's it. You are ready to go. To execute this project just type:<br/>
```
npm start  
```

Enjoy...!