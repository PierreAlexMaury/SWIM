/*
npm install soap

documentation:
https://github.com/vpulim/node-soap
http://stackoverflow.com/questions/20740975/how-to-get-started-node-soap
*/


var http = require('http');
var soap = require('soap');

var provideService = {
  Provide_Service: {
    Provide_Port: {

      /**
       * Wait for a certain amont of time before returnin a message with the defined size and the with the input id
       * @param args
       * @param callback
         */
      provide: function(args, callback) {
        console.log("New order : id= " + args.packet_id + " | size= " + args.size + " | process time= " + args.processing_time);
        //console.log("message:"+args.message);
        setTimeout(function() {
          if (typeof args.packet_id === 'undefined') {
            args.id = -1;
            args.size = 0;
          }
          else {
            if (typeof args.size === 'undefined') {
              args.size = 100;
            }
          }
          
          var message = "";
          for(var i = 0; i < args.size; i++) {
            message += "a";
          }
          console.log("send response with id " + args.packet_id + " and message : ");//+message);
          callback ({
            message: args.packet_id+':'+args.emission_time+':'+message
          });
        }, args.processing_time);
      }
    }
  }
};



var xml =  require('fs').readFileSync('producer.wsdl', 'utf8');
      

var server = http.createServer(function(request,response) {
          response.end("404: Not Found: "+request.url);
      });

server.listen(8002);
soap.listen(server, '/provideService', provideService, xml);

console.log("Producer started on port 8002");

/*
  if ( typeof module !== 'undefined' && module.hasOwnProperty('exports') )
  {
      module.exports = {
        provideService:provideService
      };


    }*/
