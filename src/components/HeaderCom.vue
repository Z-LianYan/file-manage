<template>
    <div>
        <el-row>
            <el-col :span="1">
                <el-button 
                    type="text" 
                    icon="el-icon-arrow-left"
                    @click="onGoback(requestParams.prefix)">
                </el-button>
            </el-col>
            <el-col 
            :span="1" 
            style="text-align:center">
                <el-button 
                    type="text" 
                    icon="el-icon-arrow-right"
                    @click="onAdvance">
                </el-button>
            </el-col>
            <el-col :span="20">
                <el-input 
                    v-model="requestParams.prefix"
                    @keyup.enter.native="onGetDAata"
                    @input ='onPathChange'>
                </el-input>
            </el-col>
            <el-col :span='2' align='center'>


                <el-upload
                class="upload-demo"
                action="/API/common/upload"
                multiple
                :limit="3"
                :on-success="handleAvatarSuccess">
                    <el-button size="small" type="text" class="el-icon-upload2" style="fontSize:20px;"></el-button>
                </el-upload>

            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name:"stockDetail",
        data(){
            return{
                fileLists:{
                    files:[{
                        name:"",
                        key:"",
                        force:""
                    }]
                },
            }
        },
        props:[
            'requestParams',
            'onGoback',
            'onPathChange',
            'onAdvance',
            'onGetDAata'
        ],
        created(){ 

        },
        mounted() {
            
        },
        methods:{
            handleAvatarSuccess(response,file,fileList){
                console.log("response",response);
                console.log("file",file);
                console.log("fileList",fileList);

                this.fileLists.files.map((itm,idx)=>{
                    itm.name = file.response,
                    itm.key = `${localStorage.folderPath ? localStorage.folderPath:''}${file.name}`
                })
                console.log("localStorage.folderPath",localStorage.folderPath)
                console.log("this.fileLists.files",this.fileLists.files)


                this.$store.dispatch("POST_CREATE_FILE",this.fileLists).then( res => {
                    this.visibleOkCancel = false;
                    this.onGetDAata();
                })
            },
        },
    }
</script>

<style lang="scss">

</style>
