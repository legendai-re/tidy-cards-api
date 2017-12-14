let common  = require('../common');
let server  = common.server;
let models  = common.models;
let chai    = common.chai;
let request = common.request;
let should  = common.should;
let assert  = common.assert;

describe('POST /auth/login', () => {
    it('it should make 401 error', (done) => {
        request(server)
            .post('/auth/login')
            .send({username: '', password: ''})
            .expect(400, done)
    });
});

describe('POST /auth/login', () => {
    it('it should make 401 error', (done) => {
        request(server)
            .post('/auth/login')
            .send({username: 'username', password: 'password'})
            .expect(401, done)
    });
});

describe('GET /auth/currentuser', () => {
    it('it should return empty object', (done) => {
        request(server)
            .get('/auth/currentuser')
            .expect(200, {}, done)
    });
});

describe('POST /auth/signup', () => {
    it('it should make 400 error', (done) => {
        request(server)
            .post('/auth/signup')
            .send({username: '', email: '', password: ''})
            .expect(400, done)
    });
});

describe('POST /auth/signup', () => {
    it('it should make 422 error', (done) => {
        request(server)
            .post('/auth/signup')
            .send({username: 'è3#dzqd', email: 'dqzdd.dd', password: 'dqzd44'})
            .expect(422, done)
    });
});

describe('POST /auth/signup', () => {
    it('it should create a user', (done) => {
        request(server)
            .post('/auth/signup')
            .send({username: 'test1', email: 'test1@test.com', password: 'test1'})
            .expect(200)
            .expect(response => {
                assert.equal(response.body.data.name, 'test1');
                assert.equal(response.body.data.username, 'test1');
                assert.equal(response.body.data.email, 'test1@test.com');
                assert.equal(response.body.data.local.password, '');
                common.testUsers.test1.data = response.body.data;
            })
            .end(done);
    });
});

describe('POST /auth/signup', () => {
    it('it should create a user', (done) => {
        request(server)
            .post('/auth/signup')
            .send({username: 'test2', email: 'test2@test.com', password: 'test2'})
            .expect(200)
            .expect(response => {
                assert.equal(response.body.data.name, 'test2');
                assert.equal(response.body.data.username, 'test2');
                assert.equal(response.body.data.email, 'test2@test.com');
                assert.equal(response.body.data.local.password, '');
                common.testUsers.test2.data = response.body.data;
                common.testUsers.test2.cookies = response.headers['set-cookie'].pop().split(';')[0];
            })
            .end(done);
    });
});

describe('POST /auth/signup', () => {
    it('it should make 422 error because username and email already used', (done) => {
        request(server)
            .post('/auth/signup')
            .send({username: 'Test2', email: 'Test2@test.com', password: 'test2'})
            .expect(422, done);
    });
});

describe('GET /auth/currentuser', () => {
    it('it should return the currentuser', (done) => {
        let req = request(server).get('/auth/currentuser');
        req.cookies = common.testUsers.test2.cookies;
        req.expect(200)
        .expect(response => {
            assert.equal(response.body.data.name, 'test2');
            assert.equal(response.body.data.username, 'test2');
            assert.equal(response.body.data.email, 'test2@test.com');
            assert.isUndefined(response.body.data.local.password);
        })
        .end(done);
    });
});

describe('GET /auth/logout', () => {
    it('it should logout test2', (done) => {
        let req = request(server).get('/auth/logout');
        req.cookies = common.testUsers.test2.cookies;
        req.expect(200, done);
    });
});

describe('GET /auth/currentuser', () => {
    it('it should return nothing', (done) => {
        let req = request(server).get('/auth/currentuser');
        req.cookies = common.testUsers.test2.cookies;
        req.expect(200)
        .expect(response => {
            assert.notExists(response.body.data);
        })
        .end(done);
    });
});

describe('POST /auth/login', () => {
    it('it should login test1', (done) => {
        request(server)
            .post('/auth/login')
            .send({username: 'test1', password: 'test1'})
            .expect(200)
            .expect(response => {
                assert.equal(response.body.data.username, 'test1');
                assert.equal(response.body.data.email, 'test1@test.com');
                assert.equal(response.body.data.local.password, '');
                common.testUsers.test1.cookies = response.headers['set-cookie'].pop().split(';')[0];
            })
            .end(done);
    });
});

describe('PUT /auth/password/update', () => {
    it('it should make 400 error', (done) => {
        setTimeout(() =>{
            let req = request(server).put('/auth/password/update');
            req.cookies = common.testUsers.test1.cookies;
            req.send({password: '', newPassword: ''})
            .expect(400)
            .end(done);
        }, 1000)
    });
});

describe('PUT /auth/password/update', () => {
    it('it should make 401 error', (done) => {
        setTimeout(() =>{
            let req = request(server).put('/auth/password/update');
            req.cookies = common.testUsers.test1.cookies;
            req.send({password: 'hello', newPassword: 'hello'})
            .expect(401)
            .end(done);
        }, 1000)
    });
});

describe('PUT /auth/password/update', () => {
    it('it should update the password', (done) => {
        setTimeout(() =>{
            let req = request(server).put('/auth/password/update');
            req.cookies = common.testUsers.test1.cookies;
            req.send({password: 'test1', newPassword: 'test1updated'})
            .expect(200)
            .end(done);
        }, 1000)
    });
});

describe('PUT /auth/password/update', () => {
    it('it should re update the password', (done) => {
        setTimeout(() =>{
            let req = request(server).put('/auth/password/update');
            req.cookies = common.testUsers.test1.cookies;
            req.send({password: 'test1updated', newPassword: 'test1'})
            .expect(200)
            .end(done);
        }, 1000)
    });
});