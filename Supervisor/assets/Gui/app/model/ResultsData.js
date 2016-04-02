/**
 * Created by remiprevost on 11/01/2016.
 */
Ext.define('Swim.model.ResultsData', {
    extend: 'Ext.data.Model',

    fields: [
        { name:'name', type:'string' },
        { name:'value'},
        { name:'unit', type:'string'}
    ]
});