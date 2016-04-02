/**
 * Producers stored
 */
Ext.define('Swim.store.Stressers.Producers', {
    extend: 'Ext.data.ArrayStore',

    alias: 'store.producers',

    model: 'Swim.model.Stressers',

    storeId: 'producers',

    data: [
        ["idp01", 'P1']
    ]
});