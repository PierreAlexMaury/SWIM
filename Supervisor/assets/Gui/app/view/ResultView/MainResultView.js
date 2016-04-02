Ext.define('Swim.view.ResultView.MainResultView', {
    extend: 'Ext.panel.Panel',
    xtype:'main-result-view',
    requires: [
        'Swim.view.ResultView.Results',
        'Swim.view.ProgressBar.ProgressBar'
    ],
    layout:'card',
    id: 'main-result-view',
    listener:{

    },
    activeItem:0,

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
                layout:{
                    type:'hbox',
                    pack:'center'
                },
                margin:'100 0 0 0',
                items:[
                    {
                        xtype:'label',
                        text:'No results to display'
                    }
                ]
            },
            {
                xtype:'progressBar',
                id: 'progress-bar'
            },
            {
                xtype:'results'
            }
        ]
    }
});