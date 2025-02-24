/**
 * Copyright 2019 The Ground Authors.
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

import {List, Map} from 'immutable';

import {Copiable} from './copiable';
import {Task} from './task/task.model';

export enum DataCollectionStrategy {
  PREDEFINED = 'PREDEFINED',
  AD_HOC = 'AD_HOC',
  MIXED = 'MIXED',
}

export class Job extends Copiable {
  constructor(
    readonly id: string,
    readonly index: number,
    readonly color?: string,
    readonly name?: string,
    readonly tasks?: Map<string, Task>,
    readonly dataCollectorsCanAdd?: string[],
    readonly strategy?: DataCollectionStrategy
  ) {
    super();

    if (!strategy) this.strategy = DataCollectionStrategy.PREDEFINED;
  }

  getTasksSorted(): List<Task> {
    return this.tasks?.sortBy(task => task.index).toList() || List();
  }
}
