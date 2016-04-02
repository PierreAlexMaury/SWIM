/**
 * Created by remiprevost on 14/01/2016.
 */
Ext.define('Swim.view.ProgressBar.ProgressBar', {
    xtype:'progressBar',
    extend:'Ext.panel.Panel',
    duration:0,
    startOnRender:false,

    listeners: {
        activate: function() {
            var me=this;

            if (me.startOnRender) {
                me.start();
            }
        }
    },

    setDuration:function(duration) {
        var me=this;

        if (typeof duration !== 'undefined' && duration !== null) {
            me.duration=duration;
        }
        else {
            Ext.raise('progressBar : undefined duration');
        }
    },

    start:function(duration) {
        var me = this,
            circle2 = $(".circle_2-pb"),
            text = $("#percent-text-pb"),
            svg = $("#svg-pb"),
            timer,
            percent= 0;

        if (typeof duration !== 'undefined' && duration !== null) {
            me.duration=duration;
        }

        text.html("0%");
        text.css("moz-animation","");
        text.css("-webkit-animation","");
        text.css("animation","");
        text.css("color","rgba(115, 128, 135, 0.25)");
        svg.css("display", "none");
        circle2.attr("class", "circle_2-pb");
        circle2.css("stroke-dasharray", "0 345");

        setTimeout(function(){
            svg.css("display", "block");
            circle2.attr("class", "circle_2-pb fill_circle-pb");
            circle2.css("moz-animation","fill-stroke-pb "+me.duration+"s linear forwards, stroke-pb 1s infinite");
            circle2.css("-webkit-animation","fill-stroke-pb "+me.duration+"s linear forwards, stroke-pb 1s infinite");
            circle2.css("animation","fill-stroke-pb "+me.duration+"s linear forwards, stroke-pb 1s infinite");

            text.css("moz-animation","text-color-pb "+me.duration+"s linear forwards");
            text.css("-webkit-animation","text-color-pb "+me.duration+"s linear forwards");
            text.css("animation","text-color-pb "+me.duration+"s linear forwards");

            timer = setInterval(function() {
                percent++;
                if (percent > 100) {
                    percent = 100;
                    clearInterval(timer);
                }
                text.html(percent+"%");
            },me.duration*10);
        },500);
    },

    html:'<div class="wrap-pb">'+
    '<div class="circle-pb">'+
    '<p id="percent-text-pb">0%</p>'+
    '</div>'+
    '<svg id="svg-pb" width="130px" height="130px">'+
    '<circle class="circle_2-pb" stroke-position="outside" stroke-width="10" fill="none" cx="65" cy="65" r="55" stroke="#166ab5"></circle>'+
    '</svg>'+
    '</div>'
});