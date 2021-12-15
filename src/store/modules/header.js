const store = {
    state: {
		isAndroid: false,
		isiOS: false,
        headerInfo: {
			"Authorization":"",
			"App-Type":"2",
			"App-Code":"f3209f6c7353414e8dbb94dd23cf8b91", // 集运站管理
			// "App-Code":"ffd23bd6a4e040198e7ef2f63c000e66", // web
			"Terminal-Type":"web",
			"App-Version":"1.0",
			"Produce-Code":"2c3c8c43b487432b9d67934a6c4dcbbe",
			"statusBarHeight": 0
		},
		statusBarHeight: 0,

		appOption: {}
    },
    getters: {
		
    },
    mutations: {
        getLoginInfo: (state, val) => {
            state.headerInfo = Object.assign({}, state.headerInfo, val);
        },
		getDevice: (state, val) => {
            if (val === 'isAndroid') {
				state.isAndroid = true;
				state.isiOS = false;
			} else if (val === 'isiOS') {
				state.isAndroid = false;
				state.isiOS = true;
			}
        },
		getStatusBarHeight: (state, val) => {
			state.statusBarHeight = val || 0;
		},

		getAppOption: (state, val) => {
			state.appOption = val || {};
			console.log('接收到的数据', JSON.stringify(state.appOption));
		},
    },
    actions: {
        getLoginInfoAction: ({ commit }, val) => {
            commit('getLoginInfo', val)
        },
		getDeviceAction: ({ commit }, val) => {
		    commit('getDevice', val)
		},
		getStatusBarHeightAction: ({ commit }, val) => {
		    commit('getStatusBarHeight', val)
		},

		setOption: ({ commit }, val) => {
		    commit('getAppOption', val)
		},
    }
}
export default store