/**
 * Created by pascal on 23/12/15.
 */


describe("Consumer", function() {

    var consumer = require("../src/consumer.js");
    describe("Should execute event properly", function(){



        afterEach(function(){
            SCM = consumer.getSCM();

            SCM.setPacketId(0);
            SCM.setResults([]);
        });

        it("Sending 10 request/s for 5.09 sec (50 request) with a timeout of 200ms (getting 100ms late at each request) (expecting last result at max 5.6s)", function(done) {

            var event = {
                            start_time : 0,
                            duration : 5090,
                            consumer: {
                                id : 'CFC1',
                                speed : 10,
                                size : 10
                            },
                            producer: {
                                id : 'P1',
                                timeout : 200,
                                size : 10
                            }
                        };
            SCM = consumer.getSCM();
            var spy1 = spyOn(SCM,"submitEmission").and.callThrough();
            var spy2 = spyOn(SCM,"submitReception").and.callThrough();

            consumer.eventExecution(event);
            setTimeout(function() {
                expect(spy1.calls.count()).toEqual(50);
            }, 5100);


            setTimeout(function() {
                expect(spy2.calls.count()).toEqual(50);
                done();
            }, 5600);


        },10000);
    });

});

