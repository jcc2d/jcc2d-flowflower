/* eslint guard-for-in: 0 */

import {Utils} from './utils';
import {Flower} from './flower';
import {JC} from './jc';

const STORE = {
  aliveFlowers: {},
  idelFlowers: {},
};

/**
 *
 * @param {Object} options
 */
function Flowers(options) {
  this.assetsMap = options.assetsMap;
  this.doc = new JC.Container();
  this.defaultBegin = options.begin;
  this.defaultEnd = options.end;
}

Flowers.prototype._checkAlive = function(alive, idel) {
  for (const type in alive) {
    const alivePool = alive[type] || [];
    const idelPool = idel[type] || [];
    let i = alivePool.length - 1;
    while (i >= 0) {
      const flower = alivePool[i];
      if (!flower.alive) {
        idelPool.push(alivePool.splice(i, 1)[0]);
      }
      i--;
    }
  }
};

Flowers.prototype._getFlowers = function(flowers, flux) {
  const ffs = {};
  while (flux-- >= 0) {
    const type = JC.Utils.random(flowers);
    ffs[type] = ffs[type] || 0;
    ffs[type]++;
  }
  return ffs;
};

Flowers.prototype._shipFlowers = function(options) {
  this._checkAlive(STORE.aliveFlowers, STORE.idelFlowers);
  const flowerSeed = this._getFlowers(options.flowers, options.flux);
  const flowerGerm = {};
  for (const type in flowerSeed) {
    const texture = this.assetsMap.getById(type);
    const ffs = flowerSeed[type];
    const idels = STORE.idelFlowers[type] || [];
    const num = ffs - idels.length;
    if (num > 0) {
      for (let i = 0; i < num; i++) {
        const f = new Flower({
          texture,
        });
        this.doc.adds(f);
        idels.push(f);
      }
    }
    flowerGerm[type] = idels.splice(0, ffs);
  }
  return flowerGerm;
};

Flowers.prototype.falling = function(options) {
  const begin = Utils.merge(this.defaultBegin, options.begin);
  const end = Utils.merge(this.defaultEnd, options.end);
  const time = options.time;
  const flowerGerm = this._shipFlowers(options);
  for (const type in flowerGerm) {
    const ft = flowerGerm[type];
    for (let i = 0; i < ft.length; i++) {
      const flower = ft[i];
      flower.fall({
        begin,
        end,
        time,
      });
    }
  }
};

export {Flowers};
