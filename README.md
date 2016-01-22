# Imageupload
使用File API+canvas 客户端压缩图片，并实现文件上传服务端

文件依赖 JQUERY

## 参数API 

* loading:'.loading',           页面显示loading的图标selector
* url:'',                       接收数据的api接口地址
* maxFileSize:10*1024*1024,     服务端支持的最大单文件大小
* format:/^image/i,             支持的文件格式. images text .....
* isCompress:true,              如果是图片，可以开启客户端压缩，减少传输的数据文件
* compressNum:0.6,              图片的压缩率，0~1 设置为1可能最终结果比未压缩还大，请慎用1.
* beforeUpload:function(){},    上传之前的处理，返回false可以阻止文件的上传
* uploadStart: function(){},    开始上传的回调
* afterUpload: function(){},    上传结束的回调
* uploadProgress: function(v){} 上传的进度条
* uploadError: function(){}     上传错误的回调
* showThumbnail:function(){}    显示缩略图




使用范例：
```HTML
<div id="proccess"></div>
压缩前：<div id="rrr1"></div>
<br>
<input type="file" multiple  id="filesss" >
<br> 压缩后：<div id="rrr2"></div>
<br>
```
```javascript
$('#filesss').mobileUpload({
        url: '',
        beforeUpload: function () {
            console.log('beforeUpload')
        },
        uploadStart: function (file) {
            console.log('uploadStart')
            console.log('原文件大小：' + file.length);
        },
        uploadProgress: function (v) {console.log('进度' + v)},
        uploadError: function () {console.log('uploadError')},
        showThumbnail: function (file) {

            $('#rrr1').append('<img src="' + file + '">');
        },
        afterUpload: function (file, data) {
            console.log('压缩后大小：' + file.length);
            $('#rrr2').append('<img src="' + file + '">');
        }
    });
```
