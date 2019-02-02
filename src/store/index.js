import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


// import user from './user/';

import admin from './login/'; 
import resource from './resource/'; 

export default new Vuex.Store({
    modules: {
        admin,
        resource
    },
    actions:{
        SHOW_MSG(){
            
        }
    }
});

