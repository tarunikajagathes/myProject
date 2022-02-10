const Hapi = require('@hapi/hapi');


const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        return 'Hello World!';
    }
});

server.route({
    method:'POST',
    path:'/user',
    handler:(request,h)=>{
          if(request.payload&&request.payload.password){
              return h.response('Successfully created!').code(201);
          }
          else{
              return h.response('invalid').code(422);
          }
    }
})


const init = async () => {
    await server.start();
    console.log('Server running on %ss', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();

module.exports = server;