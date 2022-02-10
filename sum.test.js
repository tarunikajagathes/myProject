const server = require('./sum.js'); 


beforeAll((done) => {
    server.events.on('start', () => {
        done();
    });
});


afterAll((done) => {
    server.events.on('stop', () => {
        done();
    });
    server.stop();
});

test('response with 200', async()=> {
    const options = {
        method: 'GET',
        url: '/'
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(200);
});

test('response with 201',async()=>{
    const options={
        method:'POST',
        url:'/user',
        payload:JSON.stringify({name:'abc',password:'123'})
    };
    const data=await server.inject(options);
    expect(data.statusCode).toBe(201);
})

test('data result should be invalid',async()=>{
    const options={
        method:'POST',
        url:'/user'
    };
    const data=await server.inject(options);
    expect(data.result).toBe('invalid');
})

test('response with 422',async()=>{
    const options={
        method:'POST',
        url:'/user'
    };
    const data=await server.inject(options);
    expect(data.statusCode).toBe(422);
})