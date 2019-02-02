
import Vue from 'vue'
import moment from 'moment';
// import currency from 'currency.js';

Vue.filter("formatDate",function(timestamp,geshi){
	var d = moment(parseInt(timestamp)*1000).format(geshi?geshi:"YYYY-MM-DD HH:mm:ss");
	if(d=='Invalid date'){
		return timestamp;
	}else{
		return d;
	}
});

// Vue.filter("formatMoney",function(money){
// 	return currency(money).format();
// });

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


