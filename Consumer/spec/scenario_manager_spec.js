describe("Scenario manager", function() {

  var SCM = require("../src/ScenarioManager.js");

  var basic_scenario = {
    events: [
        {
            start_time : 0,
            duration : 2,
            consumer: {
                id : 'CFC1',
                speed : 10,
                size : 10
            },
            producer: {
                id : 'P1',
                timeout : 2,
                size : 10
            }
        },
        {
            start_time : 5,
            duration : 2,
            consumer: {
                id : 'CFC1',
                speed : 5,
                size : 100
            },
            producer: {
                id : 'P1',
                timeout : 2,
                size : 10
            }
        },
        {
            start_time : 8,
            duration : 10,
            consumer: {
                id : 'CFC2',
                speed : 100,
                size : 10
            },
            producer: {
                id : 'P1',
                timeout : 2,
                size : 10
            }
        }

    ]

  };


  beforeEach(function() {
    //could add stuff done before each tests
  });


  describe("should verify validity of scenario", function(){

    it("when input scenario is null", function() {
    var inputScenario = null;
    expect(SCM.isValidScenario(inputScenario)).toEqual(false);
    });

    it("when input scenario is undefined", function() {

    expect(SCM.isValidScenario(undefined)).toEqual(false);
    });

    it("when input scenario is NaN", function() {
    var inputScenario = NaN;
    expect(SCM.isValidScenario(inputScenario)).toEqual(false);
    });

    it("when input scenario is []", function() {
    var inputScenario = NaN;
    expect(SCM.isValidScenario(inputScenario)).toEqual(false);
    });

    it("when input scenario is valid", function() {
    var inputScenario = basic_scenario;
    expect(SCM.isValidScenario(inputScenario)).toEqual(true);
    });


  });

  describe("should parse scenario", function(){


    var event_equality = function(first, second) {
      return (first.start_time === second.start_time &&
        first.duration === second.duration &&
        first.consumer.id === second.consumer.id &&
        first.consumer.speed === second.consumer.speed &&
        first.consumer.size === second.consumer.size &&
        first.producer.id === second.producer.id &&
        first.producer.timeout === second.producer.timeout &&
        first.producer.size === second.producer.size);
    };



    it("when input scenario is valid and contains two events with the consumer", function() {
    var inputScenario = basic_scenario;
    var expected_result = [
      {


            start_time : 0,
            duration : 2,
            consumer: {
                id : 'CFC1',
                speed : 10,
                size : 10
            },
            producer: {
                id : 'P1',
                timeout : 2,
                size : 10
            }
        },
        {
            start_time : 5,
            duration : 2,
            consumer: {
                id : 'CFC1',
                speed : 5,
                size : 100
            },
            producer: {
                id : 'P1',
                timeout : 2,
                size : 10
            }
        }

    ];

    obtained_result = SCM.parseScenario(inputScenario, "CFC1");


    expect(obtained_result.length).toEqual(2);

    jasmine.addCustomEqualityTester(event_equality);

    expect(obtained_result[0]).toEqual(expected_result[0]);
    expect(obtained_result[1]).toEqual(expected_result[1]);
    });


  });


  describe("should return the next packet_id", function(){

    it("first packet is 0 ", function() {
    expect(SCM.getNextPacketId()).toEqual(0);

    });
    it("second packet is 1 ", function() {
    expect(SCM.getNextPacketId()).toEqual(1);
    });
  });



    describe("should submit reception properly", function(){
        var emission_time_1, emission_time_2,emission_time_3;

        var new_results = [];
        SCM.setStartTime(Date.now());

        beforeEach(function(done) {




            setTimeout(function() {
                emission_time_1 = Date.now();
                new_results.push({emission_id: 0, emission_time:emission_time_1 , processing_time: 300});
            }, 300);

            setTimeout(function() {
                emission_time_2 = Date.now();
               new_results.push({emission_id: 1, emission_time: emission_time_2, processing_time: 400});
            }, 400);

            setTimeout(function() {
                emission_time_3 = Date.now();
                new_results.push({emission_id: 2, emission_time: emission_time_3, processing_time: 500});
                done();
            }, 500);





        });



        it("for the first packet (id 0 ) received (time at approx 100ms)", function() {
            SCM.setResults(new_results);
            SCM.submitReception(0,emission_time_1);
            var now = Date.now();
            var effective_results = SCM.getResults();
            expect(effective_results[0].reception_id).toEqual(0);
            expect(effective_results[0].reception_time <= now).toBeTruthy();
            expect(effective_results[0].reception_time >= now - 100).toBeTruthy();


        });

        it("for the second packet (id 1 ) received (time at approx 100ms)", function() {
            SCM.setResults(new_results);
            SCM.submitReception(1,emission_time_2);
            var now = Date.now();
            var effective_results = SCM.getResults();
            expect(effective_results[1].reception_id).toEqual(1);
            expect(effective_results[1].reception_time <= now).toBeTruthy();
            expect(effective_results[1].reception_time >= now - 100).toBeTruthy();


        });

        afterEach(function() {
            SCM.setResults([]);
        });

        afterAll(function() {
            SCM.setStartTime(0);
        });

    });


    describe("should submit emission properly", function(){

        it("first packet (packet_id 0, processing time 100) with emission time right at approx 100ms ", function() {
            var now = Date.now();
            //console.log(now);

            var args = {packet_id: 0, processing_time: 100, size:5,message:"aaaaaaaaaaaa" };
            var returnSubmit = SCM.submitEmission(args);
            var current_result = SCM.getResults();

            //console.log(current_result);


            expect(current_result[0].emission_id).toEqual(0);
            expect(current_result[0].emission_time >= now).toBeTruthy();
            expect(current_result[0].emission_time <= now + 100 ).toBeTruthy();
            expect(current_result[0].processing_time).toEqual(100);
            expect(returnSubmit).toEqual(current_result[0].emission_time);

        });

        it("second packet (packet_id 1, processing time 200) with emission time right at approx 100ms ", function() {
            var now = Date.now();
            //console.log(now);

            var args = {packet_id: 1, processing_time: 200, size:5,message:"aaaaaaaaaaaa" };
            var returnSubmit = SCM.submitEmission(args);
            var current_result = SCM.getResults();

            //console.log(current_result);


            expect(current_result[1].emission_id).toEqual(1);
            expect(current_result[1].emission_time >= now).toBeTruthy();
            expect(current_result[1].emission_time <= now + 100 ).toBeTruthy();
            expect(current_result[1].processing_time).toEqual(200);
            expect(returnSubmit).toEqual(current_result[1].emission_time);

        });

        afterAll(function() {
            SCM.setResults([]);
        });


    });

    describe("should start scenario properly (async test so there is some waiting time)", function(){

        it("should reinitialize clock after 7s", function(done) {
            var events = [
                {
                    start_time : "0",
                    duration : "200",
                    producer: {
                        timeout : "250"
                    }
                },
                {
                    start_time : "500",
                    duration : "500",
                    producer: {
                        timeout : "1000"
                    }
                }];

            var start_time = SCM.getStarTime();
            expect(start_time).toEqual(0);
            SCM.startScenario(events);
            var now = Date.now();


            setTimeout(function() {
                start_time = SCM.getStarTime();
                expect(start_time <= now).toBeTruthy();
                expect(start_time >= now - 100);
            }, 6900);

            setTimeout(function() {
                start_time = SCM.getStarTime();
                expect(start_time).toEqual(0);
                done();
            }, 7100);




        },8000);

    });


});