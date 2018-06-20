let visibility = require('../../models/collection/visibility.json')
let lifeStates = require('../../models/lifeStates.json')
let common = require('../common')
let server = common.server
let models = common.models
let chai = common.chai
let request = common.request
let should = common.should
let assert = common.assert

describe('GET /api/collections (no_auth)', () => {
  it('it should GET 0 collections', (done) => {
    request(server)
      .get('/api/collections')
      .expect(200, {
        data: []
      }, done)
  })
})

describe('GET /api/collections/test (no_auth)', () => {
  it('it should make 404 error', (done) => {
    request(server)
      .get('/api/collections/test')
      .expect(404, done)
  })
})

describe('POST /api/collections (no_auth)', () => {
  it('it should make 401 error', (done) => {
    request(server)
      .post('/api/collections')
      .expect(401, done)
  })
})

describe('PUT /api/collections/test (no_auth)', () => {
  it('it should make 401 error', (done) => {
    request(server)
      .put('/api/collections/test')
      .expect(401, done)
  })
})

describe('DELETE /api/collections/test (no_auth)', () => {
  it('it should make 401 error', (done) => {
    request(server)
      .delete('/api/collections/test')
      .expect(401, done)
  })
})

describe('POST /api/collections (auth)', () => {
  it('it should create a private collection by test1', (done) => {
    request(server)
    let req = request(server).post('/api/collections')
    req.cookies = common.testUsers.test1.cookies
    req.send({title: 'collection0_private_by_test1', color: 'ffffff', visibility: visibility.PRIVATE.id})
      .expect(200)
      .expect(response => {
        assert.equal(response.body.data.title, 'collection0_private_by_test1')
        assert.equal(response.body.data.color, 'ffffff')
        assert.equal(response.body.data.visibility, visibility.PRIVATE.id)
        assert.equal(response.body.data.lifeState, lifeStates.ACTIVE.id)
        common.testUsers.test1.collection_private = response.body.data
      })
      .end(done)
  })
})

describe('POST /api/collections (auth)', () => {
  it('it should create a public collection by test1', (done) => {
    request(server)
    let req = request(server).post('/api/collections')
    req.cookies = common.testUsers.test1.cookies
    req.send({title: 'collection1_public_by_test1', color: 'ffffff', visibility: visibility.PUBLIC.id})
      .expect(200)
      .expect(response => {
        assert.equal(response.body.data.title, 'collection1_public_by_test1')
        assert.equal(response.body.data.color, 'ffffff')
        assert.equal(response.body.data.visibility, visibility.PUBLIC.id)
        assert.equal(response.body.data.lifeState, lifeStates.ACTIVE.id)
        common.testUsers.test1.collection_public = response.body.data
      })
      .end(done)
  })
})

describe('GET /api/collections (no_auth)', () => {
  it('it should GET 1 collection', (done) => {
    request(server)
      .get('/api/collections')
      .expect(200)
      .expect(response => {
        assert.equal(response.body.data.length, 1)
        assert.equal(response.body.data[0]._id, common.testUsers.test1.collection_public._id)
      })
      .end(done)
  })
})

describe('GET /api/collections/collection1_public_by_test1 (no_auth)', () => {
  it('it should get the public collection by user1', (done) => {
    request(server)
      .get('/api/collections/' + common.testUsers.test1.collection_public._id)
      .expect(200)
      .expect(response => {
        assert.equal(response.body.data._id, common.testUsers.test1.collection_public._id)
      })
      .end(done)
  })
})

describe('GET /api/collections/collection0_private_by_test1 (no_auth)', () => {
  it('it should make 401 error', (done) => {
    request(server)
      .get('/api/collections/' + common.testUsers.test1.collection_private._id)
      .expect(401, done)
  })
})

describe('GET /api/collections/collection0_private_by_test1 (auth)', () => {
  it('it should get the private collection by user1', (done) => {
    let req = request(server).get('/api/collections/' + common.testUsers.test1.collection_private._id)
    req.cookies = common.testUsers.test1.cookies
    req.send({title: 'collection1_public_by_test1', color: 'ffffff', visibility: visibility.PUBLIC.id})
      .expect(200)
      .expect(response => {
        assert.equal(response.body.data._id, common.testUsers.test1.collection_private._id)
      })
      .end(done)
  })
})
