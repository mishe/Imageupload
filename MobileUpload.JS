module.exports = function (options) {
    var _defaultSetting = {
            loading: '.loading',
            // url: 'http://192.168.62.244:8080/app/webservice/v2/loveractivity/upload', //接收数据的api接口地址
            url: '/app/webservice/v2/loveractivity/upload', //接收数据的api接口地址
            // url: '', //接收数据的api接口地址
            maxFileSize: 500 * 1024,
            format: 'image',
            isCompress: true,
            bindUser:false, //上传图片绑定用户
            clipSquare:false, //压缩上传前把图片截取成正方形，
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
        },
        opt = {};

    function startUpload(el) {
        var files = el.files,
            len = files.length;
        for (var i = len - 1; i >= 0; i--) {
            (function (file) {
                // if (file.size > opt.maxFileSize) {
                //     console.log('您上传的' + file.name + ',图片尺寸过大，最大限制为500K');
                //     $.toast('您上传的文件尺寸过大，最大限制为500K');
                //     return false;
                // }
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
            // alert('name: '+file.name+';size: '+file.size+';type: '+file.type);
            // alert('Base64 length ==== ' + this.result.length);
            // alert('Base64 100 ==== ' + this.result.substr(0,100));
            // alert(this.result)
            file = this.result;
            opt.uploadStart && opt.uploadStart(file);
            upLoadFile(file);
            this.result = null;
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
            var _canvas = $('<canvas style="display: none"></canvas>')[0];
            var img = new Image();
            var exif,imgRotation=0;

            img.onload = function () {

                var orientation = exif ? exif.Orientation : 1;
                // 判断拍照设备持有方向调整照片角度
                switch(orientation) {
                    case 3:
                        imgRotation = 180;
                        break;
                    case 6:
                        imgRotation = 90;
                        break;
                    case 8:
                        imgRotation = 270;
                        break;
                }

                if (opt.isCompress) {
                    if (opt.clipSquare) {
                        var min = Math.min(img.naturalWidth, img.naturalHeight);
                        _canvas.width = min;
                        _canvas.height = min;
                    } else {
                        _canvas.width = img.naturalWidth;
                        _canvas.height = img.naturalHeight;
                    }

                    var context = _canvas.getContext('2d');
                    context.drawImage(img, 0, 0);
                    ajaxUploadFile(_canvas.toDataURL('image/jpeg', opt.compressNum),imgRotation);
                } else {
                    ajaxUploadFile(file,imgRotation);
                }
            };

            // 转换二进制数据
            var binaryData = new BinaryFile(atob(file.replace(/^.*?,/,'')));

            // 获取exif信息
            exif = EXIF.readFromBinaryFile(binaryData);

            img.src = file;
        }
    }

    function BinaryFile(strData, iDataOffset, iDataLength) {
        var data = strData;
        var dataOffset = iDataOffset || 0;
        var dataLength = 0;

        this.getRawData = function () {
            return data;
        }

        if (typeof strData == "string") {
            dataLength = iDataLength || data.length;

            this.getByteAt = function (iOffset) {
                return data.charCodeAt(iOffset + dataOffset) & 0xFF;
            }

            this.getBytesAt = function (iOffset, iLength) {
                var aBytes = [];

                for (var i = 0; i < iLength; i++) {
                    aBytes[i] = data.charCodeAt((iOffset + i) + dataOffset) & 0xFF
                }
                ;

                return aBytes;
            }
        } else if (typeof strData == "unknown") {
            dataLength = iDataLength || IEBinary_getLength(data);

            this.getByteAt = function (iOffset) {
                return IEBinary_getByteAt(data, iOffset + dataOffset);
            }

            this.getBytesAt = function (iOffset, iLength) {
                return new VBArray(IEBinary_getBytesAt(data, iOffset + dataOffset, iLength)).toArray();
            }
        }

        this.getLength = function () {
            return dataLength;
        }

        this.getSByteAt = function (iOffset) {
            var iByte = this.getByteAt(iOffset);
            if (iByte > 127)
                return iByte - 256;
            else
                return iByte;
        }

        this.getShortAt = function (iOffset, bBigEndian) {
            var iShort = bBigEndian ?
            (this.getByteAt(iOffset) << 8) + this.getByteAt(iOffset + 1)
                : (this.getByteAt(iOffset + 1) << 8) + this.getByteAt(iOffset)
            if (iShort < 0) iShort += 65536;
            return iShort;
        }
        this.getSShortAt = function (iOffset, bBigEndian) {
            var iUShort = this.getShortAt(iOffset, bBigEndian);
            if (iUShort > 32767)
                return iUShort - 65536;
            else
                return iUShort;
        }
        this.getLongAt = function (iOffset, bBigEndian) {
            var iByte1 = this.getByteAt(iOffset),
                iByte2 = this.getByteAt(iOffset + 1),
                iByte3 = this.getByteAt(iOffset + 2),
                iByte4 = this.getByteAt(iOffset + 3);

            var iLong = bBigEndian ?
            (((((iByte1 << 8) + iByte2) << 8) + iByte3) << 8) + iByte4
                : (((((iByte4 << 8) + iByte3) << 8) + iByte2) << 8) + iByte1;
            if (iLong < 0) iLong += 4294967296;
            return iLong;
        }
        this.getSLongAt = function (iOffset, bBigEndian) {
            var iULong = this.getLongAt(iOffset, bBigEndian);
            if (iULong > 2147483647)
                return iULong - 4294967296;
            else
                return iULong;
        }

        this.getStringAt = function (iOffset, iLength) {
            var aStr = [];

            var aBytes = this.getBytesAt(iOffset, iLength);
            for (var j = 0; j < iLength; j++) {
                aStr[j] = String.fromCharCode(aBytes[j]);
            }
            return aStr.join("");
        }

        this.getCharAt = function (iOffset) {
            return String.fromCharCode(this.getByteAt(iOffset));
        }
        this.toBase64 = function () {
            return window.btoa(data);
        }
        this.fromBase64 = function (strBase64) {
            data = window.atob(strBase64);
        }
    };

    function ajaxUploadFile(file,imgRotation) {
        alert(imgRotation)
        if(file.length>opt.maxFileSize){
            console.log('您上传的' + file.name + ',图片尺寸过大，最大限制为500K');
            $.toast('您上传的文件尺寸过大，最大限制为500K');
            return false;
        }

        $(opt.loading).show();
        opt.showThumbnail && opt.showThumbnail(file,imgRotation);

        $.sync({
            url: opt.url,
            type:'post',
            data: {
                file: file,
                uploadFlag:opt.bindUser,
                imgRotation:imgRotation
            },
            success: function (d) {
                $(opt.loading).hide();
                opt.afterUpload && opt.afterUpload(file, d);
            },
            error: function (d) {
                $(opt.loading).hide();
                opt.uploadError && opt.uploadError(d);
            }
        });
    }

    opt = $.extend(true, _defaultSetting, options);
    $(this).on('change', function () {
        startUpload(this);
    });
}
