/**
 * Model that defines the different fields of a stresser (consumer or producer)
 */
Ext.define('Swim.model.Stressers', {
    extend: 'Ext.data.Model',

    fields: [
        'id',
        'name',
        'num'
    ]
});