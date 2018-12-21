const ctx = wx.createCanvasContext('cover-preview');
var tempFilePath;//图片路径
var tempWidth;//图片初始宽度
var tempHeight;//图片初始高度
var windowWidth = wx.getSystemInfoSync().windowWidth;
var proportion = windowWidth / 750;

Page({
  data: {
    hide_canvas: true,//模拟截取图层显示控制变量
    hide:true,//canvas显示控制变量
    cut_x: 0,
    cut_y: 0, 
    cut_scale: 1,
    img_x: 0,
    img_y: 0,
    img_scale: 1
  },
  //选择并将图片输出到canvas
  change_cover: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '更改我的封面',
      confirmColor: '#39bae8',
      success: function (res) {
        if (res.confirm) {
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res0) {
              tempFilePath = res0.tempFilePaths[0];
              console.log(res0)
              that.setData({
                hide_canvas: false,
                backImgUrl: tempFilePath
              })
              wx.getImageInfo({
                src: tempFilePath,
                success: function (res) {
                  that.setData({
                    imgHeight: res.height / res.width * 750
                  })
                  tempWidth = res.width;
                  tempHeight = res.height;
                  ctx.drawImage(tempFilePath, 0, 0, windowWidth, res.height / res.width * windowWidth);
                  ctx.draw();
                }
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  cut_move(e){
    this.setData({
      cut_x: e.detail.x,
      cut_y: e.detail.y
    })
  },
  cut_scale(e){
    this.setData({
      cut_x: e.detail.x,
      cut_y: e.detail.y,
      cut_scale: e.detail.scale
    })
  },
  onLoad(){
    var proportion = 750 / wx.getSystemInfoSync().windowWidth;
    var heightRpx = wx.getSystemInfoSync().windowHeight * proportion
    this.setData({
      height: heightRpx-100
    })
  },
  //确定并上传背景图
  upload_bg: function () {
    var that = this;
    var screenWidth = wx.getSystemInfoSync().screenWidth;
    this.setData({
      hide:false
    })
    console.log(that.data.cut_scale)
    setTimeout(function(){
      wx.canvasToTempFilePath({
        x: (that.data.cut_x - that.data.img_x) / that.data.img_scale,
        y: (that.data.cut_y - that.data.img_y) / that.data.img_scale,
        width: screenWidth * that.data.cut_scale / that.data.img_scale,
        height: screenWidth / 750 * 360 * that.data.cut_scale / that.data.img_scale,
        destWidth: screenWidth,
        destHeight: screenWidth / 750 * 360,
        quality: 1,
        canvasId: 'cover-preview',
        success: function (res) {
          that.setData({
            hide_canvas: true,
            edit_url: res.tempFilePath,
            hide: true
          })
          //res.tempFilePath即为生成的图片路径
          console.log(res.tempFilePath)
        }
      })
    },100)
  },
  img_move: function (e) {
    // console.log(e.detail)
    this.setData({
      img_x: e.detail.x,
      img_y: e.detail.y
    })
  },
  img_scale(e){
    console.log(e)
    this.setData({
      img_x: e.detail.x,
      img_y: e.detail.y,
      img_scale: e.detail.scale
    })
  },
  //取消图片预览编辑
  cancel_croper: function () {
    ctx.clearActions();
    this.setData({
      hide_canvas: true
    })
  },
})
