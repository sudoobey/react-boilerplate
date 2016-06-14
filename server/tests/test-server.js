const request = require('supertest-as-promised');
const app = require('../').server;

describe('main server', function() {
    it('is running', () =>
        request(app)
            .get('/')
            .expect(200)
    );
});
