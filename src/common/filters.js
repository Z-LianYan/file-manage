
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





Vue.filter("changeTime",function(timestamp,geshi){
	var d = moment(parseInt(timestamp)*1000).format(geshi?geshi:"YYYY-MM-DD ");
	if(d=='Invalid date'){
		return timestamp;
	}else{
		return d;
	}
});

Vue.filter("timeDate",function(timestamp,geshi){
	var d = moment(parseInt(timestamp)*1000).format(geshi?geshi:"YYYY-MM-DD HH:mm:ss");
	if(d=='Invalid date'){
		return timestamp;
	}else{
		return d;
	}
});

Vue.filter("changeMonth",function(timestamp,geshi){
	var d = moment(parseInt(timestamp)*1000).format(geshi?geshi:"YYYY-MM ");
	if(d=='Invalid date'){
		return timestamp;
	}else{
		return d;
	}
});

//秒转时分
Vue.filter("hoursMinuteSecond",function(seconds){
	var hours = Math.floor(seconds/3600)
	var minute = Math.floor(seconds/60)-hours*60;
	var second = seconds%60;
	return `
		${hours?hours:""}${hours? "小时":""}
		${minute?minute:""}${minute? "分钟":""}
		${second?second:""}${second? "秒":""}
	`;
});

//保留两位小数
Vue.filter("roundNumber",function(val){
	if(val){
		return Number(val).toFixed(2)
	}
});



