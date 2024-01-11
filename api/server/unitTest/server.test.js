const expect  = require('chai').expect;
const axios = require('axios');

let URL = "http://localhost:3001";

before(done => {
    console.log('\n\n-----------------------\n--\n-- START TEST\n--\n-------------------------');
    done();
});

after(done => {
    console.log('\n\n-----------------------\n--\n-- END TEST\n--\n-------------------------');
    done();
});

it('Server started', async function () {
    try {
        let response = await axios.get(URL);
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('status');
        expect(response.data.status).to.equal('OK');
    } catch (err) {
        throw err;
    }
});