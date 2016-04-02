/**
 * ScenarioController
 *
 * @description :: Server-side logic for managing scenarios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var resultsGlobal = [];
var scenarioDuration;
var startTime;
var mongo_address="localhost:27017";
var supervisor_ip="localhost";

module.exports = {
    /**
    * `ScenarioController.launch()`
    *
    */
    launch: function (req,res){
        var me = this;
        var amqp = require('amqplib/callback_api');
        var eventsTab = req.body.scenario.events;
        var i;
        scenarioDuration  = 0;
        resultsGlobal = [];
        startTime=parseInt(eventsTab[0].start_time);
        for(i= 0;i<eventsTab.length;i++){
            var current = parseInt(eventsTab[i].start_time)+parseInt(eventsTab[i].duration)+parseInt(eventsTab[i].producer.timeout);
            if(scenarioDuration<current){
                scenarioDuration = current;
            }
            if(startTime>parseInt(eventsTab[i].start_time)){
                startTime=parseInt(eventsTab[i].start_time);
            }
        }
        // connect to MB and create a fanout channel to broadcast json
        amqp.connect('amqp://'+supervisor_ip, function(err, conn) {
            conn.createChannel(function(err, ch) {
            var ex = 'bcast';
            var json = JSON.stringify(req.body);
            ch.assertExchange(ex, 'fanout', {durable: false});
            ch.publish(ex, '', new Buffer(json));
            //console.log("Broadcasting the scenario %s\n", json);
            console.log("Broadcasting the scenario\n");
            });
            // Free the resources
            setTimeout(function() { conn.close(); }, 500);
        });
        setTimeout(function(){
            console.log(me.parseResults());
            return res.json(me.parseResults());
        },scenarioDuration+8000);
    },

    /**
    * `ScenarioController.results()`
    */
    results: function (req,res){
        resultsGlobal = resultsGlobal.concat(Object.keys(req.body).map(function (key) {return req.body[key]}));
        //console.log(resultsGlobal);
        return res.json({
            Success: true
        });
    },

    parseResults: function (res){
        var resultsGlobalCleaned = [];
        for (var i = 0; i < resultsGlobal.length; i++) {
            if (resultsGlobal[i]) {
                resultsGlobalCleaned.push(resultsGlobal[i]);
            }
        }
        resultsGlobalCleaned.sort(function(a, b) {
            return parseInt(a.emission_time) - parseInt(b.emission_time);
        });
        var nbTimeSlots=200;
        var timeSlot = scenarioDuration/nbTimeSlots;
        var lostPackets = [];
        var averageResponseTime = [];
        var totalLostPackets=0;
        var totalAverageResponseTime=0;
        var indexTimeSlot=0;
        var nbElemTimeSlot=0;
        var minResponseTime=scenarioDuration;
        var maxResponseTime=0;
        for(i=0;i<nbTimeSlots;i++){
            lostPackets.push(0);
            averageResponseTime.push(0);
        }
        if(resultsGlobalCleaned.length>0) {
            var timeCurrent=parseInt(resultsGlobalCleaned[0].emission_time)-startTime;
            for (i = 0; i < resultsGlobalCleaned.length; i++) {
                while (parseInt(resultsGlobalCleaned[i].emission_time) > timeSlot + timeCurrent) {
                    timeCurrent += timeSlot;
                    indexTimeSlot++;
                    nbElemTimeSlot = 0;
                }
                if (resultsGlobalCleaned[i].hasOwnProperty('reception_time')) {
                    var timeForElem = parseInt(resultsGlobalCleaned[i].reception_time) - parseInt(resultsGlobalCleaned[i].
                            processing_time) - parseInt(resultsGlobalCleaned[i].emission_time);
                    timeForElem /= 2;
                    if (timeForElem < minResponseTime) {
                        minResponseTime = timeForElem;
                    }
                    if (timeForElem > maxResponseTime) {
                        maxResponseTime = timeForElem;
                    }
                    averageResponseTime[indexTimeSlot] += timeForElem;
                    nbElemTimeSlot++;
                    totalAverageResponseTime += timeForElem;
                }
                else {
                    lostPackets[indexTimeSlot]++;
                    totalLostPackets++;
                }

                if (i < resultsGlobalCleaned.length - 1 && parseInt(resultsGlobalCleaned[i + 1].emission_time) > timeSlot + timeCurrent && nbElemTimeSlot >0) {
                    averageResponseTime[indexTimeSlot] /= nbElemTimeSlot;

                }
                if (i == resultsGlobalCleaned.length - 1 && nbElemTimeSlot > 0) {
                    averageResponseTime[indexTimeSlot] /= nbElemTimeSlot;
                }
            }
            if(resultsGlobalCleaned.length!==totalLostPackets){
                totalAverageResponseTime = totalAverageResponseTime / (resultsGlobalCleaned.length - totalLostPackets);
            }
            //console.log(totalAverageResponseTime);
            //console.log(totalLostPackets);
            //console.log(minResponseTime);
            //console.log(maxResponseTime);
            //console.log(lostPackets.length);
            //console.log(averageResponseTime.length);
            //console.log(averageResponseTime);
            //console.log(lostPackets);
            //console.log(resultsGlobalCleaned.length);
            resultsGlobal=resultsGlobalCleaned;
            return res = {
                time_slot: timeSlot,
                average_response_time: totalAverageResponseTime,
                total_lost_packets: totalLostPackets,
                min_response_time: minResponseTime,
                max_response_time: maxResponseTime,
                total_sent_packets: resultsGlobalCleaned.length,
                total_received_packets: resultsGlobalCleaned.length - totalLostPackets,
                average_response_time_array: averageResponseTime,
                lost_packets_array: lostPackets,
                lost_packets_percentage: 100 * totalLostPackets / resultsGlobalCleaned.length
            }
        }else{
            return res = {
                Failed: "Results array empty"
            }
        }
    },

    /**
    * `ScenarioController.save()`
    */
    save: function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var assert = require('assert');
        var url = 'mongodb://'+mongo_address+'/swim';

        var insertScenario = function(db, callback){
            db.collection('scenarios').insertOne(req.body, function(err, result){
                assert.equal(err,null);
                console.log("Inserted a scenario into the scenarios collections.");
                callback();
            });
        };

        MongoClient.connect(url, function(err, db){
            assert.equal(null,err);
            insertScenario(db,function(){
                db.close();
            });
        });
        return res.json({
            Success: true
        });
    },

    /**
     * Function which find all the scenarios in the mongo database
     * @param req
     * @param res: the array of scenarios with their mongodb id
     * @returns {*}
     */
    findall: function (req,res) {

        var MongoClient = require('mongodb').MongoClient;
        var assert = require('assert');
        var url = 'mongodb://'+mongo_address+'/swim';

        var arrayScenario = [];

        var findScenarios = function(db, callback) {
        var cursor =db.collection('scenarios').find( );
           cursor.each(function(err, scen) {
              assert.equal(err, null);
              //console.log("FindAll scenarios in the collections.");
              if (scen != null) {
                 //console.dir(scen);
                 //console.log([scen._id,scen.scenario.name]);
                 arrayScenario.push([scen._id,scen.scenario.name]);
              } else {
                 callback();
              }
           });
        };

        MongoClient.connect(url, function(err, db) {
          assert.equal(null, err);
          findScenarios(db, function() {
                db.close();
                return res.json({
                    scenarios: arrayScenario
                });
          });
        });
    },

    /**
    * `ScenarioController.load()`
    */
    load: function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var assert = require('assert');
        var ObjectId = require('mongodb').ObjectID;
        var url = 'mongodb://'+mongo_address+'/swim';

        var Scenario = null;

        var findScenario = function(db, callback) {
        var cursor =db.collection('scenarios').find( {"_id":ObjectId(req.query.id)} );
           cursor.each(function(err, scen) {
              assert.equal(err, null);
              console.log("Load a specific scenario.");
              if (scen != null) {
                 //console.dir(scen);
                 //console.log([scen._id,scen.scenario.name]);
                 Scenario=scen;
              } else {
                 callback();
              }
           });
        };


        MongoClient.connect(url, function(err, db) {
          assert.equal(null, err);
          findScenario(db, function() {
                db.close();
                return res.json(Scenario);
          });
        });
    },

    /**
     * Function that sends back to the GUI the global results of an executed scenario
     * @param req the request content
     * @param res the response sends back to the GUI
     */
    detailedResults: function(req,res){
        var content = JSON.stringify(resultsGlobal);
        res.attachment('scenario.txt');
        res.charset = 'UTF-8';
        res.end(content);
    }
};

