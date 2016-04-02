/**
 * Created by remiprevost on 08/01/2016.
 */
Ext.define('Swim.store.TimelineStore', {
    extend: 'Ext.data.Store',
    alias: 'store.timeline-store',
    storeId: 'timeline-store',

    data: [
        {consumer:'C1'},
        {consumer:'C2'},
        {consumer:'C3'},
        {consumer:'C4'},
        {consumer:'C5'},
        {consumer:'C6'},
        {consumer:'C7'},
        {consumer:'C8'},
        {consumer:'C9'},
        {consumer:'C10'}
    ],

    last_index:2,
    last_data_tab:[0,0,0,0,0,0,0,0,0,0],
    data_size:[0,0,0,0,0,0,0,0,0,0],


    /**
     * Insert into the data of the store the new couple data1 and data2 into the corresponding consumer and
     * expand the fields of the timeline if necessary
     * @param consumer
     * @param data1
     * @param data2
     */
    addData: function(consumer,data1,data2) {
        var me=this,
            timeline=Ext.getCmp('timeline'),
            fields,
            data;

        if (consumer <= 0 || consumer > 10) {
            return;
        }

        consumer--;

        if (data1 < 0 || data2 < 0) {
            return;
        }

        data1 = -parseInt(data1);
        data2 = -parseInt(data2);

        if (typeof timeline === "undefined" || timeline === null) {
            return;
        }

        if (me.last_index <= me.last_data_tab[consumer]) {
            me.last_index+=2;
            fields=me.expandFields(timeline.getSeries()[0]._yField);
            timeline.setSeries([{type: 'bar',
                axis: 'left',
                xField: 'consumer',
                yField: fields,
                stacked: true,
                style: {
                    strokeStyle: 'rgba(0,0,0,0)'
                }}]);
            timeline.getAxes()[0].setFields(fields);
        }
        me.last_data_tab[consumer]+=2;
        data=me.getAt(consumer).data;
        data=me.expandData(data,data1,data2,consumer);
        if (data1 > me.data_size[consumer]) {
            me.invertData(data,data1,consumer);
        }
        else {
            me.getRelativeValue(data,consumer);
            me.data_size[consumer]=data1+data2;
        }
        me.removeAt(consumer);
        me.insert(consumer,data);
        setTimeout(
            function(timeline){timeline.redraw()}
            ,500,
            timeline
        );
    },

    /**
     * Take the array of fields with data'n' as last key and push into it data'n+1' and data'n+2
     * @param fields
     * @returns expanded fields
     */
    expandFields: function(fields) {
        var me=this;
        fields.push('data' + (me.last_index - 1));
        fields.push('data' + me.last_index);
        return fields;
    },

    /**
     * Insert a data'n' and data'n+1' into the JSON data and
     * put the input values data1 and data2 into data'n' and data'n+1'
     * @param data
     * @param data1
     * @param data2
     * @returns expanded data
     */
    expandData: function(data,data1,data2,consumer){
        var me=this;
        data['data' + (me.last_data_tab[consumer] - 1)] = data1;
        data['data' + me.last_data_tab[consumer]] = data2;
        return data;
    },

    /**
     * Invert the data to keep them in order
     * @param data
     * @returns ordered data
     */
    invertData:function(data, misplaced_start, consumer) {
        var me=this,
            i,
            total= 0,
            last_data_num=me.last_data_tab[consumer];

        for (i = 1; i < last_data_num- 2;i+=2) {
            total+=data['data'+i];
            if (misplaced_start > total) {
                data=me.shiftData(data,i,last_data_num);

                // recompute relative value
                total-=data['data'+(i+2)];
                data['data'+i]-=total;
                total= data['data'+i];
                total+= data['data'+(i+1)];
                data['data'+(i+2)]-=total;
                break;
            }
            else {
                total+=data['data'+(i+1)];
            }
        }

        return data;
    },

    /**
     * Transform the data'n-1' absolute value from data into a relative one
     * @param data
     * @param consumer
     * @returns data with relative values
     */
    getRelativeValue: function(data,consumer) {
        var me=this,
            last_num = me.last_data_tab[consumer]-2,
            data_target = 'data'+(last_num+1);
        if (last_num === 0) {
            return data;
        }

        data[data_target] = data[data_target] - me.data_size[consumer];
    },

    /**
     * Called when the last event is misplaced. Reorder the events in the data JSON
     * @param data
     * @param from
     * @param to
     * @returns reordered data
     */
    shiftData:function(data,from,to) {
        var i,
            data_clone = data.constructor();

        for (var attr in data) {
            if (data.hasOwnProperty(attr)) data_clone[attr] = data[attr];
        }

        for (i = from;i <= to;i++){
            data_clone['data'+(((i + 2) % (to+1)) + from*parseInt((i + 2) / (to+1)))]=data['data'+i];
        }

        for (i = from;i<= to;i++) {
            data['data'+i]=data_clone['data'+i];
        }

        return data;
    },

    /**
     * Remove all the data from the store
     */
    clear:function() {
        var me=this,
            timeline=Ext.getCmp('timeline');

        me.removeAll();
        me.add(
            {consumer:'C1'},
            {consumer:'C2'},
            {consumer:'C3'},
            {consumer:'C4'},
            {consumer:'C5'},
            {consumer:'C6'},
            {consumer:'C7'},
            {consumer:'C8'},
            {consumer:'C9'},
            {consumer:'C10'}
        );
        me.last_index=2;
        me.last_data_tab=[0,0,0,0,0,0,0,0,0,0];
        me.data_size=[0,0,0,0,0,0,0,0,0,0];

        timeline.setSeries([{type: 'bar',
            axis: 'left',
            xField: 'consumer',
            yField: ['data1','data2'],
            stacked: true,
            style: {
                strokeStyle: 'rgba(0,0,0,0)'
            }}]);
        timeline.getAxes()[0].setFields(['data1','data2']);
    },

    insertRawData:function(scenario) {
        var me=this,
            i,
            events = scenario.events,
            consumer_store=Ext.getStore("consumers");

        me.clear();

        for (i = 0; i < events.length; i++) {
            me.addData(
                consumer_store.getAt(consumer_store.find('id',events[i].consumer.id)).data.num,
                events[i].start_time,
                events[i].duration
            );
        }
    }
});