# userAgent
一个用于解析UA来得到用户终端信息的JS库，详情可见[线上demo](http://fex.baidu.com/userAgent/)

## 下载

```bash
git clone http://gitlab.baidu.com/fex/dp.git
```

## 文件结构

```
├─ node_modules
├──── useragent.js
├──── useragent_base.js
└─ test.js
```
## 简单测试

```bash
cd userAgent
node test.js
```

## 调用方式

```javascript
var UA = require("useragent");
var test_ua_str = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 5_1_1 like Mac OS X; en) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3';

var result = new UA(test_ua_str);
```

通过这种方式即可完成对UA数据的解析。
可得到以下有用信息:

```javascript
{
    browser: {  //浏览器信息
        name: 'Chrome',
        version: {
            original: '19.0.1084.60',
        }
    },
    engine: {   //浏览器内核
        name: 'Webkit',
        version: {
            original: '534.46.0',
        }
    },
    os: {       //操作系统
        name: 'iOS',
        version: {
            original: '5.1.1',
        }
    },
    device: {   //硬件信息
        type: 'mobile',
        manufacturer: 'Apple',
        model: 'IPHONE'
    }
}
```
