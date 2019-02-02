
  import axios from 'axios'
  import { Message,Loading } from 'element-ui'
  import store from '@/store'
  import router from '@/router/index';
  import tools from '@/common/tool';

  axios.defaults.withCredentials=true;
  const service = axios.create({
    baseURL: process.env.BASE_API, // api的base_url
    timeout: 5000*20, //1m request timeout
    headers:{
      platform:'TIMP'
    },
    withCredentials: true,
    crossDomain:true 
  });

  export default service
  service.interceptors.request.use(config => {
    config.headers['token'] = tools.getToken() 
    return config
  }, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  });

  // respone interceptor
  service.interceptors.response.use(
    response => {
    // console.log(response)
      if(response.data.error==405){
        router.replace({path:"/"});//去登录; 
        response.data.data={};    
        return response;
      }else if(response.data.error==403){
      // console.log('403');
        //router.back();
        response.data.data={};
        return response;     
      }else{
          return response;
      }    
    },

    error => {
      return Promise.reject(error)
    }
  )

  var loading_fn;

  export function post(url,data,{isLoading=false,hint="加载中..."}={}){
    return new Promise((resolve,reject)=>{
      if(isLoading){
        console.log(url);
        // console.log(Message.loading);
        loading_fn = Loading.service({
          lock: true,
          text: hint,
          spinner: 'el-icon-loading',
          background: 'transparent'
        })
      }  
      service({
        url:url,
        method:'POST',
        data:data,
        headers:{
          'eryi-token':'2373c588-08e5-4869-8f31-9652ed8ce0e4'
        }
      }).then((res)=>{
        resolve(res.data);
        loading_fn && loading_fn.close(); //关闭
      }).catch(err=>{
        console.log(err);
        reject(err);
        console.log(loading_fn);
        loading_fn && loading_fn.close(); //关闭
        Message.warning(err.message);
      })  
    })
  }

  export function get(url,params,{isLoading=false,hint="加载中..."}={}){
    return new Promise((resolve,reject)=>{
      if(isLoading){
        loading_fn = Loading.service({
            lock: true,
            text: hint,
            spinner: 'el-icon-loading',
            background: 'transparent'
          // duration:1000,
        })
      }  
      service({
        url:url,
        method:'GET',
        params:params,
        headers:{
          'token':tools.getToken(),
        }      
      }).then((res)=>{
        resolve(res.data);
        loading_fn && loading_fn.close(); //关闭；
      }).catch(err=>{
        console.log(err);
        reject(err);
        // Message.close()
        loading_fn && loading_fn.close(); //关闭；
        Message.warning(err.message);
      })  
    })
  }



