# Flowflower · 表情风暴组件

批量让物体自然掉落，每个`sprite`会被缓存优化

### 用法

使用非常简单。

```js
var flowers = {
  assets: {
    great: './images/emoji/great.png',
    heart: './images/emoji/heart.png',
    kiss: './images/emoji/kiss.png',
    smile: './images/emoji/smile.png',
    star: './images/emoji/star.png',
  },
  begin: {
    x: 0,
    y: -160,
    width: 640,
    height: 200
  },
  end: {
    x: 0,
    y: 780,
    width: 640,
    height: 20
  },
};
var w = 800;
var h = 900;
var flyflower = new JC.Flowflower({
  stage: {
    dom: 'flyflower-stage',
    width: w,
    height: h,
  },
  flowers: flowers,
});
flyflower.start();
document.onclick = function() {
  flyflower.fallFlowers({
    flowers: [ 'great', 'heart', 'kiss', 'smile', 'star' ],
    flux: 20,
  });
}
```

## 完整配置

#### `Flowflower`组件配置

| 属性                  | 值类型                       | 描述                                        |
| -------------------- | --------------------------- | ---------------------------------------- |
| `stage`              | `required` : `object`类型    | 场景的配置                                     |
| `stage.dom`          | `required` : `string`类型    | 传递给`canvas`标签的样式                        |
| `[stage.width]`      | `optional` : `number`类型    | `canvas`的画板宽，默认 320px                    |
| `[stage.height]`     | `optional` : `number`类型    | `canvas`的画板高，默认 320px                    |
| `[stage.resolution]` | `optional` : `number`类型    | `canvas`的分辨率，默认 1                        |
| `flowers`            | `required` : `object`类型    | 掉落物体的资源配置和位置配置                      |
| `flowers.assets`     | `required` : `number`类型    | 掉落物体的资源图片                              |
| `flowers.begin`      | `required` : `number`类型    | 掉落物体的起始位置                              |
| `flowers.end`        | `required` : `number`类型    | 掉落物体的结束位置                              |

#### 方法调用

```javascript
flyflower({
  flowers: [ 'great', 'heart', 'kiss', 'smile', 'star' ],
  flux: 20,
  begin: { x, y, ... }, // 可选配置 起始区域，会覆盖实例化时的该配置
  end: { x, y, ... }, // 可选配置 结束区域，会覆盖实例化时的该配置
});
```
