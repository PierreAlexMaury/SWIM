/**
 * Created by remiprevost on 14/12/2015.
 */
var exec = require('child_process').exec,
    fs = require('fs'),
    path = require('path');

var logs = "logs/";

module.exports=function(grunt) {

    grunt.initConfig({
        'npm-install':{
            producer: {
                dir:'Producer'
            },
            consumer: {
                dir:'Consumer'
            },
            supervisor: {
                dir:'Supervisor'
            }
        },

        start: {
            producer:{
                dir: 'Producer/src',
                log: '',
                cmd: 'forever',
                params: [
                    '-a',
                    '-o',
                    '../../'+logs+'producer.log',
                    '-e',
                    '../../'+logs+'producer.log',
                    '--uid',
                    '"producer"',
                    'start',
                    'producer.js'
                ]
            },
            messageBroker:{
                dir: '',
                log: 'messageBroker.log',
                cmd: 'rabbitmq-server',
                params: []
            }/*,
            mongo:{
                dir: '',
                log: 'mongo.log',
                cmd: 'mongod',
                params: []
            }*/,
            consumer:{
                dir: 'Consumer/src',
                log: '',
                cmd: 'forever',
                params: [
                    '-a',
                    '-o',
                    '../../'+logs,
                    '-e',
                    '../../'+logs,
                    '--uid',
                    '"consumer"',
                    '--minUptime',
                    '1000',
                    'start',
                    'consumer.js',
                    'idc'
                ]
            },
            supervisor:{
                dir: 'Supervisor',
                log: '',
                cmd: 'forever',
                params: [
                    '-a',
                    '-w',
                    '-o',
                    '../'+logs+'supervisor.log',
                    'start',
                    '--uid',
                    '"supervisor"',
                    'app.js',
                    '--verbose'
                ]
            }
        },

        restart: {
            nodes: {
                cmd:'forever restartall'
            }
        },

        stop: {
            nodes: {
                cmd:'forever stopall'
            },
            messageBroker: {
                cmd:'rabbitmqctl stop'
            }/*,
            mongo: {
                cmd:'mongod --shutdown'
            }*/
        },

        grunt: {
            producer: {
                gruntfile: 'Producer/Gruntfile.js',
                tasks: 'test-producer'
            },
            consumer: {
                gruntfile: 'Consumer/Gruntfile.js',
                tasks: 'test-consumer'
            }
        }

    });

    require('load-grunt-tasks')(grunt);
    
    grunt.registerMultiTask('npm-install','Install the NPM dependencies', function(){
        var me = this,
            done = this.async(),
            name = this.name+':'+this.target;

        exec('cd '+me.data.dir+' && npm install',function(err,stdout){
            if (err) {
                grunt.fail.fatal("err: "+err);
            }
            else {
                grunt.verbose.writeln(stdout);
                grunt.log.ok('Task '+name + ' successfully executed!')
            }
            done();
        });
    });

    grunt.registerMultiTask('start','Deploy the SWIM elements', function(n,timeout){
        var me = this,
            done = me.async(),
            name = me.name+':'+me.target,
            spawn = require('child_process').spawn,
            deploy,
            temp = me.data.params.slice(),
            logStream;

            if(me.target=='consumer'){
                n = (typeof n == 'undefined' ? 1 : n);
                var id=(n==10?10:'0'+n)
                me.data.params[11]+=id;
                me.data.params[2]+='consumer'+id+'.log';
                me.data.params[4]+='consumer'+id+'.log';
            }
    
            deploy= spawn(me.data.cmd,me.data.params, {cwd:me.data.dir});
            if (me.data.log != '') {
                logStream = fs.createWriteStream(logs+me.data.log, {flags: 'a'});
                deploy.stdout.pipe(logStream);
                deploy.stderr.pipe(logStream);
            }

            /*deploy.stdout.on('data',function(data){
                console.log('stdout: ' + data);
            });

            deploy.stderr.on('data',function(data){
                console.log('stderr: ' + data);
            });*/

            deploy.on('error', function(err) {
                grunt.fail.fatal("Failed to deploy target "+me.target+" due to error: "+err);
            });



            setTimeout(function(){
                grunt.log.ok('Task '+ name + ' successfully executed!');
                done();
            },typeof timeout != 'undefined' ? timeout : 2000);

            if(me.target=='consumer'){
                setTimeout(function(){
                    me.data.params=temp.slice();
                    n=parseInt(n)+1;
                    if(n<=10)
                        grunt.task.run(['start:consumer:'+n+(typeof timeout != 'undefined' ? ':'+timeout : '')]);
                },2000);

            }
        
    });

    grunt.registerMultiTask('stop','Stop the SWIM elements', function(){
        var me=this,
            done = me.async(),
            name = me.name+':'+me.target;

        exec(me.data.cmd,function(err,stdout){
            if (err) {
                grunt.log.error("err: "+err);
            }
            else {
                grunt.verbose.writeln(stdout);
                grunt.log.ok('Task '+name + ' successfully executed!')
            }
            done();
        });
    });

    grunt.registerMultiTask('restart','Restart the SWIM elements', function(){
        var me=this,
            done = me.async(),
            name = me.name+':'+me.target;

        exec(me.data.cmd,function(err,stdout){
            if (err) {
                grunt.log.error("err: "+err);
            }
            else {
                grunt.verbose.writeln(stdout);
                grunt.log.ok('Task '+name + ' successfully executed!')
            }
            done();
        });
    });

    grunt.registerTask('test', function (arg) {
        grunt.task.run('grunt'+(typeof arg != 'undefined' ? ':'+arg : ''));
    });

    grunt.registerTask('default',['npm-install','start']);

};