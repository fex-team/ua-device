# ua-device [![Build Status](https://travis-ci.org/fex-team/ua-device.svg?branch=master)](https://travis-ci.org/fex-team/ua-device)
一个用于解析UA来得到用户终端信息的JS库，详情可见[线上demo](http://fex.baidu.com/ua-device/)

## 下载
```bash
npm install ua-device
```

## Why ua-device ？
由于在国内生产PC的厂家有限，大众用户使用的浏览器也主要是当前的一些主流浏览器。因此目前的UA解析库在对OS、浏览器外壳、浏览器内核等的识别率都相当高。**但是由于国内的移动设备的五花八门，对于移动设备的硬件信息是很难用一套通用的方法进行识别，因此 ua-device 诞生**

1. **通过机型识别品牌**: 例如 `[-\s](Galaxy[\s-_]nexus|Galaxy[\s-_]\w*[\s-_]\w*|Galaxy[\s-_]\w*|SM-\w*|GT-\w*|s[cgp]h-\w*|shw-\w*` 这样的匹配规则以及一些从[中关村在线](http://detail.zol.com.cn/cell_phone_index/subcate57_list_1.html)爬取到的机型名称如`G3508`、`G3508J`、`G3508i` 等识别出来该机型的品牌为`Samsung` 因为单纯从UA信息确实无法得到品牌数据，这也是为何很多高Star的UA解析库识别手机品牌成功率只有30%-40%的原因(`ua-device`识别率可见下面测试用例)。
2. **解决国内UA信息不规范**: 由于国内很多手机生产厂家的设计问题，例如小米可供识别的UA数据可能为 `mi 2` 、`mi2`、`m2`、`mi-2LTE`、`MI-20150XX`、`minote`等等，如果匹配规则限制太紧就会导致数据无法命中，如果匹配规则太松又会让其它山寨机型滥竽充数，所以需要一套比较特殊的处理流程。
3. **解决国内因不同发版而造成的UA数据不一致**: 例如很多机型会因同电信、移动、联通而UA信息不同，但实际应该把他们算成同一款手机
4. **解决机型的重命名与合并**: 很多手机在不同时间生产其UA信息可能不同，所以需要对他们进行合并，防止在展示top数据时因数据分散而排不上号。

## 目录结构
```
ua-device/
├── LICENSE
├── README.md
├── index.js
├── lib
│   ├── ua-device.js
│   └── useragent-base.js
├── package.json
└── test
    ├── index.js
    ├── test_input
    └── treemap.js
```

## 测试

```bash
npm test

# you can get the test result like this:
#  ua-device测试数据共3292条
#   ✓ browser_name识别成功共 3234 条，成功率为 98.24%
#   ✓ browser_version识别成功共 2575 条，成功率为 78.22%
#   ✓ engine_name识别成功共 3282 条，成功率为 99.70%
#   ✓ engine_version识别成功共 3279 条，成功率为 99.61%
#   ✓ os_name识别成功共 3291 条，成功率为 99.97%
#   ✓ os_version识别成功共 3289 条，成功率为 99.91%
#   ✓ device_manufacturer识别成功共 2887 条，成功率为 87.70%
#   ✓ device_model识别成功共 3283 条，成功率为 99.73%
```
有兴趣的同学可以将`ua-device`与其它高star库进行对比，相信对比后无论在识别成功率还是识别内容的准确性上，你都会选择`ua-device`。


## 调用方式

```javascript
var UA = require('ua-device');
var input = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 5_1_1 like Mac OS X; en) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3';

var output = new UA(input);
console.log(output);

// you can get a json like this:
// {
//     browser: {  //浏览器信息
//         name: 'Chrome',
//         version: {
//             original: '19.0.1084.60',
//         }
//     },
//     engine: {   //浏览器内核
//         name: 'Webkit',
//         version: {
//             original: '534.46.0',
//         }
//     },
//     os: {       //操作系统
//         name: 'iOS',
//         version: {
//             original: '5.1.1',
//         }
//     },
//     device: {   //硬件信息
//         type: 'mobile',
//         manufacturer: 'Apple',
//         model: 'IPHONE'
//     }
// }
```
