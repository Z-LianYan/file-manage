
import Vue from 'vue'
import moment from 'moment';
import Humanize from 'humanize-plus';
// import currency from 'currency.js';

Vue.filter("formatDate",function(timestamp){
	var tt = new String(timestamp)
	var d = moment(parseInt(tt.substr(0,tt.length-7))*1000).format("YYYY年MM月DD日 HH:mm:ss");
	return d;
});

//可视化文件大小
Vue.filter("fileSize",(val)=>{
	if(val){
		return Humanize.fileSize(val)
	}
});

//过滤文件名
Vue.filter("fileName", val =>{
	if(val){
		let index = val.lastIndexOf('/');
		let len = val.length;
		let fileName = val.substring(index+1, len);
		return fileName;
	}
})
//过滤文件夹名
Vue.filter("folderName", val =>{
	if(val){
		let dirName = val.split("/");
		let len = dirName.length;
		return dirName[len-2];
	}
})



