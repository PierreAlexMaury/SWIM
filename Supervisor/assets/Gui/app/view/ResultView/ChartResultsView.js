/**
 * Created by remiprevost on 11/01/2016.
 */
Ext.define('Swim.view.ResultView.ChartResultsView', {
    extend: 'Ext.panel.Panel',
    xtype:'chartresultsview',
    width: '90%',
    margin:'0 110 0 0',
    layout:'fit',

    chartTitle:'default title',
    yTitle:'default title',
    c_id:'chart-id',
    insetPaddingLeft:20,

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
        var me=this;
        return [
            {
                xtype: 'cartesian',
                reference: 'chart',
                colors:['#166AB5'],
                height: 200,
                store: me.dataStore,
                id: me.c_id,
                insetPadding: {
                    top: 40,
                    left: me.insetPaddingLeft,
                    right: 40,
                    bottom: 5
                },
                sprites: [{
                    type: 'text',
                    text: me.chartTitle,
                    fontSize: 22,
                    width: 100,
                    height: 30,
                    x: 60, // the sprite x position
                    y: 35  // the sprite y position
                }],
                axes: [{
                    type: 'numeric',
                    position: 'left',
                    title: me.yTitle,
                    grid: true,
                    fields: 'value',
                    label: {
                        renderer: 'onAxisLabelRender'
                    }
                }, {
                    type: 'numeric',
                    position: 'bottom',
                    title: 'time (ms)',
                    grid: true,
                    fields: 'time',
                    minimum:0,
                    label: {
                        textPadding: 0,
                        rotate: {
                            degrees: -45
                        }
                    }
                }],
                series: [{
                    type: 'line',
                    xField: 'time',
                    yField: 'value',
                    highlight: true,
                    showMarkers: false,
                    style: {
                        lineWidth: 2
                    }
                }]
            }
        ]
    }
});