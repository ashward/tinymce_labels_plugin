/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function() {
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('distribution_label');

	tinymce.create('tinymce.plugins.DistributionLabelPlugin', {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {
			// Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceDistributionLabel');
			ed.addCommand('mceDistributionLabelNew', function() {
				ed.windowManager.open({
					file : url + '/dialog.htm',
					width : 320 + parseInt(ed.getLang('distribution_label.delta_width', 0)),
					height : 120 + parseInt(ed.getLang('distribution_label.delta_height', 0)),
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					edit : false,
					plugin : this
				});
			}, this);

			ed.addCommand('mceDistributionLabelEdit', function() {
				ed.windowManager.open({
					file : url + '/dialog.htm',
					width : 320 + parseInt(ed.getLang('distribution_label.delta_width', 0)),
					height : 120 + parseInt(ed.getLang('distribution_label.delta_height', 0)),
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					edit : true,
					plugin : this
				});
			}, this);

			// Register distribution_label button
			ed.addButton('distribution_label_new', {
				title : 'distribution_label.desc',
				cmd : 'mceDistributionLabelNew',
				image : url + '/img/new.gif'
			});

			ed.addButton('distribution_label_edit', {
				title : 'distribution_label.desc',
				cmd : 'mceDistributionLabelEdit',
				image : url + '/img/edit.gif'
			});

			// Add a node change handler, selects the button in the UI when a image is selected
			ed.onNodeChange.add(function(ed, cm, n) {
				var parents = this.getParentDistributionLabel(ed, n);
				
				cm.setDisabled('distribution_label_new',
						(parents.nextParent != null)
						&& (parents.immediateParent == parents.nextParent));

				cm.setDisabled('distribution_label_edit',
						parents.nextParent == null);
				
				cm.setActive('distribution_label_edit',
						parents.nextParent != null);
			}, this);
		},

		/**
		 * Creates control instances based in the incomming name. This method is normally not
		 * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
		 * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
		 * method can be used to create those.
		 *
		 * @param {String} n Name of the control to create.
		 * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
		 * @return {tinymce.ui.Control} New control instance or null if no control was created.
		 */
		createControl : function(n, cm) {
			return null;
		},

		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'DistributionLabel plugin',
				author : 'Some author',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/distribution_label',
				version : "1.0"
			};
		},
		
		getParentDistributionLabel : function(ed, n) {
			var dom = ed.dom;
			
			var ret = {
					immediateParent : null,
					nextParent : null,
			};
			
			var parentNodes = this.getBlockLevelParents(ed, n);

			if(parentNodes.length == 0) {
				return ret;
			}
			
			if(dom.hasClass(n, "distribution-label")) {
				ret.immediateParent = n;
			} else if(dom.hasClass(parentNodes[0], "distribution-label")) {
				ret.immediateParent = parentNodes[0];
			} else if((parentNodes.length > 1)
					&& dom.hasClass(parentNodes[1], "distribution-label")) {
				ret.immediateParent = parentNodes[1];
			} else if((parentNodes.length > 2)
					&& dom.hasClass(parentNodes[2], "distribution-label")) {
				ret.immediateParent = parentNodes[2];
			}
			
			for(var i = 0; i < parentNodes.length; ++i) {
				if(dom.hasClass(parentNodes[i], "distribution-label")) {
					ret.nextParent = parentNodes[i];
					break;
				}
			}
			
			return ret;
		},
		
		getBlockLevelParents : function(ed, n) {
			var ret = ed.dom.getParents(n, function(node) {
				return ed.dom.isBlock(node);
			}, ed.getContentAreaContainer());
			
			ret.push(ed.getContentAreaContainer());
			
			return ret;
		}
	});

	// Register plugin
	tinymce.PluginManager.add('distribution_label', tinymce.plugins.DistributionLabelPlugin);
})(); 