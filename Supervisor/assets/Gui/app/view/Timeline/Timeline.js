/**
 * Created by remiprevost on 06/01/2016.
 */
Ext.define('Swim.view.Timeline.Timeline', {
    extend: 'Ext.panel.Panel',
    xtype: 'timeline',
    requires:['Ext.chart.*'],
    layout: 'vbox',

    t_orientation:'v',
    t_fields:['data1','data2'],
    t_height:'100%',
    t_width:'100%',
    t_margin:'0 0 0 0',
    t_flipXY:false,
    t_insetPadding:{
        top: 0,
        left: 10,
        right: 10,
        bottom: 10
    },
    t_id:'timeline',
    t_time_axe_position:'left',
    t_time_axe_maximum:0,
    t_time_axe_minimum:null,
    t_time_axe_label_rotate:0,
    t_consumer_axe_position:'top',
    t_consumer_axe_renderer:function(axis, label){
        return -parseInt(label);
    },
    t_consumer_axe_label_rotate:-90,
    t_store:null,
    t_listeners:null,

    /**
     * Initialize the timeline
     */
    initComponent: function() {
        var me = this,
            index = me.t_orientation === 'h' ? 0 : 1;
        me.items=[];
        if (me.t_orientation === 'v') {
            me.items.push({
                xtype:'label',
                text:'Timeline :',
                margin:'0 0 0 30',
                height:35,
                style:{
                    'font-size':'16px',
                    color:'#166AB5',
                    'text-align':'center',
                    'font-weight':400
                }
            });
        }

        me.items.push({
            xtype: 'cartesian',
            width: me.t_width,
            height: me.t_height,
            margin: me.t_margin,
            flipXY: me.t_flipXY,
            colors: ['rgba(255,255,255,0)','#166AB5','rgba(255,255,255,0)','#4588C4'],
            id:me.t_id,
            animation:{
                easing:'ease',
                duration:'400'
            },
            store: me.t_store === null ? Ext.getStore('timeline-store') : me.t_store,
            insetPadding: me.t_insetPadding,
            axes: [
                {
                    type: 'numeric',
                    position: me.t_time_axe_position,
                    grid: true,
                    fields: me.t_fields,
                    renderer:me.t_consumer_axe_renderer,
                    title: {
                        text: 'Time (ms)',
                        fontSize: 14
                    },
                    label: {
                        rotate: {
                            degrees: me.t_time_axe_label_rotate
                        }
                    }
                }, {
                    type: 'category',
                    position: me.t_consumer_axe_position,
                    fields: ['consumer'],
                    label: {
                        rotate: {
                            degrees: me.t_consumer_axe_label_rotate
                        }
                    },
                    title: {
                        text: 'Consumers',
                        fontSize: 14
                    }
                }
            ],
            series: [
                {
                    type: 'bar',
                    xField: 'consumer',
                    yField: me.t_fields,
                    style: {
                        strokeStyle: 'rgba(0,0,0,0)'
                    }
                }
            ],
            listeners: me.t_listeners
        });



        if (me.t_time_axe_maximum != null) {
            me.items[index].axes[0].maximum=me.t_time_axe_maximum;
        }

        if (me.t_time_axe_minimum != null) {
            me.items[index].axes[0].minimum=me.t_time_axe_minimum;
        }

        this.callParent();
    }
});