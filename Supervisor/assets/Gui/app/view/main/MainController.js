/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('Swim.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'Ext.window.MessageBox'
    ],

    alias: 'controller.main',

    /**
     * Function that sends a POST request with the created scenario
     */
    onClickButton: function () {
        var me = this,
            scenario_store=Ext.getStore('scenario');

        me.downloadButton("disable");

        Ext.Ajax.setTimeout(2147483647);//Max integer for 32bits (setTimeout coded on 32 not 64)!
        if(!scenario_store.isEmptyScenario()){
            Ext.Ajax.request({
                url: 'http://'+config.supervisor_ip+':'+config.supervisor_port+'/launch',
                jsonData: Ext.util.JSON.encode({scenario: scenario_store.getScenario()}),
                method: 'POST',
                success: function (response) {
                    var packetLossDataStore = Ext.getStore("packetlossdata"),
                        packetLossChartStore = Ext.getStore("packetlosschart"),
                        responseTimeDataStore = Ext.getStore("responsetimedata"),
                        responseTimeChartStore = Ext.getStore("responsetimechart"),
                        chart_packet_loss=Ext.getCmp('chart-packet-loss'),
                        chart_response_time=Ext.getCmp('chart-response-time'),
                        timeline=Ext.getCmp('timeline'),
                        timeline_store=Ext.getStore("timeline-store"),
                        ex_h_timeline=Ext.getCmp('h-timeline'),
                        container=Ext.getCmp('timeline-container'),
                        records = [],
                        panelTimeline,
                        hTimeline,
                        max_timeline,
                        max,
                        redraw_event = function() {
                            var me=this,
                                chart_packet_loss=Ext.getCmp('chart-packet-loss'),
                                chart_response_time=Ext.getCmp('chart-response-time'),
                                max_packet_loss=chart_packet_loss.getAxes()[1].range[1],
                                max_response_time=chart_response_time.getAxes()[1].range[1];

                            if (me.getAxes()[0].range !== null && me.getAxes()[0].range[1] >= 1) {
                                max_timeline=me.getAxes()[0].range[1];

                                max=Math.max(max_packet_loss,max_response_time,max_timeline);
                                me.getAxes()[0].setMaximum(max);
                                chart_packet_loss.getAxes()[1].setMaximum(max);
                                chart_response_time.getAxes()[1].setMaximum(max);
                                chart_packet_loss.redraw();
                                chart_response_time.redraw();
                                me.removeListener('redraw',redraw_event);
                                me.redraw();
                            }
                        },
                        Json=Ext.decode(response.responseText);

                    if (ex_h_timeline) {
                        ex_h_timeline.up().destroy();
                        container.remove(container.items.items[1]);
                    }

                    chart_packet_loss.getAxes()[1].setMaximum(0);
                    chart_response_time.getAxes()[1].setMaximum(0);

                    panelTimeline = new Swim.view.Timeline.Timeline({
                        t_orientation:'h',
                        t_id:'h-timeline',
                        layout:'fit',
                        t_height:200,
                        t_width:'90%',
                        width:'90%',
                        t_margin:'0 145 0 0',
                        t_flipXY:true,
                        t_fields:timeline.getAxes()[0]._fields,
                        t_insetPadding:{
                            top: 0,
                            left: 21,
                            right: 15,
                            bottom: 10
                        },
                        t_time_axe_position:'bottom',
                        t_time_axe_maximum:null,
                        t_time_axe_minimum:0,
                        t_time_axe_label_rotate:-45,
                        t_consumer_axe_position:'left',
                        t_consumer_axe_renderer:function(axis, label){
                            return parseInt(label);
                        },
                        t_consumer_axe_label_rotate:0,
                        t_store:new Swim.store.TimelineStore({storeId:me.t_storeId}),
                        t_listeners: {
                            redraw:redraw_event
                        }
                    });
                    hTimeline = panelTimeline.child();

                    me.downloadButton("enable");

                    me.filterJson(Json);
                    packetLossDataStore.addData(Json);
                    packetLossChartStore.addData(Json);
                    responseTimeDataStore.addData(Json);
                    responseTimeChartStore.addData(Json);

                    chart_packet_loss.redraw();
                    chart_response_time.redraw();

                    timeline_store.each(function(r){
                        var name,
                            copy=r.copy();
                        for (name in copy.data) {
                            if (copy.data.hasOwnProperty(name) && name.indexOf("data") > -1) {
                                copy.data[name]*=-1;
                            }
                        }
                        records.push(copy);
                    });
                    hTimeline.store.removeAll();
                    hTimeline.store.add(records);

                    container.add(panelTimeline);
                    Ext.getCmp('main-result-view').layout.setActiveItem(2);
                    chart_packet_loss.redraw();
                    chart_response_time.redraw();

                    setTimeout(function() {
                        chart_packet_loss.redraw();
                        chart_response_time.redraw();
                    },500);

                    console.log("response : ", Json);
                }
            });
            Ext.getCmp('main-result-view').layout.setActiveItem(1);
            Ext.getCmp('tabbarid').setActiveTab(1);
            Ext.getCmp('progress-bar').start(Math.floor(scenario_store.getScenarioDuration()/1000));
        } else{
            Ext.Msg.alert('Error','Empty scenario');
        }
    },

    /**
     * Clean the data of the array to remove the useless 0 at the end of those
     * @param Json
     * @returns {*}
     */
    filterJson:function(Json) {
        var t_response_time=Json.average_response_time_array,
            t_packet_loss=Json.lost_packets_array,
            i,
            j;

        for (i = t_response_time.length-1; i >= 0; i--) {
            if (t_response_time[i] !== 0) {
                break;
            }
        }

        for (j = t_packet_loss.length-1; j >= 0; j--) {
            if (t_packet_loss[j] !== 0) {
                break;
            }
        }

        i=Math.max(i,j)+1;

        Json.average_response_time_array=t_response_time.slice(0,i);
        Json.lost_packets_array=t_packet_loss.slice(0,i);

        return Json;
    },

    /**
     * Function which enables the user to switch panel view (Scenario Edition and Results)
     * @param tabPanel The current panel
     * @param newPanel The new panel where the user wants to arrive
     */
    onSwitchPanel: function(tabPanel,newPanel){
        var i,
            tools;
        if(newPanel.down().id === "main-creation-view"){
            Ext.get("page_title").dom.innerHTML="Scenario Edition";
            tools = newPanel.up().up().tools;
            for(i=0; i<tools.length; i++){
                if(!(tools[i].itemId==="down_id")){
                    tools[i].show();
                }else{
                    tools[i].hide();
                }
            }
        }
        else if (newPanel.down().id === "main-result-view") {
            Ext.get("page_title").dom.innerHTML="Results";
            tools = newPanel.up().up().tools;
            for(i=0; i<tools.length; i++){
                if(!(tools[i].itemId==="down_id")) {
                    tools[i].hide();
                }else{
                    tools[i].show();
                }
            }
        }
    },

    /**
     * Function used to reset the addEventPanel, the timeline and the scenario in order to create a new scenario
     * from scratch
     */
    onPlusButton: function() {
        var me = this;
        Ext.Msg.confirm('Confirm', 'The current scenario will be lost.<br />Do you really want to create a' +
            ' new scenario?', function(btn){
           if(btn === 'yes'){
               var scenario_store = Ext.getStore("scenario");
               Ext.getCmp('main-result-view').layout.setActiveItem(0);
               scenario_store.resetScenario();
               Ext.getStore('timeline-store').clear();
               Ext.getCmp('main-result-view').layout.setActiveItem(0);
               me.getView().items.getAt(0).items.getAt(0).down().items.getAt(1).reset();
               me.downloadButton("disable");
           }
        });
    },

    /**
     * Function used to save a non empty scenario. It sends a post request to the Supervisor with the named
     * scenario and its date of saving
     */
    onSaveButton: function(){
        var box = Ext.Msg;
        box.buttonText.ok = 'Save';
        box.prompt("Save Scenario", "Name:", function(btn, name) {
            if (btn === 'ok') {
                var scenario_store = Ext.getStore("scenario");
                if(!scenario_store.isEmptyScenario()){
                    scenario_store.scenario.name = name;
                    scenario_store.scenario.creation_date = Date.now();
                    if(!(name==="")) {
                        Ext.Ajax.request({
                            url: 'http://'+config.supervisor_ip+':'+config.supervisor_port+'/save',
                            jsonData: {scenario: scenario_store.getScenario()},
                            method: 'POST',
                            success: function (response) {
                                var text = response.responseText;
                                console.log("response : ", text);
                            },
                            failure: function () {
                                Ext.Msg.alert('Save Failed: ', 'Error connexion with database!');
                            }
                        });
                    } else{
                        box.alert('Error','The name field is empty');
                    }
                } else{
                    box.buttonText.ok = 'OK';
                    box.alert('Error','Empty scenario');
                }
                //we delete the name and the creation date because they stay if we do not delete them
                delete scenario_store.scenario.name;
                delete scenario_store.scenario.creation_date;
            }
        });
        box.buttonText.ok = 'OK';
    },

    /**
     * Function used to load a scenario selected in a list of scenarios saved in the mongodb database
     */
    onLoadButton: function(){
        Ext.Ajax.request({
            url: 'http://'+config.supervisor_ip+':'+config.supervisor_port+'/findall',
            method: 'GET',
            success: function (response) {
                var arrayScenario = JSON.parse(response.responseText).scenarios;
                var store = Ext.create('Ext.data.ArrayStore', {
                    data : arrayScenario,
                    fields : ['id', 'scenario_name']
                });
                var loadWin = Ext.create('Ext.window.Window', {
                    id: 'recordWindow',
                    title: 'Load Scenario',
                    resizable: false,
                    buttonAlign: 'center',
                    closable: true,
                    width: 300,
                    minHeight: 200,
                    y: 150,
                    layout: {
                        type: 'hbox'
                    },
                    plain:true,
                    modal:true,
                    defaults : {
                        anchor: '100%'
                    },
                    items: [
                        {
                            xtype: 'combobox',
                            id: 'scenario_combobox',
                            margin: 10,
                            fieldLabel: 'Scenarios',
                            labelStyle: 'font-weight:bold;',
                            name: 'scenario',
                            store: store,
                            valueField: 'id',
                            displayField: 'scenario_name',
                            typeAhead: true,
                            queryMode: 'local',
                            emptyText: 'Select a scenario...'
                        }
                    ],
                    buttons: [
                        {
                            text: 'Load',
                            handler: function(){
                                var combo = Ext.getCmp("scenario_combobox");
                                var id = combo.getValue();
                                if(id === null){
                                    Ext.Msg.alert('Error: ', 'Please select a scenario!');
                                }else {
                                    Ext.Ajax.request({
                                        url: 'http://'+config.supervisor_ip+':'+config.supervisor_port+'/load',
                                        params: {id: id},
                                        method: 'GET',
                                        success: function (response) {
                                            var scenario = JSON.parse(response.responseText).scenario;
                                            var scenario_store = Ext.getStore("scenario");
                                            var timeline_store = Ext.getStore("timeline-store");
                                            scenario_store.setScenario(scenario);
                                            timeline_store.insertRawData(scenario);
                                            Ext.getCmp('main-result-view').layout.setActiveItem(0);
                                            loadWin.close(true);
                                        },
                                        failure: function () {
                                            Ext.Msg.alert('Load Failed: ', 'Error connexion with database!');
                                        }
                                    });
                                }
                            }
                        },
                        {
                            text: 'Cancel',
                            handler: function(){
                                loadWin.close(true);
                            }
                        }
                    ]
                }).show();
            },
            failure: function() {
                Ext.Msg.alert('Load Failed: ', 'Error connexion with database!');
            }
        });
    },

    /**
     * Function used to download the results of the last executed scenario
     */
    onDownButton: function() {
        Ext.Ajax.request({
            url: 'http://'+config.supervisor_ip+':'+config.supervisor_port+'/detailedResults',
            method: 'GET',
            success: function () {
                window.open('http://'+config.supervisor_ip+':'+config.supervisor_port+'/detailedResults');
            },
            failure: function () {
                console.log('Error in GET request');
            }
        });
    },

    /**
     * Function used to enable/disable the download button
     * @param arg (enable, disable)
     */
    downloadButton :function(arg){
        var tools = Ext.getCmp('main-result-view').up().up().up().tools,
            i;
        if(arg==="enable"){
            for(i=0; i<tools.length; i++) {
                if (tools[i].itemId === "down_id") {
                    tools[i].enable();
                }
            }
        }else if(arg==="disable"){
            for(i=0; i<tools.length; i++) {
                if (tools[i].itemId === "down_id") {
                    tools[i].disable();
                }
            }
        }
    }
});
