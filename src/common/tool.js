
var tools={};
import store from '../store';

tools.getToken=function(){
	return localStorage.token;
}
tools.setToken=function(token){
	localStorage.token=token;
}

tools.removeToken=function(){
	delete localStorage.token;
}

// 下载文件；
tools.downloadFile=function(){ 

}
export default tools;


