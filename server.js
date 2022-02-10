'use strict';

const Hapi = require('@hapi/hapi');
const boom=require('@hapi/boom');
const Joi=require('joi')
const path = require('path');
const fs=require('fs')
 
const users={
    tarunika:{
        username:'tarunika',
        password:'user',
        id:0,
        name:'Tarunika'
    }
};

const validate =async(request,username,password,h)=>{
    if(!users[username]){
        return {isValid:false}
    }
    const user =users[username];

    if(user.password==password){
        return {isValid:true,credentials:{id:user.id,name:user.name}};
    }
    else{
        return {isValid:false}
    }
}

const init = async () => {

    const server = Hapi.server({
        port: 5500,
        host: 'localhost'  //we can add routes:{files:{relativeTO:}} to make use of all routes
     });

     server.log(['test', 'error'], 'Test event');

    await server.register([{
        plugin:require("hapi-geo-locate"),
        options:{
            enabledByDefault:true                 
        }
    },
    {
        plugin:require("@hapi/basic")
    },
    {
        plugin:require("@hapi/cookie")
    },
    {
        plugin:require("@hapi/inert")
    }])

    const handleFileUpload = file => {
        return new Promise((resolve, reject) => {
          fs.writeFile('./upload/test.png', file, err => {
             if (err) {
              reject(err)
             }
             resolve({ message: 'Upload successfully!' })
          })
        })
       }

    const add = function (x, y) {

        return x + y;
    };

    server.method({
        name: 'add',
        method: add,
        options: {}
    });
    console.log(server.methods.add(1,2));


    
    server.auth.strategy('login','basic',{validate});
    server.auth.strategy('cookielogin','cookie',{
        cookie:{
            name:'session',
            password:'useruseruseruseruseruseruseruseruseruser',
            isSecure:false,
        },
        redirectTo:'/login',
        validateFunc:async(request,session)=>{
            if(session.name==='tarunika'){
                return {valid:true}
            }
            else{
                return {valid:false}
            }

        }
    })
    //server.auth.default('login')       -->login to all the pages

    server.route([{
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello World!';
        }
    },
    {
        method:'POST',
         path:'/submit',
         
        handler:async(request,h)=>{
           // request.headers['content-type'] = 'application/json';
            const data=request.payload;
           // console.log(data.file);
            if(data.file){
                const name = data.file.hapi.filename;
            const path = __dirname+"/uploads/"+name;
            const file = fs.createWriteStream(path);
            file.on('error', (err) => console.error("error",err));

          await  data.file.pipe(file);

         await   data.file.on('end', (err) => { 
                const ret = {
                    filename: data.file.hapi.filename,
                    headers: data.file.hapi.headers
                }
                return JSON.stringify(ret);
            })
        }
        else{
            return "hello"
        }
        return 'ok';
        
    },
    options: {
        payload: {
            output: 'stream',
            parse: true,
            multipart: true   
        }
            }
    },
    {
        method:'GET',
        path:'/file',
        handler:(request,h)=>{
            return h.file("./welcome.html")
        },
        options:{
            files:{
                relativeTo:path.join(__dirname,'static')
            }
        }
    },
    {
        method:'GET',
        path:'/login',
        handler:(request,h)=>{
            const name=request.auth.credentials.name;
            request.cookieAuth.set({username:name});
            return `Welcome to restricted page ${name}!`
        },
        options:{
            auth:'login'
        }
    },
    {
        method:'GET',
        path:'/logout',
        handler:(request,h)=>{
            request.cookieAuth.clear();
            return boom.unauthorized("Successfully logged out!!");
        }
    },
    {
        method:'GET',
        path:'/location',
        handler:(request,h)=>{
            return request.location;
        }
    },
    {
        method:'GET',
        path:'/users/{user?}',        /* ? --->  It is not manditory to give user  */
        handler:(request,h)=>{
            if(request.params.user){
                return `Hello user ${request.params.user}!`;
            }
            else{
                return `Hello Stranger!`;
            }

            //h.redirect('/')        ----> redirects
            
        },
        options:{
            validate:{
                params:Joi.object({
                user:Joi.string().min(3).max(15)
                })
            }
        }
    },
    {
        method:'GET',
        path:'/{any*}',     //-->If url is invalid
        handler:(request,h)=>{
            return 'Page does not exists';
        }
    }]);


    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();

