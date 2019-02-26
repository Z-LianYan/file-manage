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
					resolve(res);
				})	
			});	
		},
		//创建文件
		POST_CREATE_FILE({commit,state},requestData){
			return new Promise((resolve,reject)=>{
				HttpUtil.post(apiMap.POST_CREATE_FILE,requestData,{isLoading:true}).then((res)=>{
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
		//复制文件
		POST_COPY_FILE({commit,state},requestData){
			return new Promise((resolve,reject)=>{
				HttpUtil.post(apiMap.POST_COPY_FILE,requestData,{isLoading:true}).then((res)=>{
					resolve(res);
					if(res.error == 0){
						Message({
							type:'success',
							message:"成功复制"
						});
					}
					if(res.error == 612){
						Message({
							type:'success',
							message:'粘贴的文件不存在'
						});
					}
				})	
			});	
		},
		//更改文件名（或移动文件）
		POST_RENAME_FILE({commit,state},requestData){
			return new Promise((resolve,reject)=>{
				HttpUtil.post(apiMap.POST_RENAME_FILE,requestData,{isLoading:true}).then((res)=>{
					resolve(res);
				})	
			});	
	   	},
		//删除文件
		POST_DELETE_FILE({commit,state},requestData){
			return new Promise((resolve,reject)=>{
				HttpUtil.post(apiMap.POST_DELETE_FILE,requestData,{isLoading:true}).then((res)=>{
					if(res.error==0){
						resolve(res);
						Message({
							type:'success',
							message:"删除成功"
						});	
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

		//获取静态资域名
		POST_STATIC_HOST({commit,state},requestData){
			return new Promise((resolve,reject)=>{
				HttpUtil.post(apiMap.POST_STATIC_HOST,requestData,{isLoading:true}).then((res)=>{
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









