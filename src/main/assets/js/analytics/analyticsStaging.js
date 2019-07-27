/*
 * This file has been downloaded from http://www.adobetag.com/d1/v2/ZDEtYWNjc3RhbmRhcmRiYW5rLTI4ODYtNDMwNi0=/amc.js"
 * and edited. The URL of the sitecatalyst file has been changed from http://www.adobetag.com/d1/v2/ZDEtYWNjc3RhbmRhcmRiYW5rLTI4ODYtNDMwNi0=/live/sitecatalyst.js
 * to a local file in the assets/js/analytics directory.
 */

var siteCatalystScriptUrl = "\"\/assets\/js\/analytics\/siteCatalystStaging.js\"";

/**!
 * Adobe TagManager Library version: 2.0.1
 * Copyright 1996-2013 Adobe Systems Incorporated. All rights reserved.
 * More info available at http://www.adobe.com/solutions/digital-marketing.html
 */

var amc=amc||null;amc=function(t,e){"use strict";var n;n={executeJavaScript:function(t){try{window.execScript?window.execScript(t):eval.call(window,t)}catch(e){}},jsonDecode:function(t){var e=eval;return"undefined"!=typeof JSON&&JSON.parse&&(e=JSON.parse),n.jsonDecode=function(t){var n=null;try{e===eval&&(t="("+t+")"),n=e(t)}catch(a){}return n},n.jsonDecode(t)},isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)},isObject:function(t){return null===t?!1:"[object Object]"===Object.prototype.toString.call(t)},mergeObject:function(t,e,a){var i,r,s;if(n.isArray(t)===!0||n.isArray(e)===!0){if(n.isArray(t)===!0&&n.isArray(e)===!0)for(r=0,s=e.length;s>r;r+=1)t.push(n.clone(e[r]));return t}for(i in e)if(e.hasOwnProperty(i)===!0){if(a!==!1&&t.hasOwnProperty(i)!==!0)continue;try{n.isObject(e[i])===!0?(t[i]||(t[i]={}),n.mergeObject(t[i],e[i],a)):n.isArray(e[i])===!0?(t[i]||(t[i]=[]),n.mergeObject(t[i],e[i],a)):t[i]=e[i]}catch(o){t[i]=e[i]}}return t},clone:function(t){var e,a,i,r;if(null===t||"object"!=typeof t)return t;if(t instanceof Array){for(e=[],a=0,i=t.length;i>a;a++)e[a]=n.clone(t[a]);return e}if(t instanceof Object){e={};for(r in t)t.hasOwnProperty(r)&&(e[r]=n.clone(t[r]));return e}throw Error("Unable to copy obj! Its type isn't supported.")},getSanitizedObject:function(t,e){var a,i,r,s;if(e===void 0)return{};for(a in t)if(t.hasOwnProperty(a)===!0)if(i=null,e[a]&&(i=e[a]),n.isObject(t[a])===!0)t[a]=n.getSanitizedObject(t[a],i);else if(n.isArray(t[a])===!0)for(r=0,s=t[a].length;s>r;r+=1)t[a][r]=n.isObject(t[a][r])===!0?n.getSanitizedObject(t[a][r],i):n.getSanitizedValue(t[a][r],i);else t[a]=n.getSanitizedValue(t[a],i);return t},getSanitizedValue:function(t,e){var n,a,i;if(!e)return t;switch(e){case"number":t=Number(t);break;case"string":null===t?t="":t+="";break;case"boolean":t=Boolean(t);break;case"date":a=/^\d{4}\/(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])$/,isNaN(t)===!0&&null!==t.match(a)?(i=t.split("/",3),n=Date.UTC(i[0],i[1]-1,i[2]),t=isNaN(n)===!1?n:-1):t=-1}return t},call:function(t,e){return e||(e=this),function(){return t.apply(e,Array.prototype.slice.call(arguments))}},proxyMethodCall:function(t,e){return function(){return this[e]&&this[e][t]?this[e][t].apply(this[e],arguments):!1}},trim:function(t){return t.replace(/^\s+|\s+$/g,"")},onDomReady:function(t,e){var n=e||window,a=!1,i=!0,r=n.document,s=r.documentElement,o=r.addEventListener?"addEventListener":"attachEvent",c=r.addEventListener?"removeEventListener":"detachEvent",u=r.addEventListener?"":"on",d=function(e){("readystatechange"!==e.type||"complete"===r.readyState)&&(("load"===e.type?n:r)[c](u+e.type,d,!1),a||(a=!0,t.call(n,e.type||e)))},h=function(){try{s.doScroll("left")}catch(t){return setTimeout(h,50),void 0}d("poll")};if("complete"===r.readyState)t.call(n,"lazy");else{if(r.createEventObject&&s.doScroll){try{i=!n.frameElement}catch(l){}i&&h()}r[o](u+"DOMContentLoaded",d,!1),r[o](u+"readystatechange",d,!1),n[o](u+"load",d,!1)}}},n.isDomReady=function(){var t=!1;return n.onDomReady(function(){t=!0}),function(){return t}}();var a=function(t,e){this.id=a.loaders.push(this)-1,this.load_queue=[],this.onload_counter=0,this.serializing_loading=e,this.setupEvents(),this.addToQueue(t)};a.loaders=[],a.getById=function(t){return t>=this.loaders.length?null:this.loaders[t]},a.prototype={id:null,serializing_loading:null,messaging_queue:null,load_queue:[],onload_counter:0,pause_state:!1,addToQueue:function(t,e){var a;if(n.isArray(t)===!1||0===t.length)return!1;if(n.isArray(this.load_queue)===!1&&(this.load_queue=[]),e===!0)for(a=t.length-1;a>=0;a-=1)this.load_queue.unshift(t[a]);else for(a=0;t.length>a;a+=1)this.load_queue.push(t[a]);return this.onload_counter+=t.length,!0},loadNextContainer:function(){var t,e;n.isArray(this.load_queue)!==!1&&0!==this.load_queue.length&&this.pause_state!==!0&&(e=this.load_queue.shift(),t=i.create(e,this),t.append())},setupEvents:function(){var e=this,a=n.call(this.onTagLoad,this),i=n.call(this.onLoadNextTag,this),r="ontagappend",s=function(){e.messaging_queue.publish("onpageload")};return this.messaging_queue=new p,this.serializing_loading===!0&&(r="ontagload"),this.messaging_queue.subscribe(r,i),this.messaging_queue.subscribe("ontagignore",i),this.messaging_queue.subscribe("ontagignore",a),this.messaging_queue.subscribe("ontagload",a),n.onDomReady(function(){e.messaging_queue.publish("ondomcontentloaded")},t),t.addEventListener?t.addEventListener("load",s,!1):t.attachEvent("onload",s),!0},onTagLoad:function(){this.pause_state!==!0&&(this.onload_counter-=1,0===this.onload_counter&&this.messaging_queue.publish("onload"))},onLoadNextTag:function(){this.loadNextContainer()},reset:function(){return this.load_queue=[],this.messaging_queue.reset(),this.setupEvents(),!0},pause:function(){this.pause_state=!0},resume:function(){this.pause_state=!1,this.loadNextContainer()},getId:function(){return this.id},subscribe:n.proxyMethodCall("subscribe","messaging_queue"),unsubscribe:n.proxyMethodCall("unsubscribe","messaging_queue"),publish:n.proxyMethodCall("publish","messaging_queue"),publishSync:n.proxyMethodCall("publishSync","messaging_queue")};var i=function(t,e){this.data||(this.data={}),this.data=n.mergeObject(this.data,{id:null,src:"",onload:"",inject:{tag:g,position:h},match:[]},!1),this.data=n.mergeObject(this.data,t),this.data.id=this.generateId(this.data),this.data!==t&&(this.data=n.getSanitizedObject(this.data,i.properties)),this.loader_instance=e};i.create=function(t,e){var n;switch(t.type){case"block-script":n=new s(t,e);break;case"script":n=new r(t,e);break;case"js":n=new o(t,e);break;case"html":n=new c(t,e);break;default:n=new i(t,e)}return this.containers.push(n),n},i.last_uid=-1,i.containers=[],i.getById=function(t){var e,n;for(e=0,n=this.containers.length;n>e;e+=1)if(void 0!==this.containers[e].data&&this.containers[e].data.id===t)return this.containers[e];return null},i.properties={id:"string",type:"string",src:"string",onload:"string",inject:{tag:"number",position:"number"},attributes:{async:"boolean",defer:"boolean"},match:{param:"string",param_name:"string",condition:"string",not:"boolean",values:{scalar:"string",pattern:"string",min:"date",max:"date",days:"number"}}},i.extend=function(t,e){var n,a,i=t.prototype;n=function(){},n.prototype=e.prototype,t.prototype=new n,t.prototype.constructor=t,t.superclass=e.prototype,e.prototype.constructor===Object.prototype.constructor&&(e.prototype.constructor=e);for(a in i)i.hasOwnProperty(a)&&(t.prototype[a]=i[a])},i.prototype={append:function(){var t,e=!1;return this.canAppendContainer()===!1?(this.loader_instance.publishSync("ontagignore."+this.data.id,{tagid:this.data.id,tag:this}),e):(this.setOnloadEvent(),t=this.getDomNode(),t!==!1&&(e=u.inject(t,this.data.inject.tag,this.data.inject.position)),e!==!1?this.loader_instance.publishSync("ontagappend."+this.data.id,{tagid:this.data.id,tag:this}):this.loader_instance.publishSync("ontagignore."+this.data.id,{tagid:this.data.id,tag:this}),e)},getDomNode:function(){return!1},setOnloadEvent:function(){var t=this;this.data.onload.length>0&&this.loader_instance.subscribe("ontagload."+t.data.id,function(e,a){return a.id!==t.data.id?!1:(n.executeJavaScript(t.data.onload),void 0)})},generateId:function(t){var e,n,a=!1,r=0;if(!t||!t.id)return"tm_"+(++i.last_uid+"");for(e=t.id;a!==!0;)r>0&&(e=t.id+"_"+r),n=i.getById(e),r+=1,null===n&&(a=!0);return e},getOnTagLoadPageCode:function(t){var e="",n="\\'";return t===!1&&(n="'"),e+="amc.call(",e+=n+"getLoaderById"+n+", ",e+=this.loader_instance.getId(),e+=").publish(",e+=n+"ontagload."+this.data.id+n+", {",e+="id: "+n+this.data.id+n+",",e+="tag: amc.call("+n+"getById"+n,e+=", "+n+this.data.id+n+")",e+="})"},canAppendContainer:function(){var t,e,a,i,r=this.data.match,s=!0;if(n.isArray(r)===!1)return s;for(a=0,i=r.length;i>a&&s===!0;a+=1)t=r[a].param,e="check"+t.charAt(0).toUpperCase(),e+=t.substr(1),"function"==typeof this[e]&&(s=this[e](r[a]),r[a].not===!0&&(s=!s));return s},checkDate:function(t){var e,a=!0;return n.isObject(t.values)===!1?a:(e=new Date,"daterange"===t.condition?a=this.checkDateRange(t.values):"dow"===t.condition&&(a=this.checkDayOfWeek(t.values)),a)},checkDateRange:function(t){var e;return n.isObject(t)===!1?!0:(e=new Date,-1!==t.min&&new Date(t.min)>e?!1:-1!==t.max&&e>new Date(t.max)?!1:!0)},checkDayOfWeek:function(t){var e,a,i,r;if(n.isObject(t)===!1||!t.days)return!0;for(e=t.days,n.isArray(t.days)===!1&&(e=[t.days]),a=(new Date).getDay(),r=0,i=e.length;i>r;r+=1)if(a===e[r])return!0;return!1},checkPath:function(e){return this.checkUrlPart(e,t.location.pathname)},checkHost:function(e){return this.checkUrlPart(e,t.location.hostname)},checkUrlPart:function(t,e){var a=!0;return n.isObject(t.values)===!1?a:a=this.testValueWithMatchCondition(t,e)},checkQuery:function(t){var e=this.getQueryValues();return this.checkValueFromObject(t,e)},checkCookie:function(e){var n=this.getRawValues(t.document.cookie,";",!1);return this.checkValueFromObject(e,n)},checkValueFromObject:function(t,e){var a=!0;return t.param_name&&n.isObject(t.values)!==!1?e[t.param_name]?a=this.testValueWithMatchCondition(t,e[t.param_name]):!1:a},testValueWithMatchCondition:function(t,e){var n,a,i=!0;return"regex"===t.condition?(n=this.getRegExpTestResult,a=t.values.pattern):"contains"===t.condition&&(n=this.getContainsTestResult,a=t.values.scalar),n&&(i=n(e,a)),i},getRegExpTestResult:function(t,e){var n=RegExp(e,"ig");return n.test(t)},getContainsTestResult:function(t,e){return-1!==t.indexOf(e)},getQueryValues:function(){var e=t.location.search;return 1>=e.length?{}:(e=location.search.substr(1),this.getRawValues(e,"&",!0))},getRawValues:function(t,e,a){var i,r,s,o,c={},u=decodeURIComponent;if(!e)return c;for(i=t.split(e),s=0,o=i.length;o>s;s+=1)r=i[s].split("="),r[0]=n.trim(r[0]),r[1]=n.trim(r[1]),a===!0&&(r[0]=u(r[0]),r[1]=u(r[1])),c[r[0]]="",r.length>1&&(c[r[0]]=r[1]);return c}};var r=function(t,e){this.data||(this.data={}),r.superclass.constructor.call(this,this.data,e),this.data=n.mergeObject(this.data,{attributes:{async:!0,defer:!0}},!1),this.data=n.mergeObject(this.data,t),this.data!==t&&(this.data=n.getSanitizedObject(this.data,i.properties))};r.prototype={getDomNode:function(){var t;return this.data.src?(t=this.getScriptNodeWithAttributes(),t.src=this.data.src,this.addOnLoadEvents(t),t):!1},getScriptNode:function(t){var e=document.createElement("script");return e.type="text/javascript",t!==!1&&(e.id=this.data.id),e},getScriptNodeWithAttributes:function(){var t,e,n,a=this.data.attributes,i=["async","defer"];for(n=this.getScriptNode(),t=0,e=i.length;e>t;t+=1)a[i[t]]!==!1&&(n[i[t]]=!0,n[i[t]]||(n[i[t]]=!0+""));return n},addOnLoadEvents:function(t){var e=!1,n=this,a=function(){e!==!1||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState||(e=!0,t.onload=t.onreadystatechange=null,n.loader_instance.publish("ontagload."+n.data.id,{id:n.data.id,tag:n}))};t.addEventListener?t.addEventListener("load",a,!1):t.readyState&&(t.onreadystatechange=a)}},i.extend(r,i);var s=function(t,e){this.data||(this.data={}),s.superclass.constructor.call(this,this.data,e),this.data=n.mergeObject(this.data,{attributes:{async:!1,defer:!1}},!1),this.data=n.mergeObject(this.data,t),this.data!==t&&(this.data=n.getSanitizedObject(this.data,i.properties))};s.prototype={getDomNode:function(){var t,e;return this.data.src?n.isDomReady()===!0?(e=n.mergeObject({},this.data,!1),e.type="script",this.loader_instance.addToQueue([e]),!1):(t=this.getScriptNode(!1),t.text=this.getDomNodeSource(t),t):!1},getDomNodeSource:function(t){var e;return e="document.write('<script src=\""+this.data.src+'"',e+=' id="'+this.data.id+'"',e+=t.addEventListener?' onload="'+this.getOnTagLoadPageCode()+'"':' onreadystatechange="'+this.getIeOnLoadFunction()+'"',e+="></script>');"},getIeOnLoadFunction:function(){var t="";return t+="if (this.addEventListener || ",t+="this.amc_load || ",t+="(this.readyState && ",t+="this.readyState !== \\'complete\\')",t+=") { return; } ",t+="this.amc_load = true; ",t+=this.getOnTagLoadPageCode()}},i.extend(s,r);var o=function(t,e){this.data||(this.data={}),o.superclass.constructor.call(this,this.data,e),this.data=n.mergeObject(this.data,{attributes:{async:!1,defer:!1}},!1),this.data=n.mergeObject(this.data,t),this.data!==t&&(this.data=n.getSanitizedObject(this.data,i.properties))};o.prototype={getDomNode:function(){var t;return this.data.src?(t=this.getScriptNodeWithAttributes(),t.text=this.getDomNodeSource(),t):!1},getDomNodeSource:function(){var t=this.data.src;return t+="; ",t+=this.getOnTagLoadPageCode(!1)}},i.extend(o,r);var c=function(t,e){c.superclass.constructor.call(this,t,e)};c.prototype={getDomNode:function(){var t,e;return this.data.src?(t=this.buildDocumentFragmentNode(this.data.src),t===!1?!1:-1===this.data.src.indexOf("<script")?(this.addOnLoadEvents(t),t):(e=this.getConfigChunksFromHtml(t),this.appendNodesWithSeparateLoader(e),!1)):!1},buildDocumentFragmentNode:function(t){var e,n,a=document.createElement("div");if(e=document.createDocumentFragment(),!t)return e;if(a.innerHTML="a<div>"+t.replace(/^\s\s*/,"")+"</div>",a=a.lastChild,0===a.childNodes.length)return!1;for(;a.firstChild;)n=a.removeChild(a.firstChild),e.appendChild(n);return e},addOnLoadEvents:function(t){var e=r.prototype.getScriptNode(!1);e.text=this.getOnTagLoadPageCode(!1),t.appendChild(e)},getConfigChunksFromHtml:function(t){var e,n=[],a=document.createElement("div");if(!t)return n;for(;t.firstChild;)e=t.removeChild(t.firstChild),"SCRIPT"===e.tagName?(a.childNodes.length>0&&(n.push(this.getHtmlConfigFromChunk(a)),a.innerHTML=""),n.push(this.getScriptConfigFromChunk(e))):a.appendChild(e);return a.childNodes.length>0&&n.push(this.getHtmlConfigFromChunk(a)),n},getHtmlConfigFromChunk:function(t){var e=t.innerHTML;return{src:e,type:"html"}},getScriptConfigFromChunk:function(t){return""!==t.src?{src:t.src,type:"script"}:""!==t.text?{src:t.text,type:"js"}:!1},appendNodesWithSeparateLoader:function(t){var e=new a(t,!0),n=this;e.subscribe("onload",function(){n.loader_instance.publish("ontagload."+n.data.id,{id:n.data.id,tag:n}),n.loader_instance.resume()}),this.loader_instance.pause(),e.loadNextContainer()}},i.extend(c,i);var u,d=1,h=2,l=1,g=2;u=function(){var t;return t={inject:function(t,e,n){var a;return n=parseInt(n,10),e=parseInt(e,10),e||(e=g),a=this.getParentNode(e),this.doInjection(t,a,n)},doInjection:function(t,e,n){return t&&e?(n||(n=h),n===d?this.injectAtStart(t,e):n===h?this.injectAtEnd(t,e):!1):!1},injectAtStart:function(t,e){return 0===e.childNodes.length?this.injectAtEnd(t,e):(e.insertBefore(t,e.childNodes[0]),!0)},injectAtEnd:function(t,e){return e.appendChild(t),!0},getParentNode:function(t){var e;switch(t||(t=this.BODY),t){case l:e=this.getDomNode("head");break;case g:e=this.getDomNode("body")}return e},getDomNode:function(t){var e=document.getElementsByTagName(t);return e[0]||!1}},{inject:function(e,n,a){return t.inject(e,n,a)}}}();var p=function(t){var e=this;return this.messages={},this.archive={},this.immediateExceptions=t,{publish:function(t,n,a){return e.publish(t,n,!1,e.immediateExceptions,a)},publishSync:function(t,n,a){return e.publish(t,n,!0,e.immediateExceptions,a)},subscribe:n.call(e.subscribe,e),unsubscribe:n.call(e.unsubscribe,e),reset:n.call(e.reset,e)}};p.last_uid=-1,p.prototype={throwException:function(t){return function(){throw t}},callSubscriberWithDelayedExceptions:function(t,e,n){try{t(e,n)}catch(a){setTimeout(this.throwException(a),0)}},callSubscriberWithImmediateExceptions:function(t,e,n){t(e,n)},deliverMessage:function(t,e,n,a,i){var r,s,o,c=i||this.messages,u=c[e];if(r=this.callSubscriberWithDelayedExceptions,a&&(r=this.callSubscriberWithImmediateExceptions),c.hasOwnProperty(e))for(s=0,o=u.length;o>s;s++)r.call(this,u[s].func,t,n)},createDeliveryFunction:function(t,e,n,a){var i=this;return function(){var r=t+"",s=r.lastIndexOf(".");for(i.deliverMessage(t,t,e,n,a);-1!==s;)r=r.substr(0,s),s=r.lastIndexOf("."),i.deliverMessage(t,r,e,null,a)}},messageHasSubscribers:function(t){for(var e=t+"",n=this.messages.hasOwnProperty(e),a=e.lastIndexOf(".");!n&&-1!==a;)e=e.substr(0,a),a=e.lastIndexOf("."),n=this.messages.hasOwnProperty(e);return n},publish:function(t,e,a,i,r){var s=this.createDeliveryFunction(t,e,i,n.clone(this.messages)),o=this.messageHasSubscribers(t);return r!==!1&&this.archiveMessage(t,e,a,i),o?(a===!0?s():setTimeout(s,0),!0):!1},archiveMessage:function(t,e,n,a){this.archive.hasOwnProperty(t)||(this.archive[t]=[]),this.archive[t].push({message:t,data:e,sync:n,immediateExceptions:a})},processArchive:function(t,e){var a;for(a in this.archive)if(this.archive.hasOwnProperty(a)===!0&&0===a.indexOf(t)){if(a.length>t.length&&"."!==a.charAt(t.length))continue;this.deliverArchivedMessage(t,a,e,n.clone(this.archive))}},createArchivedMessageDeliveryFunction:function(t,e,n){var a=this;return function(){var i=a.callSubscriberWithDelayedExceptions;n.immediateExceptions&&(i=a.callSubscriberWithImmediateExceptions),i.call(a,t,e,n.data)}},deliverArchivedMessage:function(t,e,n,a){var i,r,s,o=a||this.archive,c=o[e];if(o.hasOwnProperty(e))for(r=0,s=c.length;s>r;r++)i=this.createArchivedMessageDeliveryFunction(n,e,c[r]),c[r].sync===!0?i():setTimeout(i,0)},subscribe:function(t,e,n){this.messages.hasOwnProperty(t)||(this.messages[t]=[]);var a=++p.last_uid+"";return this.messages[t].push({token:a,func:e}),n!==!1&&this.processArchive(t,e),a},unsubscribe:function(t){var e,n,a=this.messages,i="string"==typeof t,r=i?"token":"func",s=i?t:!0,o=!1;for(e in a)if(a.hasOwnProperty(e))for(n=a[e].length-1;n>=0;n--)if(a[e][n][r]===t&&(a[e].splice(n,1),o=s,i))return o;return o},reset:function(){this.messages={},this.archive={}}};var f=function(){var t=this;return this.loader=new a,{name:"Adobe TagManager Library",version:"2.0.1",call:function(){var e=Array.prototype.slice.call(arguments),n=e.shift();return t[n]?t[n].apply(t,e):void 0},on:function(){var e=Array.prototype.slice.call(arguments),n=e[0];"on"!==n.substr(0,2)&&(n="on"+n,e[0]=n),t.subscribe.apply(t,e)}}};return f.prototype={loader:null,subscribe:n.proxyMethodCall("subscribe","loader"),unsubscribe:n.proxyMethodCall("unsubscribe","loader"),publish:n.proxyMethodCall("publish","loader"),reset:n.proxyMethodCall("reset","loader"),load:function(t){this.loader.addToQueue(t),this.loader.loadNextContainer()},init:function(){this.load(n.jsonDecode("[{\"id\":\"sitecatalyst_stub\",\"type\":\"js\",\"src\":\"var s=new SC_Stub();\\ns.tagContainerName=\\\"IBRefreshDev_s\\\";\\n\\n\\\/************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************\\\/\\nfunction SC_Stub(){var t=this,w=t.w=window;t.d=w.document;t._c='s_l';if(!w.s_c_il){w.s_c_il=[];w.s_c_in=0}t._il=w.s_c_il;t._in=w.s_c_in;t._il[t._in]=t;w.s_c_in++;t.fs=function(x,y){if(x&&y){var a=\\nx.split(','),b=y.split(','),i,j;for(i=0;i<a.length;i++){for(j=0;j<b.length;j++)if(a[i]==b[j])return 1}}return 0};t.aa=function(a){var b=0,i;if(a){b=[];for(i=0;i<a.length;i++)b[i]=a[i]}return b};t.wl=[\\n];t.wq=[];t.createAsynchronousCustomTagHandler=function(o,f){var t=this,x,i;if(!f){f=o;o=0;x=t.w}else{if(!t.w[o])t.w[o]={};x=t.wl[o]=t.w[o]}if(typeof(f)!='object')f=[f];for(i=0;i<f.length;i++)if(!x[f[\\ni]])x[f[i]]=new Function('var t=s_c_il['+t._in+'];t.wq[t.wq.length]={'+(o?'o:\\\"'+o+'\\\",':'')+'f:\\\"'+f[i]+'\\\",a:t.aa(arguments)}')};t.as=function(x){var y=[],i;for(i=1;i<x.length;i++)y[y.length]=x[i]\\nreturn y};t.s=0;t.contextData={};t.retrieveLightData={};if(!w.s_giq)w.s_giq=[];t._gi=w.s_gi;w.s_gi=new Function('u','var t=s_c_il['+t._in+\\n'],w=t.w,l=t._il,i,j,x,s;u=u.toLowerCase();if(l)for(j=0;j<2;j++)for(i=0;i<l.length;i++){s=l[i];x=s._c;if((!x||x==\\\"s_c\\\"||(j>0&&x==\\\"s_l\\\"))&&s.oun&&(s.oun==u||(s.fs&&s.sa&&s.fs(s.oun,u)))){'+\\n'if(s.sa)s.sa(u);return s}}if(!t.oun){t.sa(u);return t}if(t._gi)return t._gi(u);s=new SC_Stub();s.tagContainerName=\\\"s_tca_\\\"+w.s_giq.length;s.sa(u);w.s_giq[w.s_giq.length]=s;return s');t.sa=function(u)\\n{var t=this;if(t.s)t.s.sa(u);t.un=u;if(!t.oun)t.oun=u;else if(!t.fs(t.oun,u))t.oun+=','+u};t.tq=[];t.track=t.t=function(vo){var t=this,m;if(t.s)return t.s.t(vo);if(!vo)vo={};for(m in t){if(m!='un'\\n||t.u!=t.un)vo[m]=t[m]}t.tq[t.tq.length]=vo;t.lnk=t.linkName=t.linkType='';return '';};t.trackLink=t.tl=function(o,u,n,vo){var t=this;if(t.s)return t.s.tl(o,u,v,vo);t.lnk=o;t.linkType=u;t.linkName=n\\nreturn t.t(vo)};t.trackLight=function(p,ss,i,vo){var t=this;if(t.s)return t.s.trackLight(p,ss,i,vo);t.lightProfileID=p;t.lightStoreForSeconds=ss;t.lightIncrementBy=i;return t.t(vo)};t.lmq=[]\\nt.loadModule=function(n,u,d){var t=this;if(t.s)return t.s.loadModule(n,u,d);t.lmq[t.lmq.length]={n:n,u:u,d:d};return 0};t.ml=[];t.mmq=[];t.mo=function(m,f){var t=this,i;t.ml[m]=t[m]={};if(f)\\nfor(i=0;i<f.length;i++)t[m][f[i]]=new Function('var t=s_c_il['+t._in+'];t.mmq[t.mmq.length]={m:\\\"'+m+'\\\",f:\\\"'+f[i]+'\\\",a:t.aa(arguments)}')};t.mo('Media',['open','play','stop','close','track']);t.mo(\\n'Survey',['launch']);}\",\"inject\":{\"tag\":2,\"position\":2},\"onload\":\"\",\"match\":{}},{\"id\":\"sitecatalyst\",\"type\":\"script\",\"src\":" + siteCatalystScriptUrl + ",\"inject\":{\"tag\":2,\"position\":2},\"onload\":\"\",\"match\":[]}]"))},getById:n.call(i.getById,i),getLoaderById:n.call(a.getById,a)},new f(e)}("object"==typeof window&&window||this);

/**!
 * Adobe TagManager Loader version: 2.0.1
 * Copyright 1996-2013 Adobe Systems Incorporated. All rights reserved.
 * More info available at http://www.adobe.com/solutions/digital-marketing.html
 */

var amc_l_config = {
        cookie: 's_tagEnv',
        environments: ['live', 'stage', 'dev'],
        server: 'www.adobetag.com',
        dc: 'd1',
        bucket_id: 'ZDEtYWNjc3RhbmRhcmRiYW5rLTI4ODYtNDMwNi0='
    };

/************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/

(function(e){"use strict";if(!e.server||!e.dc||!e.bucket_id)return!1;var c,i,t,n=document,o=e.cookie,r=e.environments,a=r.length,s=r[0],f=["//",e.server,"/",e.dc,"/v2/","/",e.bucket_id,"/"],u=window.location.search.substr(1);for(t=RegExp(o+"=("+r.join("|")+")&?"),c=t.exec(u),c&&(n.cookie=o+"="+c[1]+"; path=/"),i=1;a>i;i+=1)if(-1!==n.cookie.indexOf(o+"="+r[i])){s=r[i];break}f.push(s),s!==r[0]?n.write(['<script type="text/javascript" src="',f.join(""),'/atm.js"></script>'].join("")):"undefined"!=typeof amc&&"function"==typeof amc.call&&amc.call("init")})(amc_l_config);