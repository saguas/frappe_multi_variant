
/*function loaddoc_Decorator(f) {
    return function() {
            var args = Array.prototype.slice.call(arguments, 0);
            //console.log("decorator for ", args);
            f.apply(this,args);
            //frappe.emit("newdoc " + cur_frm.doctype, {dn: args[0], dt: cur_frm.doctype});
            args[2] && args[2](args[0], args[1]);
    }
};*/

function refresh_Decorator(f) {
    return function() {
            var args = Array.prototype.slice.call(arguments, 0);
            
            f.apply(this,args);//this == a cur_frm
            
            frappe.emit("newdoc " + cur_frm.doctype, {dn: args[0], dt: cur_frm.doctype});
    }
};

_f.Frm.prototype.refresh = refresh_Decorator(_f.Frm.prototype.refresh);
//load_doc = loaddoc = loaddoc_Decorator(loaddoc);


function _EV() {
//var _EV = {
  var self = this;
  var handlers = {};

  self.emit = function emit(event) {
    var args = Array.prototype.slice.call(arguments, 1);

    if(handlers[event]) {
      for(var lc=0; lc<handlers[event].length; lc++) {
        var handler = handlers[event][lc];
        handler.apply(cur_frm, args);
      }
    }
  };

  self.on = function on(event, callback) {
    if(!handlers[event]) {
      handlers[event] = [];
    }
    handlers[event].push(callback);
  };

  self.once = function once(event, callback) {
    self.on(event, function onetimeCallback() {
      callback.apply(cur_frm, arguments);
      self.removeListener(event, onetimeCallback);
    });
  };

  self.removeListener = function removeListener(event, callback) {
    if(handlers[event]) {
      var index = handlers[event].indexOf(callback);
      handlers[event].splice(index, 1);
    }
  };

  self.removeAllListeners = function removeAllListeners(event) {
    handlers[event] = undefined;
  };
};

_EV.call(frappe);

//$.extend(frappe, _EV);
