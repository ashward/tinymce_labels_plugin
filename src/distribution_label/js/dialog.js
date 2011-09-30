tinyMCEPopup.requireLangPack();

var ExampleDialog = {
	labelNode : null,
	contentNode : null,
	
	labelStyles : {
		"STAFF" : {
			color : "white",
			bgcolour : "blue",
			border : "2px solid blue",
		},
		
		"MANAGEMENT" : {
			color : "white",
			bgcolour : "darkgray",
			border : "2px solid darkgray",
		},
		
		"DIRECTORS" : {
			color : "white",
			bgcolour : "darkred",
			border : "2px solid darkred",
		},
	},
		
	init : function() {
		var f = document.forms[0];

		var dom = tinyMCEPopup.editor.dom;

		var plugin = tinyMCEPopup.getWindowArg('plugin');
		var isEdit = tinyMCEPopup.getWindowArg('edit');

		var contentNodes = plugin.getBlockLevelParents(tinyMCEPopup.editor, tinyMCEPopup.editor.selection.getNode());
		ExampleDialog.contentNode = contentNodes[0];
		
		ExampleDialog.labelNode = null;

		if(isEdit) {
			parentNodes = dom.getParents(ExampleDialog.contentNode, ".distribution-label");
			
			if(parentNodes.length > 0) {
				for(var i = 0; i < f.level.options.length; ++i) {
					if(dom.hasClass(parentNodes[0], f.level.options[i].value.toLowerCase())) {
						f.level.selectedIndex = i;
						break;
					}
				}
				
				ExampleDialog.labelNode = parentNodes[0];
			}
		}
	},

	insert : function() {
		var f = document.forms[0];
		var ed = tinyMCEPopup.editor;
		var dom = ed.dom;

		var element = ExampleDialog.contentNode;

		var style = ExampleDialog.labelStyles[f.level.value];
		
		var contentNodes, nodeToReplace;
		
		if(ExampleDialog.labelNode) {
			contentNodes = dom.select("> .distribution-label-content > *", ExampleDialog.labelNode);
			nodeToReplace = ExampleDialog.labelNode;
		} else if(element == ed.getContentAreaContainer()) {
			var extraEl = dom.add(element, "div");
			dom.run(element.childNodes, function(o) {
				extraEl.appendChild(o);
			});
			contentNodes = [extraEl.childNodes];
			nodeToReplace = extraEl;
		} else {
			contentNodes = [element];
			nodeToReplace = element;
		}
		
		if(f.level.selectedIndex == 0) {
			if((contentNodes.length == 0) || (nodeToReplace != contentNodes[0])) {
				dom.run(contentNodes, function(o) {
					dom.insertAfter(o, nodeToReplace);
				});
				dom.remove(nodeToReplace);
			}
		} else {
			var labelEl = dom.create("div", {class : 'distribution-label'});
			dom.addClass(labelEl, f.level.value.toLowerCase());

			var markingEl = dom.add(labelEl, 'div', {class : 'distribution-label-marking'}, f.level.value);
			var contentContainerEl = dom.add(labelEl, 'div', {class : 'distribution-label-content'});
			
			dom.setStyle(labelEl, "border", style.border);

			dom.setStyle(markingEl, "text-align", "center");
			dom.setStyle(markingEl, "color", style.color);
			dom.setStyle(markingEl, "background", style.bgcolour);
			dom.setStyle(markingEl, "padding", "2px");
			
			dom.setStyle(contentContainerEl, "padding", "2px");

			dom.replace(labelEl, nodeToReplace);
			
			dom.run(contentNodes, function(o) {
				contentContainerEl.appendChild(o);
			});
		}
		
		tinyMCEPopup.close();
	}
};

tinyMCEPopup.onInit.add(ExampleDialog.init, ExampleDialog);
