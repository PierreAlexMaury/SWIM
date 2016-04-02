Ext.define('Swim.view.CreationView.AddEventPanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.addEventController',

    /**
     * Function used to add an event to the current scenario
     */
    onAddButtonClick: function() {
        var scenario_store = Ext.getStore("scenario"),
            timeline_store = Ext.getStore("timeline-store"),
            consumer_store = Ext.getStore("consumers"),
            form = this.getView(),
            values,
            over_event;

        if (form.isValid()) {
            values=form.getValues();

            over_event = scenario_store.requestPush(
                {
                    start_time: values.start_time,
                    duration: values.duration,
                    consumer: {
                        id: values.consumer,
                        speed: values.cpackets,
                        size: values.csize
                    },
                    producer: {
                        id: values.producer,
                        timeout: values.processtime,
                        size: values.psize
                    }
                }
            );

            if (over_event) {
                Ext.Msg.alert('Failed to create event', 'The event you are trying to create is over a ' +
                    'previous one starting at '+ over_event.start_time + 's and lasting '+over_event.duration +
                    's');
            }else{
                Ext.toast({
                    html: 'Your event has been successfully added!',
                    closable: false,
                    align: 't',
                    autoCloseDelay: 2000,
                    stickOnClick: false,
                    stickWhileHover: false,
                    slideInDuration: 400
                });
                Ext.getCmp('main-result-view').layout.setActiveItem(0);
                timeline_store.addData(
                    consumer_store.getAt(consumer_store.find('id',values.consumer)).data.num,
                    values.start_time,
                    values.duration
                );
            }
        } else {

            Ext.Msg.alert('New Event', 'Please correct form errors.');
        }
    },

    /**
     * Function that resets the form
     */
    onResetButtonClick: function() {
        this.getView().reset();
    }

});