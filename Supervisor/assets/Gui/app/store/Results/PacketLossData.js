/**
 * Created by remiprevost on 11/01/2016.
 */
Ext.define('Swim.store.Results.PacketLossData', {
    extend: 'Ext.data.Store',
    alias: 'store.packetlossdata',
    storeId: 'packetlossdata',
    model:'Swim.model.ResultsData',

    data: [],

    addData:function(json){
        var me=this;
        me.removeAll();
        me.setData([
            {name:'Sent packets', value:json.total_sent_packets, unit:''},
            {name:'Lost packets', value:json.total_lost_packets, unit:''},
            {name:'Lost average', value:(json.total_lost_packets/json.total_sent_packets*100).toFixed(1), unit:'%'}
        ]);
    }
});