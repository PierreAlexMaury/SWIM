Ext.define('Swim.view.TabbarView.TabbarView', {
    extend: 'Ext.tab.Panel',
    requires: [
        'Swim.view.CreationView.MainCreationView',
        'Swim.view.ResultView.MainResultView'
    ],
    xtype:'tabbar-view',
    id: 'tabbarid',

    controller: 'main',
    height:'100%',
    layout:'fit',
    tabPosition:'bottom',
    plain:'true',
    tabBar:{
        layout:{
            pack:'center'
        },
        height: 55
    },

    listeners: {
        tabchange: 'onSwitchPanel',
        scope: 'controller'
    },

    /**
     * Function used to initialize the view
     */
    initComponent:function(){
        var me = this;
        me.items=me.buildItems();
        me.callParent(arguments);
    },

    /**cd Su
     * Function which builds the components of the view (defined in the items table)
     * @returns {*[]} the table of components (the two pages: Scenario Edition and Result)
     */
    buildItems:function(){
        return [{
            iconCls: 'fa fa-file-text-o',
            items:[{
                xtype:'main-creation-view'
            }]
        },{
            iconCls: 'fa fa-line-chart',
            items:[{
                xtype:'main-result-view'
            }]
        }]
    }
});