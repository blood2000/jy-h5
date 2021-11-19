const store = {
	state: {
		isAndroid: false,
		isiOS: false,
		headerInfo: {
			// "Authorization":"ea4d7f0a-62fb-4e3c-990e-04d05286ebae",
			"App-Type": "2",
			"App-Code": "07072c4c302f475d995f832ec8053e9b",
			"Terminal-Type": "web",
			"App-Version": "1.0",
			"Produce-Code": "7beacecadf4341fa81232781beb71b08",
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