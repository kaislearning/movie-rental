const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
let server;

describe('auth middleware', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => {
        await Genre.remove({});
        await server.close();
    });
    
    let token;

    const execute = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    }
    
    beforeEach(() => { token = new User().generateAuthToken(); });

	it('should return 401 if no token provided', async () => {
        token = '';
        const res = await execute();
        expect(res.status).toBe(401);
    });
    
    it('should return 400 if invalid token', async () => {
        token = 'a';
        const res = await execute();
        expect(res.status).toBe(400);
    });
    
    it('should return 200 if valid token', async () => {
        const res = await execute();
        expect(res.status).toBe(200);
	});
});