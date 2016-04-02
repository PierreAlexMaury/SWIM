/**
 * Consumers stored
 */
Ext.define('Swim.store.Stressers.Consumers', {
    extend: 'Ext.data.ArrayStore',

    alias: 'store.consumers',

    model: 'Swim.model.Stressers',

    storeId: 'consumers',

    data: [
        ["idc01", 'C1',1],
        ["idc02", 'C2',2],
        ["idc03", 'C3',3],
        ["idc04", 'C4',4],
        ["idc05", 'C5',5],
        ["idc06", 'C6',6],
        ["idc07", 'C7',7],
        ["idc08", 'C8',8],
        ["idc09", 'C9',9],
        ["idc10", 'C10',10]
    ]
});