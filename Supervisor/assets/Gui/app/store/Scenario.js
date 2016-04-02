Ext.define('Swim.store.Scenario', {
    extend: 'Ext.data.Store',
    alias: 'store.scenario',
    storeId :'scenario',

    fields: ['scenario'],

    scenario: {
        events:[

        ]
    },

    /**
     * Returns true if there is at least one event in the scenario
     * @returns {boolean}
     */
    isEmptyScenario:function() {
        var me=this;
        return me.scenario.events.length === 0;
    },

    /**
     * Tries to push event in
     * @param input_event
     * @returns {*}
     */
    requestPush:function(input_event) {
        var me=this,
            over_event=null,
            events=me.scenario.events,
            i;

        for (i in events) {
            if (events[i].consumer.id === input_event.consumer.id) {
                if (!(parseInt(events[i].start_time) > parseInt(input_event.start_time) + parseInt(input_event.duration)
                    ||
                    parseInt(input_event.start_time) > parseInt(events[i].start_time) + parseInt(events[i].duration))) {
                    over_event=events[i];
                    break;
                }
            }
        }

        if (!over_event) {
            me.scenario.events.push(input_event);
        }

        return over_event;
    },

    /**
     * Get the scenario
     * @returns {{events}}
     */
    getScenario:function() {
        var me=this;

        return me.scenario;
    },

    /**
     * Reset the scenario
     */
    resetScenario:function(){
        var me=this;
        me.scenario.events = [];
    },

    /**
     * Set the scenario with the events of a given scenario
     * @param scenario
     */
    setScenario:function(scenario) {
        var me=this;
        me.scenario.events = scenario.events;
    },

    /**
     * Get the scenario duration as computed by the supervisor
     */
    getScenarioDuration:function() {
        var me=this,
            i,
            current = 0,
            scenarioDuration = 0;

        for(i= 0;i<me.scenario.events.length;i++){
            current = parseInt(me.scenario.events[i].start_time)+
                parseInt(me.scenario.events[i].duration)+
                parseInt(me.scenario.events[i].producer.timeout);
            if(scenarioDuration<current){
                scenarioDuration = current;
            }
        }

        return scenarioDuration+5500;
    }
});