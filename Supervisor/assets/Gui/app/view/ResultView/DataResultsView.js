/**
 * Created by remiprevost on 11/01/2016.
 */
Ext.define('Swim.view.ResultView.DataResultsView', {
    extend: 'Ext.view.View',
    xtype: 'dataresultsview',
    requires: [
        'Swim.store.Results.PacketLossData',
        'Swim.store.Results.ResponseTimeData'
    ],
    itemSelector:'div.line',
    dataTitle:'default title',
    margin:'10 10 0 10',
    padding:'0 0 0 16',
    width:200,
    style:{
        'background-color':'rgba(115, 128, 135, 0.25) !important',
        'max-height':'145px !important'
    },

    /**
     * Function used to initialize the view
     */
    initComponent:function(){
        var me = this;
        me.tpl = new Ext.XTemplate(
            '<h2>'+me.dataTitle+'</h2>' +
            '<tpl for=".">',
            '<div class="line">',
            '<p>{name} : {value}{unit}</p>',
            '</div>',
            '</tpl>'
        );
        me.callParent(arguments);
    }
});