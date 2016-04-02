Ext.define('Swim.view.CreationView.AddEventPanel', {
    extend: 'Ext.form.Panel',
    xtype: 'add-event-panel-view',
    requires: [
        'Swim.store.Stressers.Consumers',
        'Swim.store.Stressers.Producers'
    ],

    controller: 'addEventController',

    title: 'Create new event',
    titleAlign: 'center',
    frame: true,
    bodyPadding: 5,
    scrollable: true,
    width: 400,
    height:554,
    margin: 10,

    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 110,
        msgTarget: 'side' //error message on the right of the field
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
     * @returns {*[]} the table of components (the different fields of a create event panel)
     */
    buildItems:function(){
        return [
            {
                xtype: 'fieldset',
                title: 'Event info',
                height: 112,
                defaultType: 'numberfield',
                defaults :{
                    anchor: '100%' //field arrange vertically, stretched to full width
                },

                items: [
                    {allowBlank: false, minValue: 0, fieldLabel: 'Start time (ms)', name: 'start_time',
                        emptyText: 'start time (ms)'},
                    {allowBlank: false, minValue: 0, fieldLabel: 'Duration (ms)', name: 'duration',
                        emptyText: 'duration (ms)'}
                ]
            },
            {
                xtype: 'fieldset',
                title: 'Consumer info',
                height: 154,
                defaultType: 'numberfield',
                defaults : {
                    anchor: '100%'
                },

                items: [
                    {
                        xtype: 'combobox',
                        fieldLabel: 'Consumer',
                        labelStyle: 'font-weight:bold;',
                        name: 'consumer',
                        value: 'idc01',
                        store: {
                            type: 'consumers'
                        },
                        valueField: 'id',
                        displayField: 'name',
                        typeAhead: true, //populate and autoselect the remainder of the text being typed
                        queryMode: 'local', //should be 'remote' to load the Store dynamically, to be developed
                        emptyText: 'Select a consumer...'
                    },
                    {allowBlank: false, minValue: 1, maxValue: 1000, fieldLabel: 'Packets/s', name: 'cpackets',
                        emptyText: 'packets sent per second'},
                    {allowBlank: false, minValue: 0, maxValue: 64000, fieldLabel: 'Packet size (o)', name: 'csize',
                        emptyText: 'packet size in octet'}
                ]
            },
            {
                xtype: 'fieldset',
                title: 'Producer info',
                height: 154,
                margin: 0,
                defaultType: 'numberfield',
                defaults : {
                    anchor: '100%'
                },

                items: [
                    {
                        xtype: 'combobox',
                        fieldLabel: 'Producer',
                        labelStyle: 'font-weight:bold;',
                        name: 'producer',
                        value: 'idp01',
                        store: {
                            type: 'producers'
                        },
                        valueField: 'id',
                        displayField: 'name',
                        typeAhead: true,
                        queryMode: 'local',
                        emptyText: 'Select a producer...'
                    },
                    {allowBlank: false, minValue: 0, maxValue: 64000, fieldLabel: 'Packet size (o)', name: 'psize',
                        emptyText: 'packet size in octet'},
                    {allowBlank: false, minValue: 0, fieldLabel: 'Processing time', name: 'processtime',
                        emptyText: 'processing time (ms)'}
                ]
            },
            {
                buttons: [
                    {
                        text: 'Reset',
                        handler: 'onResetButtonClick'
                    },
                    {
                        xtype: 'component',//use to make a space between the buttons
                        flex: 1
                    },
                    {
                        text: 'Add',
                        disabled: true,
                        formBind: true,
                        handler: 'onAddButtonClick'
                    }
                ]
            },
            {
                style: 'font-style: italic',
                html: [
                    'Over 100 packets/s we don\'t ensure a precision higher than 90%'
                ]
            }
        ]
    }
});