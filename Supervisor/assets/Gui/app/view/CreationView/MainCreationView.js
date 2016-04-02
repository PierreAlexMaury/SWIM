Ext.define('Swim.view.CreationView.MainCreationView', {
    extend: 'Ext.panel.Panel',
    xtype:'main-creation-view',
    requires: [
        'Swim.view.CreationView.AddEventPanel',
        'Swim.view.Timeline.Timeline',
        'Ext.draw.Component'
    ],

    id: 'main-creation-view',

    layout: {
        type:'hbox',
        align:'stretch'
    },

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
     * @returns {*[]} the table of components (two columns here: the timeline and the create event panel)
     */
    buildItems:function(){
        return [
            {
                xtype:'timeline',
                margin: '10 10 10 10',
                region:'center',
                layout:'fit',
                flex:2
            },
            {
                xtype:'add-event-panel-view',
                region:'east',
                width:400
            }
        ]
    }
});