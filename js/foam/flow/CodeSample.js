/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

CLASS({
  name: 'CodeSample',
  package: 'foam.flow',
  extendsModel: 'foam.flow.Element',

  requires: [
    'foam.dao.EasyDAO',
    'foam.ui.ActionButton',
    'foam.flow.CodeSampleOutput',
    'foam.flow.CodeSampleOutputView',
    'foam.flow.CodeSnippet',
    'foam.flow.CodeSnippetView',
    'foam.flow.SourceCodeListView'
  ],

  imports: [
    'document',
    'codeViewName',
    'actionButtonName'
  ],

  properties: [
    {
      model_: 'StringProperty',
      name: 'codeViewName',
      defaultValue: 'foam.flow.CodeView'
    },
    {
      model_: 'IntProperty',
      name: 'i',
      defaultValue: 0
    },
    {
      model_: 'StringProperty',
      name: 'title',
      defaultValue: 'Example'
    },
    {
      model_: 'foam.core.types.DAOProperty',
      model: 'foam.flow.CodeSnippet',
      name: 'source',
      singular: 'codeSnippet',
      factory: function() {
        return this.EasyDAO.create({
          model: this.CodeSnippet,
          daoType: 'MDAO',
          seqNo: true
        });
      }
    },
    {
      name: 'output',
      type: 'foam.flow.CodeSampleOutput',
      factory: function() {
        return this.CodeSampleOutput.create();
      },
      view: 'foam.flow.CodeSampleOutputView'
    },
    {
      model_: 'StringProperty',
      name: 'actionButtonName',
      defaultValue: 'foam.ui.ActionButton'
    }
  ],

  actions: [
    {
      name: 'run',
      iconUrl: 'https://www.gstatic.com/images/icons/material/system/1x/play_arrow_white_24dp.png',
      action: function() {
        this.outputView.reset();
        this.output.virtualConsole.watchConsole();
        this.output.viewOutput.innerHTML = '';
        var X = this.X.sub();
        this.source.select({
          put: function() {
            // Use arguments array to avoid leaking names into eval context.
            if ( arguments[0].src && arguments[0].src.language ) {
              if ( arguments[0].src.language.toLowerCase() === 'javascript' ) {
                try {
                  eval('(function(X){' +
                      arguments[0].src.code +
                      '}).call(null, X)');
                } catch (e) {
                  this.output.virtualConsole.onError(e.toString());
                }
              } else if ( arguments[0].src.language.toLowerCase() === 'html' ) {
                this.output.viewOutput.innerHTML += arguments[0].src.code;
              }
            }
          }.bind(this),
          error: function(e) {
            this.output.virtualConsole.onError(e.toString());
          }.bind(this)
        })(function() {
          this.output.virtualConsole.resetConsole();
        }.bind(this));
      }
    }
  ],

  templates: [
    function toInnerHTML() {/*
      <heading>
        %%title
      </heading>
      <top-split>
        $$source{ model_: this.SourceCodeListView, rowView: this.CodeSnippetView }
        <actions>
          $$run{
            model_: this.actionButtonName,
            className: 'actionButton playButton',
            color: 'white',
            font: '30px Roboto, Arial',
            alpha: 1.0,
            radius: 18,
            background: '#e51c23'
          }
        </actions>
        <print-only>
          $$source{
            model_: this.SourceCodeListView,
            mode: 'read-only',
            rowView: {
              factory_: 'foam.flow.CodeSnippetView',
              scroll: false,
              codeViewName: 'foam.flow.CodeView'
            }
          }
        </print-only>
      </top-split>
      <bottom-split>
        $$output
      </bottom-split>
    */},
    function CSS() {/*
      code-sample {
        display: block;
        border-radius: inherit;
      }
      code-sample heading {
        border-top-left-radius: inherit;
        border-top-right-radius: inherit;
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
      }
      code-sample.loading {
        display: none;
      }
      code-sample top-split, code-sample bottom-split {
        display: block;
        position: relative;
      }
      code-sample top-split {
        z-index: 10;
      }
      code-sample top-split::after {
        bottom: -4px;
        content: '';
        height: 4px;
        left: 0;
        position: absolute;
        right: 0;
        background-image: -webkit-linear-gradient(top,rgba(0,0,0,.12) 0%,rgba(0,0,0,0) 100%);
        background-image: linear-gradient(to bottom,rgba(0,0,0,.12) 0%,rgba(0,0,0,0) 100%);
      }
      code-sample bottom-split {
        z-index: 5;
      }
      code-sample actions {
        position: absolute;
        right: 30px;
        bottom: -18px;
        z-index: 15;
      }
      code-sample canvas.playButton {
        background: rgba(0,0,0,0);
        box-shadow: 2px 2px 7px #aaa;
        border-radius: 50%;
      }

      @media not print {

        aside code-sample heading {
          font-size: 25px;
          margin: 0px;
          padding: 10px 10px 10px 10px;
          background: #F4B400;
          z-index: 20;
        }

        code-sample print-only {
          display: none;
        }

      }

      @media print {

        code-sample print-only, code-sample print-only sources {
          display: block;
        }

        code-sample heading {
          font-size: 14pt;
          margin: 6pt;
        }

        code-sample top-split {
          margin: 3pt;
        }

        code-sample sources, code-sample actions, code-sample virtual-console {
          display: none;
        }

        code-sample print-only sources {
          display: block;
          font: 14px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
          white-space: pre-wrap;
          margin: 3pt;
          page-break-inside: avoid;
        }

      }
    */}
  ]
});
