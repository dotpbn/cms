function InlineCMS(a){this.options=a;this.pageFrame;this.widgetHandlers={};this.page={};this.menus={};this.registerWidgetHandler=function(c,b){b.getTitle=function(){return cms.lang("widgetTitle_"+this.getName())};this.widgetHandlers[c]=b};this.initWidgetHandlers=function(){for(var c in this.widgetHandlers){var b=this.widgetHandlers[c];b.init()}};this.initWidgets=function(){for(var f in this.page.widgets){var e=this.page.widgets[f];for(var b in e){var d=e[b];d.domId="inlinecms-widget-"+f+d.id;if($("#"+d.domId,this.pageFrame).length==0){continue}var c=this.widgetHandlers[d.handler];c.initWidget(d,f,function(g){cms.buildWidgetToolbar($("#"+g.domId,cms.pageFrame),cms.widgetHandlers[g.handler])})}}};this.initRegions=function(){$(".inlinecms-region",this.pageFrame).each(function(){var b=$(this);var c=$("<div></div>").addClass("drop-helper").addClass("inlinecms");c.html('<i class="fa fa-plus-circle"></i>');b.append(c);if(b.hasClass("inlinecms-region-fixed")){return}b.droppable({accept:".inlinecms-widget-element",over:function(){$(".drop-helper",this).show()},out:function(){$(".drop-helper",this).hide()},drop:function(d,e){$(".drop-helper",this).hide();cms.addWidget(b,e.draggable.data("id"))}});b.sortable({handle:".b-move",update:function(d,e){cms.reorderWidgets(b.data("region-id"))}})})};this.initCollections=function(){$("*[data-collection]",this.pageFrame).addClass("inlinecms-collection").each(function(){var c=$(this);var b=$(this).data("collection");$(this).children().each(function(e){var d=$(this);d.addClass("inlinecms-widget");d.data("item-id",e);d.html('<div class="inlinecms-content">'+d.html()+"</div>");cms.widgetHandlers.text.appendEditor(b+"-"+e,$(".inlinecms-content",d));cms.buildCollectionToolbar(d)});c.sortable({handle:".b-move"})})};this.getMaxWidgetId=function(e){var c=0;for(var b in this.page.widgets[e]){var d=this.page.widgets[e][b];if(d.id>c){c=d.id}}return c};this.addWidget=function(f,e){var h=f.data("region-id");var c=this.getMaxWidgetId(h)+1;var d={id:c,handler:e,content:"",domId:"inlinecms-widget-"+h+c,options:[]};var g=$("<div></div>").attr("id",d.domId).addClass("inlinecms-widget").addClass("inlinecms-widget-"+e).data("id",c);g.append('<div class="inlinecms-content"></div>');$(".drop-helper",f).before(g);var b=this.widgetHandlers[d.handler];b.createWidget(h,d,function(i){cms.buildWidgetToolbar(g,b);cms.page.widgets[h].push(i)});this.setChanges()};this.save=function(b){this.savePage(function(){cms.saveMenusOrdering(function(){cms.noChanges();if(typeof(b)==="function"){b()}})})};this.savePage=function(i){for(var h in this.page.widgets){var g=this.page.widgets[h];for(var b in g){var f=g[b];f.domId="inlinecms-widget-"+h+f.id;var e=$("#"+f.domId+" .inlinecms-content",this.pageFrame).html();var c=this.widgetHandlers[f.handler];if(typeof(c.getContent)==="function"){e=c.getContent(f,e)}delete f.domId;this.page.widgets[h][b].content=e}}var d={};$(".inlinecms-collection",this.pageFrame).each(function(){var k=$(this);var j=k.data("collection");d[j]=[];k.children().each(function(){var n=$(this).data("item-id");var m=$(this).clone().removeClass("inlinecms-widget");var l=cms.widgetHandlers.text.getEditorContent(j+"-"+n);m.html(l);d[j].push(m[0].outerHTML)})});this.runModule("pages","savePage",{page_uri:this.page.uri,lang:this.page.lang,widgets:JSON.stringify(this.page.widgets),collections:JSON.stringify(d),count:this.page.widgetsCount},function(j){if(!j.success){cms.showMessageDialog(j.error,cms.lang("error"));return}if(typeof(i)==="function"){i(j)}})};this.saveMenusOrdering=function(g){var b={};for(var f in this.menus){var d=this.menus[f];var e=[];for(var c in d){e.push(d[c].id);d[c].id=c}b[f]=e.join(",")}this.runModule("menus","saveMenusOrdering",{lang:this.page.lang,ordering:b},function(h){if(typeof(g)==="function"){g()}})};this.deleteWidget=function(e,c){var d="inlinecms-widget-"+e+c;var b=this.page.widgets[e];this.showConfirmationDialog(this.lang("widgetDeleteConfirm"),function(){for(var f in b){if(b[f].id==c){b.splice(f,1);$("#"+d,cms.pageFrame).fadeOut(500,function(){$(this).remove()});break}}cms.setChanges()})};this.reorderWidgets=function(i){var b=[];var g=[];var f=this.page.widgets[i];$('.inlinecms-region[data-region-id="'+i+'"] .inlinecms-widget',this.pageFrame).each(function(){b.push($(this).data("id"))});for(var c in b){var d=b[c];var e;for(var h in f){e=f[h];if(e.id===d){break}}g.push(e)}this.page.widgets[i]=g;this.setChanges()};this.reorderMenu=function(d,c,b){this.moveItemInArray(this.menus[d],c,b);this.setChanges()};this.getWidget=function(d,c){for(var b in this.page.widgets[d]){if(this.page.widgets[d][b].id==c){return this.page.widgets[d][b]}}return false};this.getWidgetOptions=function(d,b){var c=this.getWidget(d,b);return c.options};this.setWidgetOptions=function(e,d,c){for(var b in this.page.widgets[e]){if(this.page.widgets[e][b].id==d){this.page.widgets[e][b].options=c}}this.setChanges()};this.restorePanelState=function(){var b={};if(!localStorage.getItem("inlinecms-panel")){b={position:{left:50,top:150},tab:"#tab-elements",expanded:true}}else{b=JSON.parse(localStorage.getItem("inlinecms-panel"))}this.panel.css(b.position);var c=$("#tabs a[href="+b.tab+"]",this.panel);$("#tabs .active",this.panel).removeClass("active");$("#tabs "+c.attr("href"),this.panel).show();c.parent("li").addClass("active");if(!b.expanded){$(".body",this.panel).hide();$(".title .tb-collapse i",this.panel).toggleClass("fa-caret-up").toggleClass("fa-caret-down")}};this.savePanelState=function(){var b=$("#tabs .active",this.panel).length>0?$("#tabs .active a",this.panel).attr("href"):$("#tabs a",this.panel).eq(0).attr("href");localStorage.setItem("inlinecms-panel",JSON.stringify({position:this.panel.position(),tab:b,expanded:$(".body:visible",this.panel).length}))};this.getPageUrl=function(e,c){if(typeof(c)==="undefined"){c=this.page.lang}var d=[];d.push(this.options.rootUrl);if(c!=this.getDefaultPageLanguage()){d.push(c)}if(e!="index"&&e!="/"){d.push(e)}var b=d.join("/");if(b==""){b="/"}return b};this.reloadPage=function(){this.goToPage(this.page.uri)};this.goToPage=function(d,c){if(typeof(c)==="undefined"){c=this.page.lang}var b=this.getPageUrl(d,c);if(this.hasChanges()){this.showConfirmationDialog(this.lang("pageSaveConfirm"),function(){cms.save(function(){window.location.href=b})},function(){cms.noChanges();window.location.href=b})}else{window.location.href=b}};this.buildUI=function(){this.buildPanel();$(".title .lang select",this.panel).on("change",function(){var c=$(this).val();var b=$("option:selected",this).data("new")==="yes";if(b){cms.addPage({lang:c,uri:cms.page.uri,mode:"copy"});$(this).val(cms.page.lang);return}cms.goToPage(cms.options.pageUri,c)});$("#tabs > ul > li > a",this.panel).on("click",function(){var b=$(this);$("#inlinecms-panel #tabs ul li").removeClass("active");b.parent("li").addClass("active");$("#inlinecms-panel #tabs .tab").hide();$("#inlinecms-panel #tabs "+b.attr("href")).show();cms.savePanelState();return false});$(".s-layouts",this.panel).on("click",function(){cms.editLayouts()});$(".s-code",this.panel).on("click",function(){cms.editGlobalCode()});$(".s-user",this.panel).on("click",function(){cms.editUser()});$(".s-mail",this.panel).on("click",function(){cms.editMail()});$(".btn-save",this.panel).on("click",function(){var b=$(this);b.addClass("saving");$("i",b).removeClass("fa-check").addClass("fa-spinner").addClass("fa-spin");b.prop("disabled",true);$(".btn-save-and-exit",this.panel).prop("disabled",true);cms.save(function(){b.removeClass("saving");$("i",b).addClass("fa-check").removeClass("fa-spinner").removeClass("fa-spin");b.prop("disabled",false);$(".btn-save-and-exit",this.panel).prop("disabled",false)})});$(".btn-save-and-exit",this.panel).on("click",function(){var b=$(this);b.addClass("saving");$("i",b).removeClass("fa-sign-out").addClass("fa-spinner").addClass("fa-spin");b.prop("disabled",true);$(".btn-save",this.panel).prop("disabled",true);cms.save(function(){window.location.href="?exit"})});$(".btn-exit",this.panel).on("click",function(){window.location.href="?exit"});this.buildWidgetsList();this.buildPagesList();this.buildMenusList();this.restorePanelState();this.panel.show();window.onbeforeunload=function(){if(!cms.hasChanges()){return}return cms.lang("pageOutConfirm")}};this.buildWidgetsList=function(){var f=$("#tab-elements .list ul",this.panel);for(var b in this.options.widgetsList){var e=this.options.widgetsList[b];var g=this.widgetHandlers[e].getTitle();var c=this.widgetHandlers[e].getIcon();var d=$("<li></li>").attr("data-id",e).addClass("inlinecms-widget-element");d.html('<i class="fa '+c+'"></i>');d.attr("title",g);d.tooltip({track:true,show:false,hide:false});f.append(d)}$("li",f).draggable({helper:"clone",iframeFix:true})};this.reloadPagesList=function(b){this.runModule("pages","getPagesTree",{lang:this.page.lang},function(c){$("#inlinecms-pages-tree").jstree(true).settings.core.data=c;$("#inlinecms-pages-tree").jstree(true).refresh(true);if(typeof(b)==="function"){b()}})};this.buildPagesList=function(){this.runModule("pages","getPagesTree",{lang:this.page.lang},function(b){$("#inlinecms-pages-tree").on("dblclick",".jstree-anchor",function(d){var c=$("#inlinecms-pages-tree").jstree(true).get_node($(this));if(c.data.type=="page"){cms.goToPage(c.data.url)}}).on("select_node.jstree",function(g,d){var f=d.node.data.type==="page";var c=d.node.data.url==="index";$("#tab-pages .buttons .page-only",cms.panel).prop("disabled",!f);$("#tab-pages .buttons .btn-delete",cms.panel).prop("disabled",c)}).on("state_ready.jstree",function(f,d){var c="n-"+cms.page.uri.replace(new RegExp("/","g"),"-");$("#inlinecms-pages-tree").jstree(true).deselect_all();$("#inlinecms-pages-tree").jstree(true).select_node(c);$("#inlinecms-pages-tree").jstree(true).open_node(c)}).jstree({plugins:["wholerow","state"],core:{data:b,multiple:false,expand_selected_onload:true,check_callback:true}})});$("#tab-pages .btn-create",this.panel).on("click",function(){cms.addPage()});$("#tab-pages .btn-open",this.panel).on("click",function(){cms.goToPage(cms.getSelectedPageUri())});$("#tab-pages .btn-settings",this.panel).on("click",function(){cms.editPage()});$("#tab-pages .btn-delete",this.panel).on("click",function(){cms.deletePage()})};this.buildMenusList=function(){$("#tab-menus .buttons .item-only",cms.panel).prop("disabled",true);this.runModule("menus","getMenusTree",{lang:this.page.lang},function(b){for(var d in b.menus){for(var c in b.menus[d]){b.menus[d][c].id=c}}cms.menus=b.menus;$("#inlinecms-menus-tree").on("select_node.jstree",function(g,f){var h=f.node.parent==="#";$("#tab-menus .buttons .item-only",cms.panel).prop("disabled",h)}).jstree({plugins:["wholerow","state"],core:{data:b.tree,multiple:false,expand_selected_onload:true,check_callback:true}})});$("#tab-menus .btn-create",this.panel).on("click",function(){cms.addMenuItem()});$("#tab-menus .btn-settings",this.panel).on("click",function(){cms.editMenuItem()});$("#tab-menus .btn-delete",this.panel).on("click",function(){cms.deleteMenuItem()});$("#tab-menus .btn-move-up",this.panel).on("click",function(){var d=$.jstree.reference("#inlinecms-menus-tree"),e=d.get_selected(true)[0],c=d.get_node(d.get_parent(e)),b=$("#"+e.id).index();if(b<=0){return}var f=c.data.menu;d.move_node(e,c.id,b-1,function(){var g=$('*[data-menu="'+f+'"]',cms.pageFrame);if(!g){return}g.children().eq(b).insertBefore(g.children().eq(b-1));cms.reorderMenu(f,b,b-1)})});$("#tab-menus .btn-move-down",this.panel).on("click",function(){var d=$.jstree.reference("#inlinecms-menus-tree"),e=d.get_selected(true)[0],c=d.get_node(d.get_parent(e)),b=$("#"+e.id).index(),f=c.children.length;if(b===f){return}var g=c.data.menu;d.move_node(e,c,b+2,function(){var h=$('*[data-menu="'+g+'"]',cms.pageFrame);if(!h){return}h.children().eq(b).insertAfter(h.children().eq(b+1));cms.reorderMenu(g,b,b+1)})})};this.buildWidgetToolbar=function(b,c){if(typeof(c.toolbarButtons)==="undefined"){var g={options:{icon:"fa-wrench",title:this.lang("widgetOptions")},move:{icon:"fa-arrows",title:this.lang("widgetMove")},"delete":{icon:"fa-trash",title:this.lang("widgetDelete"),click:function(i,h){cms.deleteWidget(i,h)}}};var f={};if(typeof(c.getToolbarButtons)==="function"){f=c.getToolbarButtons()}c.toolbarButtons=$.extend(true,{},g,f)}var e=$("<div />").addClass("inline-toolbar").addClass("inlinecms");var d=b.parents(".inlinecms-region-fixed").length>0;$.map(c.toolbarButtons,function(h,j){if(h===false){return h}if(j=="move"&&d){return h}if(j=="delete"&&d){return h}var i=$("<div></div>").addClass("button").addClass("b-"+j);i.attr("title",h.title);i.html('<i class="fa '+h.icon+'"></i>');e.append(i);if(typeof(h.click)==="function"){i.click(function(){var l=$(this).parents(".inlinecms-region").eq(0).data("region-id");var k=$(this).parents(".inlinecms-widget").eq(0).data("id");h.click(l,k)})}return h});b.append(e)};this.buildCollectionToolbar=function(d){var c={move:{icon:"fa-arrows",title:this.lang("widgetMove")},clone:{icon:"fa-copy",title:this.lang("widgetClone"),click:function(e){var f=e.parents(".inlinecms-widget");var i=f.clone();var h=f.siblings().length+1;var g=e.parents(".inlinecms-collection").data("collection");i.data("item-id",h);cms.widgetHandlers.text.appendEditor(g+"-"+h,$(".inlinecms-content",i));$(".inline-toolbar",i).remove();cms.buildCollectionToolbar(i);i.insertAfter(f)}},"delete":{icon:"fa-trash",title:this.lang("widgetDelete"),click:function(e){cms.showConfirmationDialog(cms.lang("widgetDeleteConfirm"),function(){e.parents(".inlinecms-widget").fadeOut(500,function(){$(this).remove()})})}}};var b=$("<div />").addClass("inline-toolbar").addClass("inlinecms");$.map(c,function(e,g){var f=$("<div></div>").addClass("button").addClass("b-"+g);f.attr("title",e.title);f.html('<i class="fa '+e.icon+'"></i>');b.append(f);if(typeof(e.click)==="function"){f.click(function(){e.click($(this))})}return e});d.append(b)};this.getSelectedPageUri=function(){var b=$("#inlinecms-pages-tree").jstree(true).get_selected(true)[0];if(!b){return false}return b.data.url};this.getMenuSelection=function(){var d={};var c=$("#inlinecms-menus-tree").jstree(true);var f=c.get_selected(true)[0];if(!f){return false}var b=c.get_node(c.get_parent(f));var h=b.data.menu;for(var g in this.menus[h]){var e=this.menus[h][g];if(e.id==f.data.id){d.menuId=h;d.item=e;d.node=f;d.position=$("#"+f.id).index();return d}}return false};this.showSelectPageDialog=function(c){var b={};b[cms.lang("ok")]=function(){var d=$("#inlinecms-menu-item-pages-tree").jstree(true).get_selected(true)[0];if(d){if(typeof(c)==="function"){c(d)}}$(this).dialog("close")};$("#inlinecms-menu-item-pages").dialog({title:cms.lang("pageSelect"),modal:true,resizable:false,buttons:b})};this.onMenuItemFormCreate=function(b){$("#inlinecms-menu-item-pages",b).hide();$(".f-menu-id select",b).on("change",function(){$(".f-node-id input",b).val($("option:selected",$(this)).data("node-id"))});$(".f-type select",b).on("change",function(){var c=$(this).val();$(".f-page",b).hide();$(".f-url",b).hide();$(".f-"+c,b).show()});$(".f-page a",b).on("click",function(c){c.preventDefault();cms.showSelectPageDialog(function(d){var e=d.data.url=="index"?cms.lang("homePage"):d.data.url;$(".f-page a",b).html(e);$(".f-page input",b).val(d.data.url)})});$("#inlinecms-menu-item-pages-tree",b).on("state_ready.jstree",function(d,c){$("#inlinecms-menu-item-pages-tree").jstree(true).open_all()}).jstree({plugins:["wholerow","state"],core:{data:$("#inlinecms-pages-tree").jstree(true).get_json(),multiple:false,expand_selected_onload:true}})};this.onMenuItemFormShow=function(b){$(".f-menu-id select",b).change();$(".f-type select",b).change()};this.addMenuItem=function(c){var d={page:this.page.uri};var b=$.extend({},d,c);this.openForm({id:"menu-item-add",title:cms.lang("menuItemCreate"),values:b,source:{module:"menus",action:"loadMenuItemForm",data:{mode:"add",lang:this.page.lang}},buttons:{ok:cms.lang("create")},onCreate:function(e){cms.onMenuItemFormCreate(e)},onShow:function(e){cms.onMenuItemFormShow(e);var f=b.page=="index"?cms.lang("homePage"):b.page;$(".f-page a").html(f);$(".f-page input").val(b.page)},onValidate:function(e,f){e.lang=cms.page.lang;e.is_new=true;cms.runModule("menus","validateMenuItem",e,function(g){f(g)})},onSubmit:function(e){e.lang=cms.page.lang;e.current_uri=cms.page.uri;cms.runModule("menus","createMenuItem",e,function(g){$('*[data-menu="'+e.menu+'"]',cms.pageFrame).append(g.item_html);var f=$("#inlinecms-menus-tree").jstree(true);var h=f.get_node("#n-"+e.menu_node_id);f.create_node(h,g.node);cms.menus[e.menu].push(g.item)})}})};this.editMenuItem=function(){var c=this.getMenuSelection();if(!c){return}var b={menu:c.menuId,id:c.item.id,title:c.item.title,type:c.item.type,page:c.item.type=="page"?c.item.url:this.page.uri,url:c.item.type=="url"?c.item.url:"",target:c.item.target};cms.openForm({id:"menu-item-edit",title:cms.lang("menuItemSettings"),values:b,source:{module:"menus",action:"loadMenuItemForm",data:{mode:"edit",lang:this.page.lang}},buttons:{ok:cms.lang("save")},onCreate:function(d){cms.onMenuItemFormCreate(d)},onShow:function(d){cms.onMenuItemFormShow(d);var e=b.page=="index"?cms.lang("homePage"):b.page;$(".f-page a",d).html(e);$(".f-page input",d).val(b.page)},onValidate:function(d,e){d.lang=cms.page.lang;d.is_new=true;cms.runModule("menus","validateMenuItem",d,function(f){e(f)})},onSubmit:function(d){d.lang=cms.page.lang;d.current_uri=cms.page.uri;cms.runModule("menus","editMenuItem",d,function(f){$('*[data-menu="'+d.menu+'"]',cms.pageFrame).children().eq(c.position).after(f.item_html).remove();var e=$("#inlinecms-menus-tree").jstree(true);var g=e.get_selected(true)[0];e.rename_node(c.node,d.title);c.node.data=f.node.data;c.item.title=d.title;c.item.type=d.type;c.item.url=d.type=="page"?d.page:d.url;c.item.target=d.target})}})};this.deleteMenuItem=function(){var b=this.getMenuSelection();if(!b){return}var c=this.lang("menuItemDeleteConfirm",{item:b.item.title});this.showConfirmationDialog(c,function(){cms.showLoadingIndicator();cms.runModule("menus","deleteMenuItem",{lang:cms.page.lang,menu:b.menuId,id:b.item.id},function(e){cms.hideLoadingIndicator();$('*[data-menu="'+b.menuId+'"]',cms.pageFrame).children().eq(b.position).remove();var d=$("#inlinecms-menus-tree").jstree(true);d.delete_node(b.node)})})};this.onPageFormCreate=function(b){$(".f-uri input",b).on("keyup",function(){var c=$(this).val();while(c.charAt(0)==="/"){c=c.substr(1)}$(".f-uri .uri",b).html(c)});$(".f-lang select",b).on("change",function(){var c=$(this).val();if(c==cms.getDefaultPageLanguage()){c=""}else{c+="/"}$(".f-uri .lang",b).html(c)})};this.onPageFormShow=function(b){$(".f-uri input",b).keyup();$(".f-lang select",b).change()};this.addPage=function(c){var d={lang:this.page.lang,layout:this.page.layout,mode:"default"};var b=$.extend({},d,c);this.openForm({id:"page-add",title:cms.lang("pageCreate"),values:b,source:{module:"pages",action:"loadPageForm",data:{mode:"add"}},buttons:{ok:cms.lang("create")},onCreate:function(e){cms.onPageFormCreate(e)},onShow:function(e){cms.onPageFormShow(e)},onValidate:function(e,f){e.is_new=true;cms.runModule("pages","validatePage",e,function(g){f(g)})},onSubmit:function(e){e.source_uri=cms.page.uri;e.source_lang=cms.page.lang;cms.runModule("pages","createPage",e,function(f){cms.goToPage(e.uri,e.lang)})}})};this.editPage=function(){var b=this.getSelectedPageUri();if(!b){return}this.showLoadingIndicator();this.runModule("pages","loadPageJson",{page_uri:b,lang:this.options.pageLang},function(e){cms.hideLoadingIndicator();var d={title:e.title,uri:e.uri==="index"?"/":e.uri,lang:e.lang,layout:e.layout,keywords:e.meta.keywords,description:e.meta.description};var c=d.uri;cms.openForm({id:"page-edit",title:cms.lang("pageSettings"),values:d,source:{module:"pages",action:"loadPageForm",data:{mode:"edit"}},buttons:{ok:cms.lang("save")},onCreate:function(f){cms.onPageFormCreate(f)},onShow:function(f){cms.onPageFormShow(f);$(".f-uri .lang",f).html("");if(d.lang!=cms.getDefaultPageLanguage()){$(".f-uri .lang",f).html(d.lang+"/")}$(".f-uri input",f).prop("disabled",e.uri==="index")},onValidate:function(f,g){f.current_uri=c;cms.runModule("pages","validatePage",f,function(h){g(h)})},onSubmit:function(g){g.current_uri=c;var h=c!=g.uri;var f=cms.page.uri=="index"?c=="/":c==cms.page.uri;if(h){$("#inlinecms-pages-tree").animate({opacity:0.35},300)}cms.showLoadingIndicator();cms.runModule("pages","editPage",g,function(i){if(f){cms.goToPage(g.uri);return}if(h){cms.reloadPagesList(function(){var j="n-"+g.uri.replace(new RegExp("/","g"),"-");$("#inlinecms-pages-tree").jstree(true).deselect_all();$("#inlinecms-pages-tree").animate({opacity:1},300,function(){$("#inlinecms-pages-tree").jstree(true).select_node(j)});cms.hideLoadingIndicator()});return}cms.hideLoadingIndicator()})}})})};this.deletePage=function(){var g=$("#inlinecms-pages-tree").jstree(true).get_selected(true)[0];var f=g.data.url;if(f==="index"){return}var d=this.getPageUrl(f);var b=f===this.page.uri;var h=g.data.type==="page";var c=g.children.length>0;var e;if(h&&!c){e=this.lang("pageDeleteConfirm",{page:d})}if(h&&c){e=this.lang("pageDeleteChildsConfirm",{page:d})}if(!h){e=this.lang("pageDeleteFolderConfirm",{folder:d})}if(!e){return}this.showConfirmationDialog(e,function(){$("#inlinecms-pages-tree").animate({opacity:0.35},300);cms.showLoadingIndicator();cms.runModule("pages","deletePage",{uri:f,lang:cms.page.lang,is_page:h?1:0},function(i){if(b){cms.goToPage("index");return}cms.reloadPagesList(function(){$("#inlinecms-pages-tree").jstree(true).deselect_all();$("#inlinecms-pages-tree").animate({opacity:1},300);cms.hideLoadingIndicator()})})})};this.editLayouts=function(){cms.openForm({id:"layouts-edit",title:cms.lang("settingsLayouts"),values:false,cache:false,source:{module:"settings",action:"loadLayoutsForm"},buttons:{ok:cms.lang("save")},onCreate:function(b){$(".f-layout-name",b).hide();$(".f-layout-open",b).hide();$(".f-layout-file select",b).change(function(){var d=$(this).val();var c=d.replace(/([_\-]+)|(\.html)|(\.htm)/g," ").replace(/(\s+)/g," ");c=c.charAt(0).toUpperCase()+c.slice(1);$(".f-layout-name",b).toggle(d!="");$(".f-layout-name input",b).val(c);$(".f-layout-open",b).toggle(d!="")})},onValidate:function(b,c){console.log(b);cms.runModule("settings","validateLayouts",b,function(d){c(d)})},onSubmit:function(b){cms.runModule("settings","saveLayouts",b,function(c){if(c.url){window.location.href=c.url;return}cms.clearFormCache("page-add")})}})};this.editGlobalCode=function(){this.showLoadingIndicator();this.runModule("settings","loadGlobalCode",{},function(b){cms.hideLoadingIndicator();var c=b.code.html;cms.showSourceDialog({html:c},function(d){cms.showLoadingIndicator();cms.runModule("settings","saveGlobalCode",{html:d},function(){cms.hideLoadingIndicator()})},{title:cms.lang("settingsGlobalCode"),hint:cms.lang("globalCodeHint")})})};this.editUser=function(){cms.openForm({id:"user-edit",title:cms.lang("settingsUser"),values:false,cache:false,source:{module:"settings",action:"loadUserForm"},buttons:{ok:cms.lang("save")},onCreate:function(b){},onShow:function(b){},onValidate:function(b,c){console.log(b);cms.runModule("settings","validateUser",b,function(d){c(d)})},onSubmit:function(b){cms.runModule("settings","saveUser",b)}})};this.editMail=function(){this.openForm({id:"mail-edit",title:this.lang("settingsMail"),values:false,cache:false,source:{module:"settings",action:"loadMailForm"},buttons:{ok:cms.lang("save")},onSubmit:function(b){cms.runModule("settings","saveMail",b)}})};this.showImageDialog=function(b,c){this.openForm({id:"image",title:this.lang("imageSettings"),values:b,source:{module:"editor",action:"loadImageForm"},buttons:{ok:this.lang("apply")},onCreate:function(d){var e=$(".f-image",d);var f=$(".f-url input",d);$(".t-resize",d).change(function(){$(".fields-small",d).toggle($(this).prop("checked"))});$("input",e).fileupload({dataType:"json",url:cms.getModuleUrl("uploader","uploadImage"),submit:function(){$("input",e).hide();$("<div/>").addClass("inlinecms-uploading").html('<i class="fa fa-spinner fa-spin"></i> '+cms.lang("uploading")).insertAfter($("input",e))},always:function(h,g){$("input",e).show();$(".inlinecms-uploading").remove();if(!g.result.success){if(g.result.error){cms.showMessageDialog(g.result.error,cms.lang("error"))}return}f.val(g.result.url)}})},onShow:function(d){$(".t-resize",d).change()},onSubmit:function(d,f){if(typeof(c)!=="function"){return}var g=$("<img/>").attr("src",d.url);if(d.style){g.addClass(d.style)}if(d.align=="center"){g.css({margin:"0 auto"})}else{if(d.align){g.attr("align",d.align)}}if(d.title){g.attr("alt",d.title)}if(d.link_url){var e=$("<a/>").attr("href",d.link_url).append(g);if(d.title){e.attr("title",d.title)}c(e.get(0),d,f);return}c(g.get(0),d,f)}})};this.showSourceDialog=function(b,f,c){if(typeof(c)==="undefined"){c={}}var e=(typeof(c.title)==="undefined")?"HTML":c.title;var d=(typeof(c.hint)==="undefined")?false:c.hint;this.openForm({id:"source",title:e,width:650,values:b,source:{module:"editor",action:"loadSourceForm"},buttons:{ok:this.lang("apply")},onCreate:function(g){cms.loadCodeEditor(function(){$(".f-html textarea",g).data("editor",CodeMirror.fromTextArea($(".f-html textarea",g).get(0),{mode:{name:"xml",htmlMode:true},theme:"material",lineWrapping:false}))})},onShow:function(g){if(!d){$(".hint",g).hide()}else{$(".hint",g).html(d).show()}if(!cms.isCodeEditorLoaded){return}$("textarea",g).each(function(){var h=$(this);var i=$(this).data("editor");if(!i){return}var j=h.val();i.setValue(j)})},onAfterShow:function(g){$(".CodeMirror:visible",g).each(function(h,j){j.CodeMirror.refresh()})},onBeforeSubmit:function(g){$(".f-html textarea",g).val($(".f-html textarea",g).data("editor").getValue())},onSubmit:function(g,h){if(typeof(f)!=="function"){return}f(g.html)}})};$(function(){cmsAddCore(cms);cms.showLoadingIndicator();cms.loadLang(["shared","client","widgets"],function(){cms.runModule("pages","loadPageJson",{page_uri:cms.options.pageUri,lang:cms.options.pageLang},function(b){cms.page=b;cms.buildUI();$("#page-frame").attr("src",cms.options.editorUrl).load(function(){cms.pageFrame=$("#page-frame").contents();$("a[target!=_blank]",cms.pageFrame).attr("target","_top");cms.initWidgetHandlers();cms.initWidgets();cms.initRegions();cms.initCollections();cms.hideLoadingIndicator()})})})})}function InlineWidget(){this.isOptionsFormLoaded=false;this.init=function(){if(typeof(this.onInit)==="function"){this.onInit()}};this.initWidget=function(b,d,c){var a=this;this.loadLang(function(){if(typeof(a.onInitWidget)==="function"){a.onInitWidget(b,d)}c(b)});if(typeof(this.onClick)==="function"){this.dom(b).click(function(f){f.stopPropagation();f.preventDefault();a.onClick(b,d)})}};this.createWidget=function(d,b,c){var a=this;this.loadLang(function(){if(typeof(a.onCreateWidget)==="function"){b=a.onCreateWidget(b,d)}c(b)});if(typeof(this.onClick)==="function"){this.dom(b).click(function(f){f.stopPropagation();f.preventDefault();a.onClick(b,d)})}};this.loadLang=function(b){if(typeof(this.lang)==="function"){b();return}this.lang=function(){};var a=this;cms.loadWidgetLang(this.getName(),function(c){a.langPhrases=c;a.lang=function(f,e){if(typeof(this.langPhrases[f])==="undefined"){return f}var d=this.langPhrases[f];if(typeof(e)!=="undefined"){for(var g in e){d=d.replace(new RegExp("{"+g+"}","g"),e[g])}}return d};b()})};this.openOptionsForm=function(e,d){var c=this;var b=cms.getWidgetOptions(e,d);var a={id:this.getName()+"-options",title:cms.lang("widgetOptions")+": "+this.getTitle(),values:b,source:{module:"widgets",action:"loadOptionsForm",data:{handler:this.getName()}},buttons:{ok:cms.lang("apply")},onSubmit:function(f,g){c.saveOptions(e,d,f,g)}};if(typeof(this.getOptionsFormSettings)!=="undefined"){a=$.extend(a,this.getOptionsFormSettings(e,d))}cms.openForm(a)};this.saveOptions=function(e,b,d,a){var c=cms.getWidget(e,b);c.domId="inlinecms-widget-"+e+c.id;d=$.extend({},d,this.applyOptions(c,d,a));cms.setWidgetOptions(e,b,d)};this.applyOptions=function(c,a,b){};this.dom=function(a){return $("#"+a.domId+" .inlinecms-content",cms.pageFrame)};this.runBackend=function(a,b,c){if(typeof(b)==="undefined"){b={}}b._widgetId=this.getName();b._widgetAction=a;cms.runModule("widgets","run",b,function(d){if(typeof(c)==="function"){c(d)}})};this.onClick=function(a,b){this.openOptionsForm(b,a.id)}};