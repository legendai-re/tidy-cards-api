let common  = require('../common');
let server  = common.server;
let models  = common.models;
let chai    = common.chai;
let request = common.request;
let should  = common.should;
let assert  = common.assert;

let invalidUsernames = ['a', 'test2', 'TeSt2', 'é*/dqdq', 'tidycards', "&=)éà'çéà\"'"];
let validUsernames = ['Hello', 'test-123-test', 'CaMarche_Bien', '47856321'];

let invalidEmails = ['a', 'hello.com', 'hello@hello', '@hello.com'];
let validEmails = ['test@test.com', 'test.test@test.com', 'test.test@test.test.test'];

describe('GET /api/users/test', () => {
    it('it should make 404 error', (done) => {
        request(server)
            .get('/api/users/test')
            .expect(404, done)
    });
});

describe('GET /api/users/:id', () => {
    it('it should make get user test1 with ID', (done) => {
        request(server)
            .get('/api/users/' + common.testUsers.test1.data._id)
            .expect(200)
            .expect(response => {
                assert.equal(response.body.data.username, 'test1');
            })
            .end(done);
    });
});

describe('GET /api/users/:username', () => {
    it('it should make get user test1 with username', (done) => {
        request(server)
            .get('/api/users/' + common.testUsers.test1.data.username)
            .expect(200)
            .expect(response => {
                assert.equal(response.body.data.username, 'test1');
            })
            .end(done);
    });
});

describe('GET /api/users/:email', () => {
    it('it should make get user test1 with email', (done) => {
        request(server)
            .get('/api/users/' + common.testUsers.test1.data.email)
            .expect(200)
            .expect(response => {
                assert.equal(response.body.data.username, 'test1');
            })
            .end(done);
    });
});

describe('PUT /api/users/test', () => {
    it('it should make 401 error', (done) => {
        request(server)
            .put('/api/users/test')
            .expect(401, done)
    });
});

describe('PUT /api/users/:id', () => {
    it('it should update name, language and bio of user test1', (done) => {
        let req = request(server).put('/api/users/'+common.testUsers.test1.data._id);
        req.cookies = common.testUsers.test1.cookies;
        req.send({name: 'Test 1', bio: 'I\'m test1', language: 'fr'})
        req.expect(200)
        .expect(response => {
            assert.equal(response.body.data.name, 'Test 1');
            assert.equal(response.body.data.bio, 'I\'m test1');
            assert.equal(response.body.data.username, 'test1');
            assert.equal(response.body.data.email, 'test1@test.com');
            assert.equal(response.body.data.language, 'fr');
        })
        .end(done);
    });
});

function tryUpdateInvalidUsername(invalidUsername){
    describe('PUT /api/users/:id', () => {
        it('it should try to update username and return error 422', (done) => {
            let req = request(server).put('/api/users/'+common.testUsers.test1.data._id);
            req.cookies = common.testUsers.test1.cookies;
            req.send({username: invalidUsername})
            req.expect(422)
            .end(done);
        });
    });
}

for(let i in invalidUsernames)
    tryUpdateInvalidUsername(invalidUsernames[i])

describe('PUT /api/users/:id', () => {
    it('it should update username', (done) => {
        let req = request(server).put('/api/users/'+common.testUsers.test1.data._id);
        req.cookies = common.testUsers.test1.cookies;
        req.send({username: 'test1Updated'});
        req.expect(200)
        .expect(response => {
            assert.equal(response.body.data.username, 'test1Updated');
        })
        .end(done);
    });
});

describe('PUT /api/users/:id', () => {
    it('it should try to update email and return error 422', (done) => {
        let req = request(server).put('/api/users/'+common.testUsers.test1.data._id);
        req.cookies = common.testUsers.test1.cookies;
        req.send({email: 'hello'});
        req.expect(422)
        .end(done);
    });
});

describe('PUT /api/users/:id', () => {
    it('it should try to update email and return error 422', (done) => {
        let req = request(server).put('/api/users/'+common.testUsers.test1.data._id);
        req.cookies = common.testUsers.test1.cookies;
        req.send({email: common.testUsers.test2.data.email});
        req.expect(422)
        .end(done);
    });
});

describe('PUT /api/users/:id', () => {
    it('it should update email', (done) => {
        let req = request(server).put('/api/users/'+common.testUsers.test1.data._id);
        req.cookies = common.testUsers.test1.cookies;
        req.send({email: 'test1Updated@test.com'});
        req.expect(200)
        .expect(response => {
            assert.equal(response.body.data.email, 'test1updated@test.com');
        })
        .end(done);
    });
});

describe('GET /api/users/:id', () => {
    it('it should get user test1 updated', (done) => {
        let req = request(server).get('/api/users/'+common.testUsers.test1.data._id);
        req.expect(200)
        .expect(response => {
            assert.equal(response.body.data.name, 'Test 1');
            assert.equal(response.body.data.bio, 'I\'m test1');
            assert.equal(response.body.data.username, 'test1Updated');
            assert.equal(response.body.data.email, 'test1updated@test.com');
        })
        .end(done);
    });
});

// set default name
describe('PUT /api/users/:id', () => {
    it('it should update name, language and bio of user test1', (done) => {
        let req = request(server).put('/api/users/'+common.testUsers.test1.data._id);
        req.cookies = common.testUsers.test1.cookies;
        req.send({name: 'test1'});
        req.expect(200)
        .end(done);
    });
});

// set default username
describe('PUT /api/users/:id', () => {
    it('it should update username', (done) => {
        let req = request(server).put('/api/users/'+common.testUsers.test1.data._id);
        req.cookies = common.testUsers.test1.cookies;
        req.send({username: 'test1'});
        req.expect(200)
        .end(done);
    });
});

// set default email
describe('PUT /api/users/:id', () => {
    it('it should update email', (done) => {
        let req = request(server).put('/api/users/'+common.testUsers.test1.data._id);
        req.cookies = common.testUsers.test1.cookies;
        req.send({email: 'test1@test.com'});
        req.expect(200)
        .end(done);
    });
});

function tryInvalidUsername(username){
    describe('GET /api/users/helpers/valid-username', () => {
        it('it should check if a username is invalid', (done) => {
            let req = request(server).get('/api/users/helpers/valid-username?username='+encodeURIComponent(username));
            req.expect(200)
            .expect(response => {
                assert.equal(response.body.data.isValid, false);
            })
            .end(done);
        });
    })
}

for(let i in invalidUsernames)
    tryInvalidUsername(invalidUsernames[i]);


function tryValidUsername(username){
    describe('GET /api/users/helpers/valid-username', () => {
        it('it should check if a username is valid', (done) => {
            let req = request(server).get('/api/users/helpers/valid-username?username='+encodeURIComponent(username));
            req.expect(200)
            .expect(response => {
                assert.equal(response.body.data.isValid, true);
            })
            .end(done);
        });
    })
}

for(let i in validUsernames)
    tryValidUsername(validUsernames[i]);

function tryInvalidEmail(email){
    describe('GET /api/users/helpers/valid-email', () => {
        it('it should check if a email is invalid', (done) => {
            let req = request(server).get('/api/users/helpers/valid-email?email='+encodeURIComponent(email));
            req.expect(200)
            .expect(response => {
                assert.equal(response.body.data.isValid, false);
            })
            .end(done);
        });
    })
}

for(let i in invalidEmails)
    tryInvalidEmail(invalidEmails[i]);


function tryValidEmail(email){
    describe('GET /api/users/helpers/valid-email', () => {
        it('it should check if a email is valid', (done) => {
            let req = request(server).get('/api/users/helpers/valid-email?email='+encodeURIComponent(email));
            req.expect(200)
            .expect(response => {
                assert.equal(response.body.data.isValid, true);
            })
            .end(done);
        });
    })
}

for(let i in validEmails)
    tryValidEmail(validEmails[i]);