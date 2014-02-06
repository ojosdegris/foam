/**
 * @license
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var ScrollCView = FOAM({

   model_: 'Model',

   extendsModel: 'CView',

   name:  'ScrollCView',

   properties: [
      {
         name:  'parent',
         type:  'CView',
         hidden: true,
         postSet: function(newValue, oldValue) {
//         oldValue && oldValue.removeListener(this.updateValue);
//         newValue.addListener(this.updateValue);
           var e = newValue.$;
           if ( ! e ) return;
           e.addEventListener('mousedown', this.mouseDown, false);
           e.addEventListener('touchstart', this.touchStart, false);
//           e.addEventListener('mouseup',   this.mouseUp,   false);
         }
      },
      {
        name:  'vertical',
        type:  'boolean',
        defaultValue: true
      },
      {
        name:  'value',
        type:  'int',
        help:  'The first element being shown, starting at zero.',
        defaultValue: 0
      },
      {
        name:  'extent',
        help:  'Number of elements shown.',
        type:  'int',
        defaultValue: 10
      },
      {
         name:  'size',
         type:  'int',
         defaultValue: 0,
         help:  'Total number of elements being scrolled through.',
         postSet: function() { this.paint(); }
      },
      {
         name:  'minHandleSize',
         type:  'int',
         defaultValue: 10,
         help:  'Minimum size to make the drag handle.'
      },
      {
        name: 'startY',
        type: 'int',
        defaultValue: 0
      },
      {
        name: 'startValue',
        help: 'Starting value or current drag operation.',
        type: 'int',
        defaultValue: 0
      },
      {
         name:  'handleColor',
         type:  'String',
         defaultValue: 'rgb(107,136,173)'
      },
      {
         name:  'borderColor',
         type:  'String',
         defaultValue: '#555'
      }
   ],

   listeners: {
     mouseDown: function(e) {
//       this.parent.$.addEventListener('mousemove', this.mouseMove, false);
       this.startY = e.y - e.offsetY;
       e.target.ownerDocument.defaultView.addEventListener('mouseup', this.mouseUp, true);
       e.target.ownerDocument.defaultView.addEventListener('mousemove', this.mouseMove, true);
       e.target.ownerDocument.defaultView.addEventListener('touchstart', this.touchstart, true);
       this.mouseMove(e);
     },
     mouseUp: function(e) {
       e.preventDefault();
       e.target.ownerDocument.defaultView.removeEventListener('mousemove', this.mouseMove, true);
       e.target.ownerDocument.defaultView.removeEventListener('mouseup', this.mouseUp, true);
//       this.parent.$.removeEventListener('mousemove', this.mouseMove, false);
     },
     mouseMove: function(e) {
       var y = e.y - this.startY;
       e.preventDefault();

       this.value = Math.max(0, Math.min(this.size - this.extent, Math.round(( y - this.y ) / (this.height-4) * this.size)));
     },
     touchStart: function(e) {
       this.startY = e.targetTouches[0].pageY;
       this.startValue = this.value;
       e.target.ownerDocument.defaultView.addEventListener('touchmove', this.touchMove, false);
//       this.parent.$.addEventListener('touchmove', this.touchMove, false);
       this.touchMove(e);
     },
     touchEnd: function(e) {
       e.target.ownerDocument.defaultView.removeEventListener('touchmove', this.touchMove, false);
       e.target.ownerDocument.defaultView.removeEventListener('touchend', this.touchEnd, false);
//       this.parent.$.removeEventListener('touchmove', this.touchMove, false);
     },
     touchMove: function(e) {
       var y = e.targetTouches[0].pageY;
       e.preventDefault();
       this.value = Math.max(0, Math.min(this.size - this.extent, Math.round(this.startValue + (y - this.startY) / (this.height-4) * this.size )));
     },
     updateValue: function() {
       this.paint();
     }
   },

   methods: {

    init: function(args) {
      this.SUPER(args);
      this.addListener(EventService.animate(this.paint.bind(this)));
    },

    paint: function() {
      if ( ! this.size ) return;

      var c = this.canvas;
      if ( ! c ) return;

      this.erase();

      if ( this.extent >= this.size ) return;

      c.strokeStyle = this.borderColor;
      c.strokeRect(this.x, this.y, this.width-2, this.height);

      c.fillStyle = this.handleColor;

      var h = this.height-8;
      var handleSize = this.extent / this.size * h;

      if ( handleSize < this.minHandleSize ) {
        h -= this.minHandleSize - handleSize;
        handleSize = this.minHandleSize;
      }

      c.fillRect(
        this.x + 2,
        this.y + 2 + this.value / this.size * h,
        this.width - 6,
        this.y + 2 + handleSize);
    },

    destroy: function() {
//      this.value.removeListener(this.listener_);
    }
   }
});


/** Add a scrollbar around an inner-view. **/
var ScrollBorder = FOAM({

   model_: 'Model',

   extendsModel: 'AbstractView',

   name:  'ScrollBorder',

   properties: [
     {
       name: 'view',
       type: 'view',
       postSet: function(view) {
         this.scrollbar.extent = this.view.rows;
       },
       memorable: true
     },
       {
           name: 'scrollbar',
           type: 'ScrollCView',
           valueFactory: function() {
             var sb = ScrollCView.create({height:1800, width: 20, x: 2, y: 2, extent: 10});

             if ( this.dao ) this.dao.select(COUNT())(function(c) { sb.size = c.count; });

             return sb;
           }
       },
       {
         name:  'dao',
         label: 'DAO',
         type: 'DAO',
         hidden: true,
         required: true,
         postSet: function(newValue, oldValue) {
          this.view.dao = newValue;
           var self = this;

           if ( this.dao ) this.dao.select(COUNT())(function(c) {
               self.scrollbar.size = c.count;
               self.scrollbar.value = Math.max(0, Math.min(self.scrollbar.value, self.scrollbar.size - self.scrollbar.extent));
               if ( self.dao ) self.view.dao = self.dao.skip(self.scrollbar.value);
           });
           /*
           if ( oldValue && this.listener ) oldValue.unlisten(this.listener);
           this.listener && val.listen(this.listener);
           this.repaint_ && this.repaint_();
            */
         }
       },
     {
       name: 'memento',
       setter: function(m) {
         if ( this.view ) this.view.memento = m;
       },
       getter: function() {
         return this.view ? this.view.memento : {};
       }
     }
   ],

  listeners: [
    {
      model_: 'Method',
      name: 'layout',
      code: function() {
        this.view.layout();
      }
    }
  ],

   methods: {
     toHTML: function() {
       return '<table id="' + this.getID() + '" width=100% height=100% border=0><tr><td valign=top>' +
         this.view.toHTML() +
         '</td><td valign=top><div class="scrollSpacer"></div>' +
         this.scrollbar.toHTML() +
         '</td></tr></table>';
     },
     initHTML: function() {
       window.addEventListener('resize', this.layout, false);
       this.view.initHTML();
       this.scrollbar.initHTML();
       this.scrollbar.paint();

       var view = this.view;
       var scrollbar = this.scrollbar;
       var self = this;

       view.$.onmousewheel = function(e) {
          if ( e.wheelDeltaY > 0 && scrollbar.value ) {
             scrollbar.value--;
          } else if ( e.wheelDeltaY < 0 && scrollbar.value < scrollbar.size - scrollbar.extent ) {
             scrollbar.value++;
          }
       };
       scrollbar.addPropertyListener('value', EventService.animate(function() {
         if ( self.dao ) self.view.dao = self.dao.skip(scrollbar.value);
       }));

/*
       Events.dynamic(function() {scrollbar.value;}, );
*/
       Events.dynamic(function() {view.rows;}, function() {
         scrollbar.extent = view.rows;
       });
       Events.dynamic(function() {view.height;}, function() {
         scrollbar.height = Math.max(view.height - 26, 0);
       });

       this.layout();
     }
   }
});
