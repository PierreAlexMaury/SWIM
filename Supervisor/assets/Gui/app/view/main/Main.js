/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('Swim.view.main.Main', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Swim.view.TabbarView.TabbarView',
        'Swim.view.main.MainController',
        'Swim.view.CreationView.AddEventPanelController'
    ],

    controller: 'main',

    xtype: 'app-main',

    layout: {
        type: 'fit'
    },

    title: {
        xtype: 'title',
        text: "<img style='position:absolute; left: 0; margin-top: -6px; width:40px'  src='resources/duck.png' />" +
        "<span style='top: 7px; left: 45px; font-size: 20px; position: absolute;font-weight: 700;color: white'>SWIM</span>" +
        "<span style='font-size: 25px;font-weight: 600;color:white' id='page_title'>" +
        "Scenario Edition</span>",
        height: 30
    },

    titleAlign: 'center',

    tools: [
        {
            type :'next',
            itemId:'next_id',
            handler: 'onClickButton'
        },
        {
            type:'save',
            itemId:'save_id',
            handler: 'onSaveButton'
        },
        {
            type:'up',
            itemId:'load_id',
            handler: 'onLoadButton'
        },
        {
            type:'plus',
            itemId: 'plus_id',
            handler: 'onPlusButton'
        },
        {
            type:'down',
            itemId: 'down_id',
            handler: 'onDownButton',
            hidden: true,
            disabled: true
        }
    ],

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
     * @returns {*[]} the table of components (the Tabbar View)
     */
    buildItems:function(){
        return [{
            xtype:'tabbar-view'
        }]
    }
});