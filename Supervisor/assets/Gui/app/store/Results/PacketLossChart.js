/**
 * Created by remiprevost on 11/01/2016.
 */
Ext.define('Swim.store.Results.PacketLossChart', {
    extend: 'Ext.data.Store',
    alias: 'store.packetlosschart',
    storeId: 'packetlosschart',

    fields: ['time', 'value'],
    data:[],

    addData:function(json){
        var me=this,
            array=json.lost_packets_array,
            step=json.time_slot,
            i,
            time=0;


        me.removeAll();

        for (i=0;i<array.length;i++) {
            if (array[i] != null) {
                me.add({time:time,value:array[i]})
            }
            time+=step;
        }
    }
});