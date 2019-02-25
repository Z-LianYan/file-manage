<template>
    <div>
        <el-row 
        style="marginBottom:20px;text-align:center;">
            {{this.folderNamekey|folderName}}目录中已存在{{this.fileNamekey|fileName}}文件要强制替换吗
        </el-row>
        <el-button type="success" @click="replaceFile">要</el-button>
        <el-button type="success" @click="onFileExists">不要</el-button>
    </div>
</template>

<script>
    import {Message} from 'element-ui';
    export default {
        name:"stockDetail",
        data(){
            return{

            }
        },
        props:[
            'moveFiles',
            'onGetData',
            'onFileExists',
            'fileNamekey',
            'folderNamekey'
        ],
        created(){  
        },
        mounted() {
        },
        methods:{
            replaceFile(){
                this.moveFiles.isForce = 1;
                this.$store.dispatch("POST_RENAME_FILE",this.moveFiles).then( res => {
                    this.onFileExists();
                    this.onGetData();
                    this.moveFiles.isForce = 0;
                    this.moveFiles.destKey = '';
                    Message({
                        type:'success',
                        message:"替换成功"
                    });
                })
            },

        },
    }
</script>

<style lang="scss">

</style>
