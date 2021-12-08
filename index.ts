'use strict';

import { Request, ResponseToolkit } from "@hapi/hapi";

const Hapi = require('@hapi/hapi');

const init=async()=>{
    const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

await server.register({
    plugin:require("hapi-geo-locate")
})

server.route([{
  method: 'GET',
  path: '/',
  handler: async (resquest:Request,h:ResponseToolkit) =>{

      return 'Hello World!';
  }
},
]);

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});
}

init();