
/*
  * 合成图片
  * @method add(img,x,y,width,height)  绘制图片到canvas上面，
  * @method addText(x,y,text,options)  绘制文字到canvas上面，
  * @method save(callback,quality)  保存图片,回调函数返回结果
  * */
function CanvasCombineImg(width = 300, height = 300) {
    this.width = width
    this.height = height
    this.DEAW_ING = false
    this.queue = []
    this.init()
}
CanvasCombineImg.prototype = {
    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = this.width + 'px'
        this.canvas.style.height = this.height + 'px'
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.box = document.createElement('div')
        this.box.style.height = 0
        this.box.style.overflow = 'hidden'
        this.box.appendChild(this.canvas);
        document.body.appendChild(this.box);
        this.cxt = this.canvas.getContext('2d')
    },
    add(img, x, y, width, height) {
        let isDraw = false, _this = this;
        const {cxt, DEAW_ING} = _this
        if (DEAW_ING) {
            this.queue.push({
                img, x, y, width, height
            })
            return
        }
        this.DEAW_ING = true
        if (typeof img !== 'string') {
            Draw(img)
        } else {
            const image = new Image();
            image.onload = () => {
                draw(image)
            };
            image.crossOrigin = 'anonymous';
            image.src = img;
            if (image.complete) {
                draw(image)
            }
        }

        function draw(image) {
            if (isDraw) return
            isDraw = true;
            cxt.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, x, y, width, height);
            _this.addEnd()
        }

    },
    setFontFamily(family) {
        this.family = family
    },
    addText(x, y, text, options) {
        const {addEnd, cxt, DEAW_ING} = this
        if (DEAW_ING) {
            this.queue.push({
                x, y, text, options
            })
            return
        }
        this.DEAW_ING = true
        const {fontSize = 18, lineHeight = 18, color = '#000000', width = 10000} = options
        const _this = this;
        const family = this.family || 'Helvetica,STHeiTi,sans-serif'
        this.textBaseline = "top";
        cxt.restore();
        cxt.save();
        cxt.font = `${fontSize}px ${family}`;
        cxt.fillStyle = color;
        y = (lineHeight - fontSize) / 2 + y
        draw(text)

        function draw(text) {
            if (!text) return
            let overflow = 0;
            for (let i = 1; i < text.length; i++) {
                let txt = text.slice(0, i)
                let w = _this.cxt.measureText(txt).width
                if (w > width && overflow == 0) {
                    overflow = i - 1
                }
            }
            if (overflow > 1) {
                cxt.fillText(text.slice(0, overflow), x, y);
                y = (lineHeight - fontSize) / 2 + y + fontSize
                draw(text.slice(overflow))
                return
            }
            cxt.fillText(text, x, y);
            _this.addEnd()
        }

    },
    save(callback, quality = 1) {
        if (this.queue.length > 0) {
            setTimeout(() => {
                this.save(callback, quality)
            }, 200)
            return
        }
        const base64 = this.canvas.toDataURL("image/jpeg", quality);
        const file = this.convertBase64UrlToBlob(base64);
        this.box.parentNode.removeChild(this.box)
        callback && callback({
            base64,
            file
        })
    },
    convertBase64UrlToBlob(urlData) {
        var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type: mime, lastModified: Date.now()});
    },
    addEnd() {
        this.DEAW_ING = false
        const queueImg = this.queue.shift();
        if (queueImg) {
            const {img, x, y, width, height, text, options} = queueImg
            if (img) this.add(img, x, y, width, height)
            else this.addText(x, y, text, options)
        }
    },
}
export default  CanvasCombineImg