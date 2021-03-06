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
  "model_": "Model",
  "name": "User",
  "package": "foam.apps.quickbug.model.imported",
  "tableProperties": [
    "id",
    "kind",
    "projects"
  ],
  "properties": [
    {
      "model_": "StringProperty",
      "name": "id",
      "help": "User identifier."
    },
    {
      "model_": "StringProperty",
      "name": "kind",
      "help": "User on Google Code Project Hosting."
    },
    {
      "model_": "ArrayProperty",
      "name": "projects",
      "help": "Projects of which this user is a member.",
      "subType": "Project"
    }
  ]
});
