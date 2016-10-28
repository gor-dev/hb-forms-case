var m = require('mithril');

module.exports = App;

function App(options){
    if (!(this instanceof App)) {
        return new App(options);
    }
    
    this.options = options;
}

App.prototype.render = function(target, component){
    // Plain redraw
    if(!target || target === true){
        if(target === true){
            m.redraw.strategy('all');
            m.redraw();
            m.redraw.strategy('diff');
        }else
            m.redraw();
        return this;
    }

    // Mount component
    if(typeof target == 'string')
        target = document.querySelector(target);
    m.mount(target, component.view ? component : {view:function(){ return component; }});

    return this;
}

