frappe.require("assets/js/slickgrid.min.js");
frappe.require("assets/js/slickgrid_editors.min.js");
frappe.provide("frappe.multi_variant");


frappe.multi_variant.Converter = Class.extend({
	
		init: function() {
            //_EV.call(this);
			var obj = {};
			
			obj['>'] = this.bigger;
			obj['<'] = this.smaller;
			obj['>='] = this.bigger_eq;
			obj['<='] = this.smaller_eq;
			obj['='] = this.eq;
			obj['>= and <='] = this.bigger_eq_and_smaller_eq;
			obj['> and <'] = this.bigger_and_smaller;
			obj['>= or <='] = this.bigger_eq_or_smaller_eq;
			obj['> or <'] = this.bigger_or_smaller;
			obj['>= and <'] = this.bigger_eq_and_smaller;
			obj['> and <='] = this.bigger_and_smaller_eq;
			obj['>= or <'] = this.bigger_eq_or_smaller;
			obj['> or <='] = this.bigger_or_smaller_eq;
			obj['!='] = this.not_eq;
			obj[':'] = this.between;
			
			$.extend(this, obj);
		},
		bigger: function(v1, v2){
	
			return v1>v2;
		},
		smaller: function(v1, v2){
	
			return v1<v2;
	
		},
		bigger_eq: function(v1, v2){

			return v1>=v2;

		},
		smaller_eq: function(v1, v2){

			return v1<=v2;

		},
		eq: function(v1, v2){

			return v1==v2;

		},
		between: function(v1,v2,v3,v4){
	
			return v1>=v2 && v3<=v4;
		},
		bigger_eq_and_smaller_eq: function(v1,v2,v3,v4){
	
			return v1>=v2 && v3<=v4;
		},
		bigger_and_smaller: function(v1,v2,v3,v4){
	
			return v1>v2 && v3<v4;
		},
		bigger_eq_or_smaller_eq: function(v1,v2,v3,v4){
	
			return v1>=v2 || v3<=v4;
		},
		bigger_or_smaller: function(v1,v2,v3,v4){
	
			return v1>v2 || v3<v4;
		},
		bigger_eq_and_smaller: function(v1,v2,v3,v4){
	
			return v1>=v2 && v3<v4;
		},
		bigger_and_smaller_eq: function(v1,v2,v3,v4){
	
			return v1>v2 && v3<=v4;
		},
		bigger_eq_or_smaller: function(v1,v2,v3,v4){
	
			return v1>=v2 || v3<v4;
		},
		bigger_or_smaller_eq: function(v1,v2,v3,v4){
	
			return v1>v2 && v3<=v4;
		},
		not_eq: function(v1,v2){
	
			return v1!=v2;
		}	
});


frappe.multi_variant.ProductTemplate = Class.extend({
	
	init: function(opts) {
        //_EV.call(this);
		this.opts = opts || {};
	    //cs.start_converter(doc);
		this.converter = new frappe.multi_variant.Converter();
		
	    this.dimensions_added = {};
		//console.log("start init ", this.dimensions_added);
	    this.opt = [];
	    this.dim = [];
	    this.columnFilters = {};
		
		if(opts) {
			$.extend(this, this.opts);
		};
		
		if(!this.parent){
			throw(__("This grid needs a container!"));
		}
		
	},
	get_query: function(doc, dt, dn){
		
			var self = this;
			//console.log("getquery called ", this.dim);
			//var len = doc.domain_templates.length - 1;
			//cur_frm.fields_dict["domain_templates"].grid.get_data().forEach(function(doc){
			doc.domain_templates.forEach(function(idoc){
				//console.log("dim ", idoc.dimension);
				if(idoc.dimension){
					self.dim.push(["Domain Type","dimension", "!=", idoc.dimension]);
				}
			});
			//console.log("self dim ", self.dim);
			if(!is_null(self.dim)){
			   	return {
			   		filters: self.dim
			   	}
			}
	},
    domain_templates_remove: function(dt,dn){
 	   
	   var self = this;
 	   this.dim.splice(0,this.dim.length);
 	   this.forceVariantsDB();
   
 	   dt.domain_templates.forEach(function(doc){
 	   		self.dim.push(["Domain Type","dimension", "!=", doc.dimension]);
 			console.log("remove ", doc.dimension);
		
 			if(self.dimensions_added[doc.dimension]){
 					self.dimensions_added[doc.dimension].active = 1;
 			}
 	   });
    },
	clearTable: function(){
	
		delete this.grid;
		delete this.dataView;
		delete this.checkboxSelector;
		delete this.columnpicker;
	},
	generate_options: function(){

	   console.log("button pressed ", this.doc);
   	   //debugger;
	   //cs.dimensions_added.splice(0,cs.dimensions_added.length);
	   this.opt.splice(0,this.opt.length);
   
	   this.render_list();

	},
	getActiveVariants: function(item) {
	
		var key;
		var count = 0;
	
		for(key in this.dimensions_added){
			if(this.dimensions_added[key]){
				count += this.dimensions_added[key].active;
			}
		}
	
		console.log("active ", this.dimensions_added);
		return count;
	},
	getDoc: function(doctype, name){
		
			var df = new $.Deferred();
	
		    frappe.call({
			       "method": "frappe.client.get",
			       args: {
			           doctype: doctype,
			           name: name
			       },
			       callback: function(data){
					   console.log("resolved ", data);
					   df.resolve(data);
				   }
		   });
   
		   return df;
		
	},
	filter: function(item) {
		//var cs = cur_frm.cscript;
		//var self = cs.pt;
		//console.log("items ", this);
	    for (var columnId in this.columnFilters) {
	      if (columnId !== undefined && this.columnFilters[columnId] !== "") {
	        var c = this.grid.getColumns()[this.grid.getColumnIndex(columnId)];
			//console.log("c.field ", c);
			//console.log("colunas selecionadas ", cs.grid.getSelectedRows());//alternativa: cs.grid.getSelectionModel().getSelectedRows()
			//var reg = new RegExp("^" + cs.columnFilters[columnId],"i");
	        //if (item[c.field] != cs.columnFilters[columnId]) {
			//if(!reg.test(item[c.field])){
			//if(!reg.test(item[c.field]) && !cs.rex_match(cs.columnFilters[columnId], item[c.field])){
			//console.log("filter ", cs.dataView.getLength());
			if(!this.rex_match(this.columnFilters[columnId], item[c.field])){
	          return false;
	        }
	      }
	    }
	    return true;
	},
	makeOpts: function(){
	
		var self = this;
			console.log("makeOpts ", this.opt);
			this.opt.forEach(function(docobj){
				if(!self.dimensions_added[docobj.dimension]){
					self.dimensions_added[docobj.dimension] = {arr: [], active: 1};	
				};
				docobj.dimension_options.forEach(function(doc){
					console.log("Variantes ", docobj.dimension + " value: " +doc.value );
					 	//cs.dimensions_added.push({id:doc.name,dimension:docobj.dimension,value:doc.value, description:docobj.description});
						self.dimensions_added[docobj.dimension].arr.push({id:doc.name,dimension:docobj.dimension,value:doc.value, description:docobj.description});
				});
		
			});
	
		  //if(is_null(cs.dimensions_added) && is_null(cs.grid)){
		  if(!this.getActiveVariants() && is_null(this.grid)){
			  msgprint(__("You must provide at least one dimension"));
		  	  return;
		  }else if(!this.getActiveVariants()){
			  console.log("**************hidding");
			  $("#prodList2").empty();
			  delete this.grid;
			  hide_field(["product_list"]);
              hide_field("generate_all_products");
		  	  return;
		  }
  
		  if(is_null(this.grid)){
			  	unhide_field(["product_list"]);
				//var wr = cur_frm.fields_dict['product_list'].$wrapper.append('<div id="prodList2" style="width:500px;height:250px;"></div>');
				var wr = '<div id="' + this.parent + '" style="width:500px;height:250px;"></div>';
				cur_frm.fields_dict.product_list.$wrapper.html(wr);
				//cur_frm.set_value('product_list',wr);//não dá
				this.createGrid();
                unhide_field("generate_all_products");
				//console.log("wr ",$(wr).empty());
				//cur_frm.set_value("product_list", wr);
			
		  }
  
		  console.log("cur_frm.cscript.dimensions_added ", this.dimensions_added);
	  
		  this.refreshTable();
	  
	},
	createGrid: function(){
	
		var self = this;

	    var options = {
	     enableCellNavigation: true,
	     enableColumnReorder: false,
		 headerRowHeight: 30,
		 showHeaderRow: true,
		 explicitInitialization: true,
		 multiColumnSort: true,
		 editable: true
	    };
	
		this.checkboxSelector = new Slick.CheckboxSelectColumn({
		      cssClass: "slick-cell-checkboxsel"
		});
		var dataview_columns = [];
		dataview_columns.push(this.checkboxSelector.getColumnDefinition());
		dataview_columns.push({id: "Dimension", name: __("Dimension"), field: "dimension", width: 100, sortable: true });
		dataview_columns.push({id: "Value", name: __("Value"), field: "value", defaultSortAsc: true, sortable: true, editor: Slick.Editors.Text});
		dataview_columns.push({id: "Description", name: __("Description"), field: "description", width: 300, sortable: true });
	    /*var dataview_columns = [
	 		  {id: "Dimension", name: __("Dimension"), field: "dimension", width: 100, sortable: true },
			  {id: "Value", name: __("Value"), field: "value", defaultSortAsc: true, sortable: true, editor: Slick.Editors.Text},
	 		  {id: "Description", name: __("Description"), field: "description", width: 180, sortable: true }
	 	];*/
	    //var grid = frappe.views.GridReport();
	    this.dataView = new Slick.Data.DataView();
	    //dataView.beginUpdate();
	    //dataView.setItems(data);
	    //dataView.endUpdate();
	    this.grid = new Slick.Grid("#" + this.parent, this.dataView, dataview_columns, options);
	
		$(this.grid.getHeaderRow()).delegate(":input", "change keyup", function (e) {
			  
		      var columnId = $(this).data("columnId");
		      if (columnId != null) {
		        self.columnFilters[columnId] = $.trim($(this).val());
				//console.log("key pressed ", self.columnFilters[columnId]);
		        self.dataView.refresh();
		      }
	    });
	    // Make the grid respond to DataView change events.
	    this.dataView.onRowCountChanged.subscribe(function (e, args) {
	      self.grid.updateRowCount();
	      self.grid.render();
	    });

	    this.dataView.onRowsChanged.subscribe(function (e, args) {
	      self.grid.invalidateRows(args.rows);
	      self.grid.render();
	    });
	
		this.grid.onHeaderRowCellRendered.subscribe(function(e, args) {
	        $(args.node).empty();
	        $("<input type='text'>")
	           .data("columnId", args.column.id)
	           .val(self.columnFilters[args.column.id])
	           .appendTo(args.node);
	    });

		this.grid.onSort.subscribe(function (e, args) {
		      var cols = args.sortCols;

		      self.dataView.sort(function (dataRow1, dataRow2) {
		        for (var i = 0, l = cols.length; i < l; i++) {
		          var field = cols[i].sortCol.field;
		          var sign = cols[i].sortAsc ? 1 : -1;
		          var value1 = dataRow1[field], value2 = dataRow2[field];
		          var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
		          if (result != 0) {
		            return result;
		          }
		        }
		        return 0;
		      });
		      self.grid.invalidate();
		      self.grid.render();
		});

		this.grid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
		this.grid.registerPlugin(this.checkboxSelector);
	
		this.columnpicker = new Slick.Controls.ColumnPicker(dataview_columns, this.grid, options);
		this.dataView.syncGridSelection(this.grid,true);
	},
	render_list: function(){
	
			  var self = this;
			  var dfs = [];
			  if(this.doc.domain_templates){
				  this.doc.domain_templates.forEach(function(doc){
				       //dimensions.push(doc.dimension);
					   console.log("render_list ", self.dimensions_added);
					   if(!is_null(doc.dimension) && !self.dimensions_added[doc.dimension]){
					   		//cur_frm.cscript.dimensions_added.push({id:doc.dimension,dimension:doc.dimension,description:"teste"});
				  		    dfs.push(self.getDoc("Domain Type", doc.dimension));
					   }else if(self.dimensions_added[doc.dimension]){
					   		self.dimensions_added[doc.dimension].active = 1;
					   }
				  });
		  	 };
		 
			  if(!is_null(dfs)){
				  $.when.apply($,dfs).done(function(){
					  var args = Array.prototype.slice.call(arguments, 0);
					  //console.log("arguments ", args);
					  args.forEach(function(data){
					   		self.opt.push(data.message);
						
					  });
					  self.makeOpts();
				  });
			  }else{
			  		self.makeOpts();
			  }
		  
	},
	refreshTable: function(){
	
		  //cs.grid.invalidateAllRows();
		  this.dataView.beginUpdate();
		  //cs.dataView.setItems(cs.dimensions_added);
		  //console.log("cs.getVariants() ", cs.getVariants());
		  this.dataView.setItems(this.getVariants());
		  this.dataView.setFilter($.proxy(this.filter, this));
		  this.dataView.endUpdate();
		  //var len = cs.dataView.getLength();
		  //var selmode = cs.grid.getSelectionModel();
		  /*var arr = [];
		  for (var i=0; i<len;i++){
			  arr.push(i);
		  };*/
		  //cs.grid.render();
		  this.grid.init();
	  
		  //cs.grid.setSelectedRows(arr);
		  //console.log("length ", arr);
	},
	forceVariantsDB: function(){
	
		var key;
	
		for(key in this.dimensions_added){
			this.dimensions_added[key].active = 0;
		};
 	   
	},
	getVariants: function(){

		var key;
		var arr = [];
	
		console.log("cs.dimensions_added ", this.dimensions_added["Color"]);
	
		for(key in this.dimensions_added){
			console.log("this active ", this.dimensions_added[key].active);
			if(this.dimensions_added[key].active){
				arr = arr.concat(this.dimensions_added[key].arr);
			}
		};
		console.log("ARR ", arr);
		return arr;
	},
	rex_match: function(str, item){

		var re = /([><!][=]?)[\s]*([\d]+)?(?:[\s]+(and|or)[\s]+([><][=]?)[\s]*([\d]+))?/i;//>=5522 or <=12; $1 = >=; $2 = 5522; $3 = or; $4 = <=; $5 = 12 
		//console.log("str ", str);
		var m = str.match(re);
		var ret = false;
		var colon;
		//console.log("match ", m);
	
		if(m && m[2]){//is a possible a match
			if(m[3] && /\d+/.test(item)){
				ret = this.converter[m[1]+ " "+ m[3]+ " " +m[4]](parseInt(item), parseInt(m[2]), parseInt(item), parseInt(m[5]));
				//console.log("ret ", m[1]+m[3]+m[4]);
			}else if(/\d+/.test(item)){
				//console.log("ret ", m);
				ret = this.converter[m[1]](parseInt(item), parseInt(m[2]));
				//console.log("ret ", item);
			}
		}else if(/^\/[\s\S]+\/([gmi]*)$/.test(str)){//try regular expression
			var idx = str.indexOf("/",1);
			var len = str.length;
			var flags = str.slice(idx+1,len);
			var sl = str.slice(1, idx);
			//var st = sl.replace(/\//g, "");
			var s = sl.replace(/\\/g, "\\");
			try{
				var rex = new RegExp(s, flags);
			//console.log("newreg ", rex);
				ret = rex.test(item);
			}catch(err){
				ret = false;
			}

		}else if(colon = str.match(/([\d]+)(:)([\d]+)/)){
			//console.log(": ", item);
			ret = this.converter[":"](parseInt(item), parseInt(colon[1]), item, parseInt(colon[3]));
		}else /*if(/^[a-zA-Z0-9]/.test(str))*/{
			try{
				var reg = new RegExp("^" + str,"i");
				ret = reg.test(item);
			}catch(err){
				ret = false;
			}
		};
	
		return ret;
	
	}
	
});


cur_frm.cscript.onload = function(doc,cdt,cdn){
	
	var cs = cur_frm.cscript;
	var opts = {doc: doc, parent:"prodList2"};
	console.log("onload product template ", doc);
	cs.pt = new frappe.multi_variant.ProductTemplate(opts);
    frappe.once("newdoc Item", function(args){
        console.log("newdoc event ", this);
        this.set_value("barcode", "12234");
        //frappe.removeListener("newdoc Item");
    });
    
    //cur_frm.set_df_property("product_name", "read_only", true);
    //cur_frm.set_value("product_name", "coca-cola");
    
    //load_doc("Item","coca-cola");
    //new_doc("Item");
};

cur_frm.cscript.refresh = function(doc,cdt,cdn){
	//cs.pt.refresh();
}

cur_frm.cscript.generate_options = function(doc, dt, name){
	var cs = cur_frm.cscript;
	cs.pt.generate_options();
};

cur_frm.cscript.domain_templates_remove = function(dt,dn){
	var cs = cur_frm.cscript;
	console.log("remove ", dt);
	cs.pt.domain_templates_remove(dt,dn);
};

cur_frm.get_field("domain_templates").grid.get_field("dimension").get_query = function(doc, dt, dn){
	var cs = cur_frm.cscript;
	
	console.log("get_query ", doc);
	
	return cs.pt.get_query(doc,dt,dn);
	
};

cur_frm.get_field("product_name").get_query = function(doc, dt, dn){
	var cs = cur_frm.cscript;
	
	console.log("get_query ", doc);
	
	return {
		filters: [
            ['Item', 'item_group', '!=', "Variant"]//exlude variants as products
	    ]
    }
}


