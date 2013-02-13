/*
* jQuery Mobile Framework : scrollview plugin
* 
* Source: http://jquerymobile.com/test/experiments/scrollview/jquery.mobile.scrollview.js
* 
* Copyright (c) 2010 Adobe Systems Incorporated - Kin Blas (jblas@adobe.com)
* Dual licensed under the MIT (MIT-LICENSE.txt) and GPL (GPL-LICENSE.txt) licenses.
* Note: Code is in draft form and is subject to change 
*/
(function(a,b,c,d){function h(){return(new Date).getTime()}function f(b){this.options=a.extend({},b);this.easing="easeOutQuad";this.reset()}function e(a,b,c){var d="translate3d("+b+","+c+", 0px)";a.css({"-moz-transform":d,"-webkit-transform":d,transform:d})}jQuery.widget("mobile.scrollview",jQuery.mobile.widget,{options:{fps:60,direction:null,scrollDuration:2e3,overshootDuration:250,snapbackDuration:500,moveThreshold:10,moveIntervalThreshold:150,scrollMethod:"translate",startEventName:"scrollstart",updateEventName:"scrollupdate",stopEventName:"scrollstop",eventType:a.support.touch?"touch":"mouse",showScrollBars:true,pagingEnabled:false,delayedClickSelector:"a,input,textarea,select,button,.ui-btn",delayedClickEnabled:false},_makePositioned:function(a){if(a.css("position")=="static")a.css("position","relative")},_create:function(){this._$clip=a(this.element).addClass("ui-scrollview-clip");var b=this._$clip.children();if(b.length>1){b=this._$clip.wrapInner("<div></div>").children()}this._$view=b.addClass("ui-scrollview-view");this._$clip.css("overflow",this.options.scrollMethod==="scroll"?"scroll":"hidden");this._makePositioned(this._$clip);this._$view.css("overflow","hidden");this.options.showScrollBars=this.options.scrollMethod==="scroll"?false:this.options.showScrollBars;this._makePositioned(this._$view);this._$view.css({left:0,top:0});this._sx=0;this._sy=0;var c=this.options.direction;this._hTracker=c!=="y"?new f(this.options):null;this._vTracker=c!=="x"?new f(this.options):null;this._timerInterval=1e3/this.options.fps;this._timerID=0;var d=this;this._timerCB=function(){d._handleMomentumScroll()};this._addBehaviors()},_startMScroll:function(a,b){this._stopMScroll();this._showScrollBars();var c=false;var d=this.options.scrollDuration;this._$clip.trigger(this.options.startEventName);var e=this._hTracker;if(e){var f=this._$clip.width();var g=this._$view.width();e.start(this._sx,a,d,g>f?-(g-f):0,0);c=!e.done()}var h=this._vTracker;if(h){var f=this._$clip.height();var g=this._$view.height();h.start(this._sy,b,d,g>f?-(g-f):0,0);c=c||!h.done()}if(c)this._timerID=setTimeout(this._timerCB,this._timerInterval);else this._stopMScroll()},_stopMScroll:function(){if(this._timerID){this._$clip.trigger(this.options.stopEventName);clearTimeout(this._timerID)}this._timerID=0;if(this._vTracker)this._vTracker.reset();if(this._hTracker)this._hTracker.reset();this._hideScrollBars()},_handleMomentumScroll:function(){var a=false;var b=this._$view;var c=0,d=0;var e=this._vTracker;if(e){e.update();d=e.getPosition();a=!e.done()}var f=this._hTracker;if(f){f.update();c=f.getPosition();a=a||!f.done()}this._setScrollPosition(c,d);this._$clip.trigger(this.options.updateEventName,[{x:c,y:d}]);if(a)this._timerID=setTimeout(this._timerCB,this._timerInterval);else this._stopMScroll()},_setScrollPosition:function(a,b){this._sx=a;this._sy=b;var c=this._$view;var d=this.options.scrollMethod;switch(d){case"translate":e(c,a+"px",b+"px");break;case"position":c.css({left:a+"px",top:b+"px"});break;case"scroll":var f=this._$clip[0];f.scrollLeft=-a;f.scrollTop=-b;break}var g=this._$vScrollBar;var h=this._$hScrollBar;if(g){var i=g.find(".ui-scrollbar-thumb");if(d==="translate")e(i,"0px",-b/c.height()*i.parent().height()+"px");else i.css("top",-b/c.height()*100+"%")}if(h){var i=h.find(".ui-scrollbar-thumb");if(d==="translate")e(i,-a/c.width()*i.parent().width()+"px","0px");else i.css("left",-a/c.width()*100+"%")}},scrollTo:function(b,c,d){this._stopMScroll();if(!d)return this._setScrollPosition(b,c);b=-b;c=-c;var e=this;var f=h();var g=a.easing["easeOutQuad"];var i=this._sx;var j=this._sy;var k=b-i;var l=c-j;var m=function(){var a=h()-f;if(a>=d){e._timerID=0;e._setScrollPosition(b,c)}else{var n=g(a/d,a,0,1,d);e._setScrollPosition(i+k*n,j+l*n);e._timerID=setTimeout(m,e._timerInterval)}};this._timerID=setTimeout(m,this._timerInterval)},getScrollPosition:function(){return{x:-this._sx,y:-this._sy}},_getScrollHierarchy:function(){var b=[];this._$clip.parents(".ui-scrollview-clip").each(function(){var c=a(this).jqmData("scrollview");if(c)b.unshift(c)});return b},_getAncestorByDirection:function(a){var b=this._getScrollHierarchy();var c=b.length;while(0<c--){var d=b[c];var e=d.options.direction;if(!e||e==a)return d}return null},_handleDragStart:function(b,c,d){a.each(this._getScrollHierarchy(),function(a,b){b._stopMScroll()});this._stopMScroll();var e=this._$clip;var f=this._$view;if(this.options.delayedClickEnabled){this._$clickEle=a(b.target).closest(this.options.delayedClickSelector)}this._lastX=c;this._lastY=d;this._doSnapBackX=false;this._doSnapBackY=false;this._speedX=0;this._speedY=0;this._directionLock="";this._didDrag=false;if(this._hTracker){var g=parseInt(e.css("width"),10);var h=parseInt(f.css("width"),10);this._maxX=g-h;if(this._maxX>0)this._maxX=0;if(this._$hScrollBar)this._$hScrollBar.find(".ui-scrollbar-thumb").css("width",g>=h?"100%":Math.floor(g/h*100)+"%")}if(this._vTracker){var i=parseInt(e.css("height"),10);var j=parseInt(f.css("height"),10);this._maxY=i-j;if(this._maxY>0)this._maxY=0;if(this._$vScrollBar)this._$vScrollBar.find(".ui-scrollbar-thumb").css("height",i>=j?"100%":Math.floor(i/j*100)+"%")}var k=this.options.direction;this._pageDelta=0;this._pageSize=0;this._pagePos=0;if(this.options.pagingEnabled&&(k==="x"||k==="y")){this._pageSize=k==="x"?g:i;this._pagePos=k==="x"?this._sx:this._sy;this._pagePos-=this._pagePos%this._pageSize}this._lastMove=0;this._enableTracking();if(this.options.eventType=="mouse"||this.options.delayedClickEnabled)b.preventDefault();b.stopPropagation()},_propagateDragMove:function(a,b,c,d,e){this._hideScrollBars();this._disableTracking();a._handleDragStart(b,c,d);a._directionLock=e;a._didDrag=this._didDrag},_handleDragMove:function(a,b,c){this._lastMove=h();var d=this._$view;var e=b-this._lastX;var f=c-this._lastY;var g=this.options.direction;if(!this._directionLock){var i=Math.abs(e);var j=Math.abs(f);var k=this.options.moveThreshold;if(i<k&&j<k){return false}var l=null;var m=0;if(i<j&&i/j<.5){l="y"}else if(i>j&&j/i<.5){l="x"}if(g&&l&&g!=l){var n=this._getAncestorByDirection(l);if(n){this._propagateDragMove(n,a,b,c,l);return false}}this._directionLock=g?g:l?l:"none"}var o=this._sx;var p=this._sy;if(this._directionLock!=="y"&&this._hTracker){var i=this._sx;this._speedX=e;o=i+e;this._doSnapBackX=false;if(o>0||o<this._maxX){if(this._directionLock==="x"){var n=this._getAncestorByDirection("x");if(n){this._setScrollPosition(o>0?0:this._maxX,p);this._propagateDragMove(n,a,b,c,l);return false}}o=i+e/2;this._doSnapBackX=true}}if(this._directionLock!=="x"&&this._vTracker){var j=this._sy;this._speedY=f;p=j+f;this._doSnapBackY=false;if(p>0||p<this._maxY){if(this._directionLock==="y"){var n=this._getAncestorByDirection("y");if(n){this._setScrollPosition(o,p>0?0:this._maxY);this._propagateDragMove(n,a,b,c,l);return false}}p=j+f/2;this._doSnapBackY=true}}if(this.options.pagingEnabled&&(g==="x"||g==="y")){if(this._doSnapBackX||this._doSnapBackY)this._pageDelta=0;else{var q=this._pagePos;var r=g==="x"?o:p;var s=g==="x"?e:f;this._pageDelta=q>r&&s<0?this._pageSize:q<r&&s>0?-this._pageSize:0}}this._didDrag=true;this._lastX=b;this._lastY=c;this._setScrollPosition(o,p);this._showScrollBars();return false},_handleDragStop:function(a){var b=this._lastMove;var c=h();var e=b&&c-b<=this.options.moveIntervalThreshold;var f=this._hTracker&&this._speedX&&e?this._speedX:this._doSnapBackX?1:0;var g=this._vTracker&&this._speedY&&e?this._speedY:this._doSnapBackY?1:0;var i=this.options.direction;if(this.options.pagingEnabled&&(i==="x"||i==="y")&&!this._doSnapBackX&&!this._doSnapBackY){var j=this._sx;var k=this._sy;if(i==="x")j=-this._pagePos+this._pageDelta;else k=-this._pagePos+this._pageDelta;this.scrollTo(j,k,this.options.snapbackDuration)}else if(f||g)this._startMScroll(f,g);else this._hideScrollBars();this._disableTracking();if(!this._didDrag&&this.options.delayedClickEnabled&&this._$clickEle.length){this._$clickEle.trigger("mousedown").trigger("mouseup").trigger("click")}return this._didDrag?false:d},_enableTracking:function(){a(c).bind(this._dragMoveEvt,this._dragMoveCB);a(c).bind(this._dragStopEvt,this._dragStopCB)},_disableTracking:function(){a(c).unbind(this._dragMoveEvt,this._dragMoveCB);a(c).unbind(this._dragStopEvt,this._dragStopCB)},_showScrollBars:function(){var a="ui-scrollbar-visible";if(this._$vScrollBar)this._$vScrollBar.addClass(a);if(this._$hScrollBar)this._$hScrollBar.addClass(a)},_hideScrollBars:function(){var a="ui-scrollbar-visible";if(this._$vScrollBar)this._$vScrollBar.removeClass(a);if(this._$hScrollBar)this._$hScrollBar.removeClass(a)},_addBehaviors:function(){var a=this;if(this.options.eventType==="mouse"){this._dragStartEvt="mousedown";this._dragStartCB=function(b){return a._handleDragStart(b,b.clientX,b.clientY)};this._dragMoveEvt="mousemove";this._dragMoveCB=function(b){return a._handleDragMove(b,b.clientX,b.clientY)};this._dragStopEvt="mouseup";this._dragStopCB=function(b){return a._handleDragStop(b)}}else{this._dragStartEvt="touchstart";this._dragStartCB=function(b){var c=b.originalEvent.targetTouches[0];return a._handleDragStart(b,c.pageX,c.pageY)};this._dragMoveEvt="touchmove";this._dragMoveCB=function(b){var c=b.originalEvent.targetTouches[0];return a._handleDragMove(b,c.pageX,c.pageY)};this._dragStopEvt="touchend";this._dragStopCB=function(b){return a._handleDragStop(b)}}this._$view.bind(this._dragStartEvt,this._dragStartCB);if(this.options.showScrollBars){var b=this._$clip;var c='<div class="ui-scrollbar ui-scrollbar-';var d='"><div class="ui-scrollbar-track"><div class="ui-scrollbar-thumb"></div></div></div>';if(this._vTracker){b.append(c+"y"+d);this._$vScrollBar=b.children(".ui-scrollbar-y")}if(this._hTracker){b.append(c+"x"+d);this._$hScrollBar=b.children(".ui-scrollbar-x")}}}});var g={scrolling:0,overshot:1,snapback:2,done:3};a.extend(f.prototype,{start:function(a,b,c,d,e){this.state=b!=0?a<d||a>e?g.snapback:g.scrolling:g.done;this.pos=a;this.speed=b;this.duration=this.state==g.snapback?this.options.snapbackDuration:c;this.minPos=d;this.maxPos=e;this.fromPos=this.state==g.snapback?this.pos:0;this.toPos=this.state==g.snapback?this.pos<this.minPos?this.minPos:this.maxPos:0;this.startTime=h()},reset:function(){this.state=g.done;this.pos=0;this.speed=0;this.minPos=0;this.maxPos=0;this.duration=0},update:function(){var b=this.state;if(b==g.done)return this.pos;var c=this.duration;var d=h()-this.startTime;d=d>c?c:d;if(b==g.scrolling||b==g.overshot){var e=this.speed*(1-a.easing[this.easing](d/c,d,0,1,c));var f=this.pos+e;var i=b==g.scrolling&&(f<this.minPos||f>this.maxPos);if(i)f=f<this.minPos?this.minPos:this.maxPos;this.pos=f;if(b==g.overshot){if(d>=c){this.state=g.snapback;this.fromPos=this.pos;this.toPos=f<this.minPos?this.minPos:this.maxPos;this.duration=this.options.snapbackDuration;this.startTime=h();d=0}}else if(b==g.scrolling){if(i){this.state=g.overshot;this.speed=e/2;this.duration=this.options.overshootDuration;this.startTime=h()}else if(d>=c)this.state=g.done}}else if(b==g.snapback){if(d>=c){this.pos=this.toPos;this.state=g.done}else this.pos=this.fromPos+(this.toPos-this.fromPos)*a.easing[this.easing](d/c,d,0,1,c)}return this.pos},done:function(){return this.state==g.done},getPosition:function(){return this.pos}});jQuery.widget("mobile.scrolllistview",jQuery.mobile.scrollview,{options:{direction:"y"},_create:function(){a.mobile.scrollview.prototype._create.call(this);this._$dividers=this._$view.find(":jqmData(role='list-divider')");this._lastDivider=null},_setScrollPosition:function(b,c){a.mobile.scrollview.prototype._setScrollPosition.call(this,b,c);c=-c;var d=this._$dividers;var f=d.length;var g=null;var h=0;var i=null;for(var j=0;j<f;j++){i=d.get(j);var k=i.offsetTop;if(c>=k){g=i;h=k}else if(g)break}if(g){var l=g.offsetHeight;var m=g!=i?i.offsetTop:this._$view.get(0).offsetHeight;if(c+l>=m)c=m-l-h;else c=c-h;var n=this._lastDivider;if(n&&g!=n){e(a(n),0,0)}e(a(g),0,c+"px");this._lastDivider=g}}})})(jQuery,window,document)