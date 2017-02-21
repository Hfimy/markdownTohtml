
const fs = require('fs');
const path = require('path');
const marked = require('marked');
const browserSync = require('browser-sync');

//接收需要转换的文件路径
const target = path.join(__dirname, process.argv[2] || 'README.md')

//最终生成的html文件的位置
const filename = target.replace(path.extname(target), '.html')

//获取html文件名
const indexpath = path.basename(filename);

//通过browser-sync创建一个文件服务器
browserSync({
    notify: false,
    server: path.dirname(target),//网站根目录
    index: indexpath//默认文档
})

//监视文件变化，可以理解为当文件发生变化（需要保存才能触发文件变化)，interval时间间隔后调用回调函数
fs.watchFile(target, { interval: 200 }, (cur, prev) => {
    // console.log(`current:${cur.size} previous:${prev.size}`);

    //判断文件的最后修改时间是否改变，减少不必要的转换
    if (cur.mtime === prev.mtime) {
        return false;
    }

    fs.readFile(target, 'utf8', (err, content) => {
        if (err) {
            throw err;
        }
        let html = marked(content);
        // console.log(html);
        fs.readFile(path.join(__dirname, 'github.css'), 'utf8', (err, css) => {
            html = template.replace('{{{content}}}', html).replace('{{{styles}}}', css);
            // console.log(html);
            fs.writeFile(filename, html, (err) => {
                if (err) {
                    throw err;
                }
                browserSync.reload(indexpath);
                console.log('updated@' + new Date());
            })
        })
    })
})
const template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Markdown to Html</title>
    <style>{{{styles}}}</style>
</head>
<body>
    <div class='vs'>
    {{{content}}}
    </div>
</body>
</html>`;