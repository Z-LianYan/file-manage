import * as HttpUtil from '@/utils/request';
import {Message} from 'element-ui';
import * as apiMap from '@/api/api';
// import tools from '@/common/tool';
const resouceFile	 = {
  state: {
  	
  },
  mutations: {
   
  },
  actions: {
		POST_RESOURCE_GETLIST({commit,state},requestData){
			return new Promise((resolve,reject)=>{
		   	 	HttpUtil.post(apiMap.POST_RESOURCE_GETLIST,requestData,{isLoading:true}).then((res)=>{
					if(res.error==0){
						resolve(res);
					}else{
						 Message({
							type:'error',
							message:res.message
				        });	
					}
				})	
		   	});	
		},
		POST_RESOURCE_DETAIL({commit,state},requestData){
			return new Promise((resolve,reject)=>{
				HttpUtil.post(apiMap.POST_RESOURCE_DETAIL,requestData,{isLoading:true}).then((res)=>{
					if(res.error==0){
						resolve(res);
					}else{
							Message({
							type:'error',
							message:res.message
						});	
					}
				})	
			});	
		},
		//更改存储类型
		POST_CHANGE_SAVE_TYPE({commit,state},requestData){
			return new Promise((resolve,reject)=>{
				HttpUtil.post(apiMap.POST_CHANGE_SAVE_TYPE,requestData,{isLoading:true}).then((res)=>{
					if(res.error==0){
						resolve(res);
					}else{
							Message({
							type:'error',
							message:res.message
						});	
					}
				})	
			});	
		},
		//上传文件
		POST_UPLOADING_FILE({commit,state},requestData){
			return new Promise((resolve,reject)=>{
				HttpUtil.post(apiMap.POST_UPLOADING_FILE,requestData,{isLoading:true}).then((res)=>{
					if(res.error==0){
						resolve(res);
					}else{
						Message({
							type:'error',
							message:res.message
						});	
					}
				})	
			});	
		},
		//删除文件
		POST_DELETE_FILE({commit,state},requestData){
			return new Promise((resolve,reject)=>{
				HttpUtil.post(apiMap.POST_DELETE_FILE,requestData,{isLoading:true}).then((res)=>{
					if(res.error==0){
						resolve(res);
					}else{
						Message({
							type:'error',
							message:res.message
						});	
					}
				})	
			});	
		},
		//创建文件夹
		POST_CREATE_FOLDER({commit,state},requestData){
			return new Promise((resolve,reject)=>{
				HttpUtil.post(apiMap.POST_CREATE_FOLDER,requestData,{isLoading:true}).then((res)=>{
					if(res.error==0){
						resolve(res);
					}else{
						Message({
							type:'error',
							message:res.message
						});	
					}
				})	
			});	
		},
		//删除文件夹
		POST_DELETE_FOLDER({commit,state},requestData){
			return new Promise((resolve,reject)=>{
				HttpUtil.post(apiMap.POST_DELETE_FOLDER,requestData,{isLoading:true}).then((res)=>{
					if(res.error==0){
						resolve(res);
					}else{
						Message({
							type:'error',
							message:res.message
						});	
					}
				})	
			});	
	   	},
	}
}
export default resouceFile;









