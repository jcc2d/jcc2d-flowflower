(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.JC = global.JC || {})));
}(this, (function (exports) { 'use strict';

var inModule = typeof require === 'function';
var inBrowser = typeof window !== 'undefined';
var JC = inModule && inBrowser ? require('jcc2d/build/jcc2d.light.js') : inBrowser ? window.JC : {};

/* eslint no-bitwise: 0 */
/* eslint max-len: 0 */

/**
 *
 * @param {Object} options
 */
function Flower(options) {
  var _this = this;

  JC.Sprite.call(this, options);
  this.alive = false;
  if (this.texture.loaded) {
    this._center();
  } else {
    this.texture.on('load', function () {
      _this._center();
    });
  }
}

Flower.prototype = Object.create(JC.Sprite.prototype);

Flower.prototype.randomInArea = function (_ref) {
  var x = _ref.x,
      y = _ref.y,
      width = _ref.width,
      height = _ref.height;

  return new JC.Point(JC.Utils.random(x, x + width), JC.Utils.random(y, y + height));
};

Flower.prototype._center = function () {
  this.pivotX = this.width >> 1;
  this.pivotY = this.height >> 1;
};

Flower.prototype.fall = function (options) {
  var This = this;
  this.alive = true;
  this.visible = true;
  this.alpha = 0;

  var p0 = this.randomInArea(options.begin);
  var p3 = this.randomInArea(options.end);
  p3.x = JC.Utils.random(p0.x - 150, p0.x + 150);

  var v = new JC.Point().subVectors(p3, p0);

  var p1 = p0.clone().add(v.clone().multiplyScalar(1 / 3));
  var p2 = p0.clone().add(v.clone().multiplyScalar(2 / 3));

  p1.x = JC.Utils.random(p1.x - 120, p1.x + 120);
  p2.x = JC.Utils.random(p2.x - 120, p2.x + 120);

  var time = options.time;
  var duration = JC.Utils.random(time / 2, time);
  var wait = JC.Utils.random(0, 300);
  this.runners({
    runners: [{
      from: { scale: 0.3, alpha: 0 },
      to: { scale: JC.Utils.random(0.8, 1.4), alpha: 1 },
      duration: duration * 0.05,
      ease: JC.Tween.Ease.In
    }, {
      to: { scale: JC.Utils.random(0.9, 1) },
      duration: duration * 0.9
    }, {
      to: { scale: 0.3, alpha: 0 },
      duration: duration * 0.05,
      ease: JC.Tween.Ease.Out
    }],
    wait: wait
  }).on('compelete', function () {
    This.visible = false;
    This.alive = false;
  });
  this.motion({
    path: new JC.BezierCurve([p0, p1, p2, p3]),
    duration: duration,
    wait: wait,
    ease: JC.Tween.Ease.In
  });
};

/**
 * Utils 工具箱
 *
 * @namespace JC.Utils
 */
var Utils = {
  merge: function merge(master, branch) {
    if (!branch) return master;
    for (var key in branch) {
      if (branch[key] !== undefined) {
        master[key] = branch[key];
      }
    }
    return master;
  }
};

/* eslint guard-for-in: 0 */

var STORE = {
  aliveFlowers: {},
  idelFlowers: {}
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

Flowers.prototype._checkAlive = function (alive, idel) {
  for (var type in alive) {
    var alivePool = alive[type] || [];
    var idelPool = idel[type] || [];
    var i = alivePool.length - 1;
    while (i >= 0) {
      var flower = alivePool[i];
      if (!flower.alive) {
        idelPool.push(alivePool.splice(i, 1)[0]);
      }
      i--;
    }
  }
};

Flowers.prototype._getFlowers = function (flowers, flux) {
  var ffs = {};
  while (flux-- >= 0) {
    var type = JC.Utils.random(flowers);
    ffs[type] = ffs[type] || 0;
    ffs[type]++;
  }
  return ffs;
};

Flowers.prototype._shipFlowers = function (options) {
  this._checkAlive(STORE.aliveFlowers, STORE.idelFlowers);
  var flowerSeed = this._getFlowers(options.flowers, options.flux);
  var flowerGerm = {};
  for (var type in flowerSeed) {
    var texture = this.assetsMap.getById(type);
    var ffs = flowerSeed[type];
    var idels = STORE.idelFlowers[type] || [];
    var num = ffs - idels.length;
    if (num > 0) {
      for (var i = 0; i < num; i++) {
        var f = new Flower({
          texture: texture
        });
        this.doc.adds(f);
        idels.push(f);
      }
    }
    flowerGerm[type] = idels.splice(0, ffs);
  }
  return flowerGerm;
};

Flowers.prototype.falling = function (options) {
  var begin = Utils.merge(this.defaultBegin, options.begin);
  var end = Utils.merge(this.defaultEnd, options.end);
  var time = options.time;
  var flowerGerm = this._shipFlowers(options);
  for (var type in flowerGerm) {
    var ft = flowerGerm[type];
    for (var i = 0; i < ft.length; i++) {
      var flower = ft[i];
      flower.fall({
        begin: begin,
        end: end,
        time: time
      });
    }
  }
};

var STAGE_OPTION = {
  dom: 'flowflower-stage',
  interactive: false,
  enableFPS: false,
  width: 320,
  height: 320
};

/**
 *
 * @param {Object} options
 */
function Flowflower(options) {
  this.stageOpts = Utils.merge(STAGE_OPTION, options.stage);
  this.flowersOpts = options.flowers;
  this.flowersOpts.assetsMap = JC.loaderUtil(this.flowersOpts.assets);
  this.init();
}

Flowflower.prototype.init = function () {
  this.stage = new JC.Stage(this.stageOpts);
  this.flowers = new Flowers(this.flowersOpts);
  this.stage.adds(this.flowers.doc);
};

Flowflower.prototype.fallFlowers = function (options, cb) {
  options.time = options.time || 3200;
  this.flowers.falling(options);
  cb && setTimeout(cb, options.time);
};

Flowflower.prototype.start = function () {
  this.stage.startEngine();
};

Flowflower.prototype.stop = function () {
  this.stage.stopEngine();
};

exports.JC = JC;
exports.Flowflower = Flowflower;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
