'use strict'
const path = require('path')

module.exports = {
    // webpack-dev-server 相关配置
    devServer: {
        host: '0.0.0.0',
        port: 8090,
        open: true,
        proxy: {
            // detail: https://cli.vuejs.org/config/#devserver-proxy
            [process.env.VUE_APP_BASE_API]: {
                // target: process.env.VUE_APP_BASE_HOST,
                target: `http://192.168.30.72:8080`, // 绍
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            }
        },
        disableHostCheck: true
    },
	// uview
	transpileDependencies: ['uview-ui']
}