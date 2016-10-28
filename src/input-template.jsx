var m = require('mithril');
var Handlebars = require('./utils/handlebars.js');
var Model = require('lw-model');

module.exports = function(opt, app){
    return m.component(View, opt, app);
}

var View = {
    controller: function(args = {}, app) {
        this.template = m.prop(defaultTemplate);
        this.model = new Model();
        this.state = {
            complete:false
        }
        this.onkeyup = (val)=>{
            this.template(val);
        }
        this.onchange = (e)=>{
            if(e.target.getAttribute('type') == 'checkbox'){
                var arr = this.model.get(e.target.getAttribute('data-attribute')) || [];
                if(e.target.checked){
                    if(arr.indexOf(e.target.value) == -1){
                        arr.push(e.target.value);
                    }
                }else{
                    if(arr.indexOf(e.target.value) != -1){
                        arr.splice(arr.indexOf(e.target.value), 1);
                    }
                }
                this.model.set(e.target.getAttribute('data-attribute'), arr)
            }else
                this.model.set(e.target.getAttribute('data-attribute'), e.target.value)
        }
        this.ontrigger = (e)=>{
            let method = e.target.getAttribute('data-trigger');
            if(method && this[method])
                this[method]();
        }
        this.submit = (e)=>{
            this.state.complete = true;
        }
    }
    , view: function(ctrl) {
        let compiled = Handlebars.compile(ctrl.template());
        return <div class="display-flex">
            <div class="panel panel-default">
                <div class="panel-heading">Handlebars template</div>
                <div class="panel-body">
                    <textarea class="form-control" value={ctrl.template()} onkeyup={m.withAttr('value', ctrl.onkeyup)}></textarea>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading">Output form</div>
                <div class="panel-body" onchange={ctrl.onchange} onclick={ctrl.ontrigger}>
                    {ctrl.state.complete
                        ? <div>Thanks {ctrl.model.get('name')}!</div>
                        : m.trust(compiled({model: ctrl.model.attributes}))
                    }
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading">Output model</div>
                <div class="panel-body">
                    <pre>
                        {JSON.stringify(ctrl.model.toJSON(), null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    }
}

var defaultTemplate = `<div class="form-group">
    <label class="control-label">Hey, what's your name?</label>
    {{control-text 'name'}}
</div>
{{#if model.name}}
<div class="form-group">
    <label class="control-label">What about your favorite framework?</label>
    {{#control-select 'framework'}}
    angular:Angular
    react:React
    backbone:Backbone
    ember
    {{/control-select}}
</div>
{{/if}}
{{#if model.framework}}
<div class="form-group">
    <label class="control-label">And your favorite pets?</label>
    {{#control-checkbox 'pets'}}
    dog:Dog
    cat:Cat
    parrot:Parrot
    {{/control-checkbox}}
</div>
{{/if}}
<div>
    <button class="btn btn-default" data-trigger="submit">Submit</button>
</div>
<p>Current time is: {{time}}</p>
`;
