/**
 * Created by remiprevost on 11/01/2016.
 */
Ext.define('Swim.view.ResultView.Results', {
    extend: 'Ext.panel.Panel',
    xtype:'results',
    requires: [
        'Swim.view.ResultView.DataResultsView',
        'Swim.view.ResultView.ChartResultsView'
    ],
    layout:{
        type:'vbox',
        align:'stretch'
    },
    defaults: {
        layout:{
            type:'hbox',
            align:'stretch'
        }
    },
    id: 'results',

    /**
     * Function used to initialize the view
     */
    initComponent:function(){
        var me = this;
        me.items=me.buildItems();
        me.callParent(arguments);
    },

    /**
     * Function which builds the components of the view (defined in the items table)
     * @returns {*[]} the table of components (the Result page)
     */
    buildItems:function(){
        return [
            {
                items: [
                    {
                        xtype:'dataresultsview',
                        store: {
                            type:'packetlossdata'
                        },
                        dataTitle:'Packet loss'
                    },
                    {
                        xtype:'chartresultsview',
                        c_id:'chart-packet-loss',
                        chartTitle:'Packet loss chart',
                        insetPaddingLeft:12,
                        yTitle:'Lost packets',
                        dataStore: {
                            type:'packetlosschart'
                        }
                    }
                ]
            },
            {
                layout:{
                    type:'hbox',
                    align:'stretch'
                },
                items: [
                    {
                        xtype:'dataresultsview',
                        store: {
                            type:'responsetimedata'
                        },
                        dataTitle:'Response time'
                    },
                    {
                        xtype:'chartresultsview',
                        c_id:'chart-response-time',
                        chartTitle:'Response time chart',
                        yTitle:'Response time (ms)',
                        dataStore: {
                            type:'responsetimechart'
                        }
                    }
                ]
            },
            {
                xtype:'panel',
                layout:{
                    type:'hbox',
                    align:'stretch'
                },
                id:'timeline-container',
                items: [
                    {
                        width:220,
                        height:200
                    }
                ]
            }
        ]
    }
});