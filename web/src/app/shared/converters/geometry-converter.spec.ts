/**
 * Copyright 2022 Google LLC
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

import '../../../testing/helpers';
import firebase from 'firebase/app';
import { List } from 'immutable';
import { Coordinate } from '../models/geometry/coordinate';
import { MultiPolygon } from '../models/geometry/multi-polygon';
import { Polygon } from '../models/geometry/polygon';
import { LinearRing } from './../models/geometry/linear-ring';
import { Point } from './../models/geometry/point';
import { toGeometry } from './geometry-converter';

import GeoPoint = firebase.firestore.GeoPoint;

type Path = Array<[number, number]>;

const x = -42.121;
const y = 28.482;
const path1: Path = [
  [-89.63410225, 41.89729784],
  [-89.63805046, 41.8952534],
  [-89.63659134, 41.8893753],
  [-89.62886658, 41.88956698],
  [-89.62800827, 41.89544507],
  [-89.63410225, 41.89729784],
];
const path2: Path = [
  [-89.63453141, 41.89193106],
  [-89.631184, 41.89090878],
  [-89.63066902, 41.8939756],
  [-89.63358726, 41.89480618],
  [-89.63453141, 41.89193106],
];
const path3: Path = [
  [-89.61006966, 41.89333669],
  [-89.61479034, 41.89832003],
  [-89.6171936, 41.89455062],
  [-89.6152195, 41.89154771],
  [-89.61006966, 41.89333669],
];
const path4: Path = [
  [-89.61393204, 41.89320891],
  [-89.61290207, 41.89429505],
  [-89.61418953, 41.89538118],
  [-89.61513367, 41.89416727],
  [-89.61393204, 41.89320891],
];

function point(x: number, y: number): Point {
  return new Point(new Coordinate(x, y));
}

function linearRing(path: Path): LinearRing {
  return new LinearRing(coordinateList(path));
}

function polygon(shell: Path, ...holes: Array<Path>): Polygon {
  return new Polygon(linearRing(shell), List(holes.map(h => linearRing(h))));
}

function multiPolygon(...polygons: Array<Polygon>): MultiPolygon {
  return new MultiPolygon(List(polygons));
}

function coordinateList(path: Path): List<Coordinate> {
  return List(path.map(it => new Coordinate(it[0], it[1])));
}

function indexedGeoPointMap(path: Path): {} {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map: { [key: string]: any } = {};
  path.forEach((it, idx) => (map[String(idx)] = new GeoPoint(it[0], it[1])));
  return map;
}

describe('geometry-converter.ts', () => {
  it('Convert map to Point', () =>
    expect(
      toGeometry({
        type: 'Point',
        coordinates: new GeoPoint(x, y),
      })
    ).toEqual(point(x, y)));

  it('Convert map to Polygon', () =>
    expect(
      toGeometry({
        type: 'Polygon',
        coordinates: {
          '0': indexedGeoPointMap(path1),
          '1': indexedGeoPointMap(path2),
        },
      })
    ).toEqual(polygon(path1, path2)));

  it('Convert map to MultiPolygon', () =>
    expect(
      toGeometry({
        type: 'MultiPolygon',
        coordinates: {
          '0': {
            '0': indexedGeoPointMap(path1),
            '1': indexedGeoPointMap(path2),
          },
          '1': {
            '0': indexedGeoPointMap(path3),
            '1': indexedGeoPointMap(path4),
          },
        },
      })
    ).toEqual(multiPolygon(polygon(path1, path2), polygon(path3, path4))));
});
