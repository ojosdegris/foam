/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
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

CLASS({
  name: 'Todo',
  package: 'foam.navigator',
  extendsModel: 'foam.navigator.FOAMlet',

  properties: [
    {
      model_: 'StringProperty',
      name: 'name',
      required: true
    },
    {
      model_: 'IntProperty',
      name: 'priority',
      defaultValue: 3,
      view: {
        factory_: 'ChoiceListView',
        choices: [1, 2, 3, 4, 5]
      }
    },
    {
      type: 'Date',
      name: 'dueDate',
      defaultValue: null
    },
    {
      model_: 'StringProperty',
      name: 'notes',
      view: 'TextAreaView'
    }
  ]
});
