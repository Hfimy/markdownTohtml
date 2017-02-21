# Node服务器端开发第四天

> 文件流、网络操作、服务端Web开发基础


## 文件操作


### 文件监视

#### 利用文件监视实现自动 markdown 文件转换


- 相关链接：

  1. https://github.com/chjj/marked
  2. https://github.com/Browsersync/browser-sync 


- 实现思路：
  1. 利用`fs`模块的文件监视功能监视指定MD文件
  2. 当文件发生变化后，借助`marked`包提供的`markdown` to `html`功能将改变后的MD文件转换为HTML
  3. 再将得到的HTML替换到模版中
  4. 最后利用BrowserSync模块实现浏览器自动刷新
    browsersync需要用到Python
  
```javascript
const fs = require('fs');
const path = require('path');
var marked = require('marked');
var bs = require('browser-sync').create();






var target = path.join(__dirname, process.argv[2] || './README.md');
var filename = path.basename(target, path.extname(target)) + '.html';
var targetHtml = path.join(path.dirname(target), filename);

bs.init({
  server: path.dirname(target),
  index: filename,
  notify: false
});

bs.reload(filename);

var template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
  <style>{{{styles}}}</style>
</head>
<body>
  <article class="markdown">
    {{{body}}}
  </article>
</body>
</html>
`;

fs.readFile(path.join(__dirname, './markdown.css'), 'utf8', (error, css) => {
  if (error) throw error;
  template = template.replace('{{{styles}}}', css);
  var handler = (current, previous) => {
    fs.readFile(target, 'utf8', (error, content) => {
      var html = template.replace('{{{body}}}', marked(content));
      fs.writeFile(targetHtml, html, (error) => {
        if (!error) {
          console.log(`updated@${new Date()}`);
          bs.reload(filename);
        }
      });
    });
  };
  handler();
  fs.watchFile(target, { interval: 100 }, handler);
});
```


*****

## 文件流


### 什么是流

![二进制的世界](./img/01.png)


- 现实过程的流
  + 水流，人流
  
- 在程序开发的概念中
  + 流是程序输入或输出的一个连续的字节序列
  + 文件流、网络流
  + 设备(例如鼠标、键盘、磁盘、屏幕、调制解调器和打印机)的输入和输出都是用流来处理的。
 

### Node中的流操作

![流的操作](./img/02.png)

在 Node 核心模块 fs 中定义了一些与流相关的 API

- fs.createReadStream()
  + => 得到一个ReadableStream
- fs.createWriteStream()
  + => 得到一个WritableStream

### 读取流常用 API

#### Event：

- data
- end
- error

#### Method：

- read([size])、
- pause()、
- isPause()、
- resume()、
- setEncoding(encoding)、
- pipe(destination[, options])、
- unpipe([destination])

### 写入流常用 API

#### Event:

- error
- pipe

#### Method：

- write(chunk[, encoding][, callback])
- end([chunk][, encoding][, callback])
- setDefaultEncoding(encoding)























*****

## 网络操作



如何计算循环节长度呢？

想想我们手算，如果余数比除数小，我们会在后面补0然后再除。也就是说补零之后的数是下一次的被除数。如果被除数重复出现，除数确定的，那么商和余数也就是一样的。这时，循环节就出现了。

下面的函数分为两部分，

补零操作
查找有没有同样的被除数存在，如果有，就找到了循环节，计算循环节长度并返回。在没有找到的前提下，把当前被除数记录下来，并得到余数作为下一次的被除数。 
这里需要注意，如果某一次出现了除尽的情况，说明该分数是有限小数，循环节长度是0。
JavaScript

console.log(foo(11, 3));  
console.log(foo(1, 7));;  
console.log(foo(2, 10));;  
function foo(a, b) {  
  if (!(a % b)) {
    return `${a}÷${b}:${a / b}`;
  }
  var all = (a / b).toString().split('.');
  var i = getCycleSection(a, b);
  if(i)
    return `${a}÷${b}: ${all[0]}.{${all[1].substr(0, i) }}`;
    return `${a}÷${b}: ${a / b}`;

}
function getCycleSection(n, m) {  
  var temp = [];
  while (true) {
    while (n < m) {
      n *= 10;
    }
    var index = temp.indexOf(n);
    if (index >= 0) {
      return temp.length - index;
    }
    temp.push(n);
    n %= m;
    if (!n)
      return 0;
  }
}
