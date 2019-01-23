var expect  = require('chai').expect;
var request = require('request');


describe('Pages status', function() {
    it('Main page status', function(done) {
        request('http://localhost:10410' , function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
     });
    });

    it('Posted text status', function(done) {
        request('http://localhost:10410/postedText' , function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
});