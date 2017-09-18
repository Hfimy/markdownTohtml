
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
  
  
```
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
