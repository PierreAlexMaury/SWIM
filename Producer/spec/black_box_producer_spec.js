describe("Black box producer", function() {


	soap = require('soap');
	fs = require('fs');
	var url = "http://localhost:8002/provideService?wsdl";




	describe("testing soap service producer", function(){
		var data = "toto";

		it("async call with id : 0, size : 5, processing time : 1000", function(done) {
		 	
		 	args = {packet_id:0, size: 5, processing_time: 1000, emission_time:123456,message:'aaaaaaaaaa'};
			var before = new Date();
		    soap.createClient(url, function(err, client) {
		      client.provide(args, function(err, result) {
		      		after = new Date();
		      		diff = after.getTime() - before.getTime();
			        if(diff < 900){
		      			fail("Response received too soon");
		      		}
			        data = result;
			        expect(data.message).toMatch('0:123456:aaaaa');
			        done();
		      });
		  	});
		},1100);

		it("async call with id : 1, size : 1, processing time : 2000", function(done) {

		 	args = {packet_id:1, size: 10, processing_time: 2000, emission_time:654321,message:'aaaaaaaaaa'};
		 	var before = new Date();
		    soap.createClient(url, function(err, client) {
		      client.provide(args, function(err, result) {
		      		after = new Date();
		      		diff = after.getTime() - before.getTime();
		      		expect(diff ).toBeGreaterThan(1900);
		      		if(diff < 1900){
		      			fail("Response received too soon");
		      		}
			        data = result;
			        expect(data.message).toMatch('1:654321:aaaaaaaaaa');
			        done();
		      });
		  	});
		},2100);





	});
});