var Handlebars = require('handlebars');
module.exports = Handlebars;

/*call activate function*/
activate();

/*all functions which is activate after Handlbar is calling*/
function activate() {
    Handlebars.registerHelper('control-text', controlTextRegister);
    Handlebars.registerHelper('control-select', controlSelectRegister);
    Handlebars.registerHelper('control-checkbox', controlCheckboxRegister);
    Handlebars.registerHelper('time', timeRegister);
}


function controlTextRegister(name, obj) {
    var dataValue = obj.data.root.model.name;

    let args = Array.prototype.slice.call(arguments)
        , options = args.pop() // Handlebar options, always last
        , attribute = args.shift()
        , conf = args.shift(); // Input configuration defined in JSON
    console.log(args, "args")
    // Parse input conf and set defaults
    conf = (conf && JSON.parse(conf)) || {};
    conf.className || (conf.className = 'input-lg');
    conf.placeholder || (conf.placeholder = '');

    if (dataValue != undefined) {
        return new Handlebars.SafeString(`<input type="text" class="form-control ${conf.className}" data-attribute="${attribute}" value="${dataValue}" placeholder="${conf.placeholder}">`);
    } else {
        return new Handlebars.SafeString(`<input type="text" class="form-control ${conf.className}" data-attribute="${attribute}" placeholder="${conf.placeholder}">`);

    }
    //return new Handlebars.SafeString(`<input type="text" class="form-control ${conf.className}" data-attribute="${attribute}" placeholder="${conf.placeholder}">`);
}

function controlSelectRegister(name, obj) {

    var dataValue = obj.data.root.model.framework;

    let args = Array.prototype.slice.call(arguments)
        , options = args.pop() // Handlebar options, always last
        , attribute = args.shift()
        , conf = args.shift(); // Input configuration defined in JSON

    // Parse input conf and set defaults
    conf = (conf && JSON.parse(conf)) || {};
    conf.className || (conf.className = 'input-lg');
    conf.placeholder || (conf.placeholder = '');


    // Parse the options for the select field which are defined like this
    // {{#control-select}}
    //  value1:string1
    //  value2:string2
    // {{/control-select}}

    let opts = (options.fn ? options.fn(this) : '').split('\n').map(line=>{
        line = line.replace(/^ *| *$/g,'');
    let arr = line.split(':');
    let value = arr.shift();
    // In case : is missing from the line, value == string
    let string = arr.join(':') || line;
    if(dataValue != undefined && dataValue != value)
        return line ? `<option value="${value}">${string}</option>` : ''
    else if(dataValue != undefined && dataValue == value)
        return line ? `<option value="${value}" selected>${string}</option>` : ''
    else
        return line ? `<option value="${value}">${string}</option>` : ''

}).join('');


    return new Handlebars.SafeString(`<select type="text" class="form-control ${conf.className}" data-attribute="${attribute}" placeholder="${conf.placeholder}">${opts}</select>`);

}

function controlCheckboxRegister(name, obj) {
    console.log("Test3");

    var dataValue = obj.data.root.model.pets;
    let args = Array.prototype.slice.call(arguments)
        , options = args.pop() // Handlebar options, always last
        , attribute = args.shift()
        , conf = args.shift(); // Input configuration defined in JSON

    // Parse input conf and set defaults
    conf = (conf && JSON.parse(conf)) || {};
    conf.className || (conf.className = 'input-lg');
    conf.placeholder || (conf.placeholder = '');

    // Parse the values for the checkboxes which are defined like this
    // {{#control-select}}
    //  value1:string1
    //  value2:string2
    // {{/control-select}}
    let checkboxes = (options.fn ? options.fn(this) : '').split('\n').map(
        line=>{
        line = line.replace(/^ *| *$/g,'');
    let returnedValue;
    let arr = line.split(':');
    let value = arr.shift();
    // In case : is missing from the line, value == string
    let string = arr.join(':') || line;

    returnedValue = line ? `<input type="checkbox" id="${attribute}-${value}" value="${value}" data-attribute="${attribute}">
<label for="${attribute}-${value}">${string}</label>` : '';
    if (dataValue != undefined) {
        dataValue.forEach(function (data) {
            if (data == value) {
                console.log(line, "worked")
                returnedValue =  line ? `<input checked type="checkbox" id="${attribute}-${value}" value="${value}" data-attribute="${attribute}">
<label for="${attribute}-${value}">${string}</label>` : '';
            }
        });
    }
    return returnedValue;


}).join('');
    console.log(checkboxes, "checkboxes")

    return new Handlebars.SafeString(`<div class="checkbox checkbox-horizontal">
${checkboxes}
</div>`);
}

function timeRegister() {
    return new Date().toString();
}


