exports.install = function (Vue, options) {
	    Vue.prototype.uploadImg = function (el,options) {
        var opt = {
                url: '', //接收数据的api接口地址
                maxFileSize: 5 * 1024 * 1024,
                format: 'image',
                isCompress: true,
                compressNum: 0.6, // 0~1 设置为1可能最终结果比未压缩还大，请慎用1.
                beforeUpload: function () {
                },
                uploadStart: function () {
                },
                afterUpload: function () {
                },
                uploadProgress: function (v) {
                },
                uploadError: function () {
                },
                showThumbnail: function () {
                }
            };

        for (name in options) {
            opt[name] = options[name];
        }

        function startUpload(el) {
            var files = el.files,
                len = files.length;
            for (var i = len - 1; i >= 0; i--) {
                (function (file) {
                    if (file.size > opt.maxFileSize) {
                        console.log('您上传的' + file.name + ',图片尺寸过大，最大限制为10M');
                        opt.uploadError && opt.uploadError()
                        return false;
                    }
                    //有些安卓手机无法获取文件类型
                    if (new RegExp(opt.format, 'i').test(file.type) || !file.type) {
                        if (opt.beforeUpload() === false) {
                            return false;
                        }
                        readFile(file);
                    } else {
                        console.log("您上传的文件不符合上传的要求");
                    }
                }(files[i]));
            }
        }

        function readFile(file) {
            var reader = new FileReader();
            reader.onload = function () {
                file = this.result;
                opt.uploadStart && opt.uploadStart(file);
                upLoadFile(file);
                // this.result = null;
                reader.onload = null;
                reader = null;
            };
            reader.onprogress = function (e) {
                if (e.lengthComputable) {
                    var percentLoaded = Math.round((e.loaded / e.total) * 100);
                    opt.uploadProgress && opt.uploadProgress(percentLoaded);
                }
            };
            reader.onabort = function () {
                opt.uploadError && opt.uploadError();
            }
            if (opt.format = 'image') {
                reader.readAsDataURL(file);
            } else {
                reader.readAsBinaryString(file);
                opt.isCompress = false;
            }
        }

        function upLoadFile(file) {
            if (opt.format != 'image') {
                ajaxUploadFile(file);
            } else {
                var _canvas=document.createElement('canvas'),
                    img = new Image();
                _canvas.style='display: none';
                img.onload = function () {
                    if (opt.isCompress) {
                        _canvas.width = img.naturalWidth;
                        _canvas.height = img.naturalHeight;
                        var context = _canvas.getContext('2d');
                        context.drawImage(img, 0, 0);
                        ajaxUploadFile(_canvas.toDataURL('image/jpeg', opt.compressNum));
                    } else {
                        ajaxUploadFile(file);
                    }
                };
                img.src = file;
            }
        }

        function ajaxUploadFile(file) {
            opt.showThumbnail && opt.showThumbnail(file);
            vm.http.post({
                url: opt.url,
                data: {
                    file: file
                },
            }).then((rsts)=>{
                opt.afterUpload && opt.afterUpload(file, rsts);
            }).catch((d)=>{
                opt.uploadError && opt.uploadError(d);
            })
        }
        startUpload(el);
    }
};
