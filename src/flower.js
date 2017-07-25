'use strict';
/* eslint no-bitwise: 0 */
/* eslint max-len: 0 */

import {JC} from './jc';

/**
 *
 * @param {Object} options
 */
function Flower(options) {
  JC.Sprite.call(this, options);
  this.alive = false;
  if (this.texture.loaded) {
    this._center();
  } else {
    this.texture.on('load', () => {
      this._center();
    });
  }
}

Flower.prototype = Object.create(JC.Sprite.prototype);

Flower.prototype.randomInArea = function({x, y, width, height}) {
  return new JC.Point(JC.Utils.random(x, x + width), JC.Utils.random(y, y + height));
};

Flower.prototype._center = function() {
  this.pivotX = this.width >> 1;
  this.pivotY = this.height >> 1;
};

Flower.prototype.fall = function(options) {
  const This = this;
  this.alive = true;
  this.visible = true;
  this.alpha = 0;

  const p0 = this.randomInArea(options.begin);
  const p3 = this.randomInArea(options.end);
  p3.x = JC.Utils.random(p0.x - 150, p0.x + 150);

  const v = new JC.Point().subVectors(p3, p0);

  const p1 = p0.clone().add(v.clone().multiplyScalar(1 / 3));
  const p2 = p0.clone().add(v.clone().multiplyScalar(2 / 3));

  p1.x = JC.Utils.random(p1.x - 120, p1.x + 120);
  p2.x = JC.Utils.random(p2.x - 120, p2.x + 120);

  const time = options.time;
  const duration = JC.Utils.random(time / 2, time);
  const wait = JC.Utils.random(0, 300);
  this.runners({
    runners: [
      {
        from: {scale: 0.3, alpha: 0},
        to: {scale: JC.Utils.random(0.8, 1.4), alpha: 1},
        duration: duration * 0.05,
        ease: JC.Tween.Ease.In,
      },
      {
        to: {scale: JC.Utils.random(0.9, 1)},
        duration: duration * 0.9,
      },
      {
        to: {scale: 0.3, alpha: 0},
        duration: duration * 0.05,
        ease: JC.Tween.Ease.Out,
      },
    ],
    wait,
  })
  .on('compelete', function() {
    This.visible = false;
    This.alive = false;
  });
  this.motion({
    path: new JC.BezierCurve([p0, p1, p2, p3]),
    duration,
    wait,
    ease: JC.Tween.Ease.In,
  });
};

export {Flower};
