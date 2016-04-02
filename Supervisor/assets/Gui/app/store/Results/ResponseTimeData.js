/**
 * Created by remiprevost on 11/01/2016.
 */
Ext.define('Swim.store.Results.ResponseTimeData', {
    extend: 'Ext.data.Store',
    alias: 'store.responsetimedata',
    storeId: 'responsetimedata',
    model:'Swim.model.ResultsData',

    data: [],

    addData:function(json){
        var me=this;
        me.removeAll();
        me.setData([
            {name:'Max', value:json.max_response_time.toFixed(1), unit:'ms'},
            {name:'Min', value:json.min_response_time.toFixed(1), unit:'ms'},
            {name:'Average', value:json.average_response_time.toFixed(1), unit:'ms'}
        ]);
    }
});