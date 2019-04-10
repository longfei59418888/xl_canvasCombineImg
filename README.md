# title

```$xslt
/*
  * 合成图片
  * @method add(img,x,y,width,height)  绘制图片到canvas上面，
  * @method addText(x,y,text,options)  绘制文字到canvas上面，
  * @method save(callback,quality)  保存图片,回调函数返回结果
  * */
```

```$xslt
 const canvas = new CanvasCombineImg(500, 900);
 canvas.add('https://p0.ssl.qhimgs0.com/dr/300_300_/t01de31e549b100f881.webp', 0, 0, 500, 500)
  canvas.addText(20, 40, '商品名称商品名称商品名称商品名称商品名称是是是的的称商品名称商称商品名称商称商品名称商…', {
         fontSize: 18,
         lineHeight: 25,
         width: 250,
         color: 'red'
     });
     canvas.add('https://p0.ssl.qhimgs0.com/dr/300_300_/t01326a25b3b9000e1a.webp', 0, 50, 500, 500)
     canvas.addText(10, 300, '商品名称商品名称商品名称商品名称商品名称是是是的的称商品名称商称商品名称商称商品名称商…', {
         fontSize: 36,
         lineHeight: 50,
         width: 430,
     });
     canvas.save(res => {
         document.querySelector('img').src = res.base64
         console.log(res)
     })
```
















