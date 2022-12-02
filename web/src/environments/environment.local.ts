/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --configuration=test ` replaces `environment.ts` with
// `environment.test.ts`.
// The list of file replacements can be found in `angular.json`.

import { Env } from './environment-enums';

export const environment = {
  production: false,
  googleMapsApiKey: '',
  firebase: {
    projectId: 'demo-project',
    apiKey: 'fake-api-key'
  },
  cloudFunctionsUrl: '',
  offlineBaseMapSources: [{ url: '' }],
  useEmulators: true,
  env: Env.Local,
};
