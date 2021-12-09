const store = {
	state: {
		isAndroid: false,
		isiOS: false,
		headerInfo: {
			"Authorization":"3c448ef6-ca18-404a-82e2-d3eb7bcd7163",
			"App-Type": "2",
			"App-Code": "f3209f6c7353414e8dbb94dd23cf8b91",
			"Terminal-Type": "app",
			"App-Version": "1.0",
			"Produce-Code": "2c3c8c43b487432b9d67934a6c4dcbbe",
			"statusBarHeight": 0
		},
		statusBarHeight: 0
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
		}
	},
	actions: {
		getLoginInfoAction: ({
			commit
		}, val) => {
			commit('getLoginInfo', val)
		},
		getDeviceAction: ({
			commit
		}, val) => {
			commit('getDevice', val)
		},
		getStatusBarHeightAction: ({
			commit
		}, val) => {
			commit('getStatusBarHeight', val)
		}
	}
}
export default store