
import {Utils} from './utils';
import {Flowers} from './flowers';
import {JC} from './jc';

const STAGE_OPTION = {
  dom: 'flowflower-stage',
  interactive: false,
  enableFPS: false,
  width: 320,
  height: 320,
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

Flowflower.prototype.init = function() {
  this.stage = new JC.Stage(this.stageOpts);
  this.flowers = new Flowers(this.flowersOpts);
  this.stage.adds(this.flowers.doc);
};

Flowflower.prototype.fallFlowers = function(options, cb) {
  options.time = options.time || 3200;
  this.flowers.falling(options);
  cb && setTimeout(cb, options.time);
};

Flowflower.prototype.start = function() {
  this.stage.startEngine();
};

Flowflower.prototype.stop = function() {
  this.stage.stopEngine();
};

export {Flowflower};
