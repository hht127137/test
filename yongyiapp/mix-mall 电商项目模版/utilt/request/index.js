/* eslint-disable */
// import Request from './request';
import Request from './request.js'
import indexConfig from '../../config/index.config.js';
import mHelper from '../helper.js';


const http = new Request();

// request全局参数设置
http.setConfig(config => {
	/* 设置全局配置 */
	config.baseUrl = indexConfig.baseUrl; /* 根域名不同 */
	const systemInfo = uni.getSystemInfoSync();
	
	return config;
});

let isRefreshing = false;
let requests = [];

http.interceptor.request(
	config => {
		console.log(config)
		
		/* 请求之前拦截器 */
		if(uni.getStorageSync("token")){
			config.header['Xshop-Token']=uni.getStorageSync("token");
		}
		// else{
		// 	uni.navigateTo({
		// 		url:"../login/login"
		// 	})
		// }
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

	

export { http };
