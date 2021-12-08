export function saveHeadImgFile(base64, quality=100) {
    const bitmap = new plus.nativeObj.Bitmap("test");
    return new Promise((resolve, reject) => {
        // 从本地加载Bitmap图片
        bitmap.loadBase64Data(base64, function() {
            const url = "_doc/" + Date.now() + ".png";  // url为时间戳命名方式
            bitmap.save(url, {
                overwrite: true,  // 是否覆盖
                quality: quality  // 图片质量，1-100 默认50， 100质量最高
            }, (i) => {
                resolve(url)
            }, (e) => {
                reject('保存图片失败：' + JSON.stringify(e));
            });
        }, (e) => {
            reject('加载图片失败：' + JSON.stringify(e));
        });
    })
}