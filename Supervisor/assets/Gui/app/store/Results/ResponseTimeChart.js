/**
 * Created by remiprevost on 11/01/2016.
 */
Ext.define('Swim.store.Results.ResponseTimeChart', {
    extend: 'Ext.data.Store',
    alias: 'store.responsetimechart',
    storeId: 'responsetimechart',

    fields: ['time', 'value'],

    data : [],

    addData:function(json){
        var me=this,
            array=json.average_response_time_array,
            step=json.time_slot,
            i,
            time=0;


        me.removeAll();

        for (i=0;i<array.length;i++) {
            if (array[i] != null && array[i] !== 0 && array[i] >= 0) {
                me.add({time:time,value:array[i]})
            }
            time+=step;
        }
    }
});