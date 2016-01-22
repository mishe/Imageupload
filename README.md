# Imageupload
使用File API+canvas 客户端压缩图片，并实现文件上传服务端

文件依赖 JQUERY




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
        url:'',
        beforeUpload:function(){
            console.log('beforeUpload')},
        uploadStart: function(){console.log('uploadStart')},
        uploadProgress: function(v){console.log('进度'+v)},
        uploadError: function(){console.log('uploadError')},
        showThumbnail:function(file){
            console.log('原图大小：'+file.length);
            $('#rrr1').append('<img src="'+file+'">');
        },
        afterUpload:function(file,data){
            console.log('压缩后大小：'+file.length);
            $('#rrr2').append('<img src="'+file+'">');
        }
    });
```
