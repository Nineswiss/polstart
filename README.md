# Polstart
 Basic Node, Express, Mongo with Auth to get projects started fast.  

 Edit config/index.js to edit your JWT key and mongo db connection  
   
## Prerequisites
node  
mongodb

 ## Get Started
```cd polstart/api```  
   
```npm i```  
  
  create a '.env' file in '/api  
  in **.env**:    
  EMAIL_ADDRESS=your email provider address 
  EMAIL_PASSWORD=your email password   
  EMAIL_SERVICE=your email service ie 'gmail'
    
  In /api/config/index.js  
  Set up your database and App info


  ...then to run:  
  ```npm start```  
  or even better:  
   ```nodemon```
    

## Endpoints

Sign In endpoint:  
```http://localhost:8080/signin```  
  
Sign Up endpoint:  
```http://localhost:8080/signup```

  
Verify endpoint:  
```http://localhost:8080/verfiy/:id/:code```

  
Resend Verify endpoint:  
```http://localhost:8080/sendVerification```

  
Reset password endpoint:  
```http://localhost:8080/reset```

  
Validate Reset password endpoint:  
```http://localhost:8080/reset/:id/:code```

  
Update password endpoint:  
```http://localhost:8080/updatePassword```