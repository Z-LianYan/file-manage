<template>
    <div>
        <div style="marginBottom:20px;">您确定要删除 {{visibleCommon?handleFile(delFileName)+'文件':handleFolder(delFileName)+'文件夹'}}吗？</div>
        <el-button type="success" @click="onDelFileFolder">确定</el-button>
        <el-button type="success" @click="onCancel">取消</el-button>
    </div>
</template>

<script>
    import {Message} from 'element-ui';
    export default {
        name:"delete",
        data(){
            return{
                
            }
        },
        props:['visibleCommon','deleteFileParams','visibleOkCancel','deleteFolderParams','onGetData','delFileName'],
        created(){  
        },
        mounted() {
        },
        methods:{
            onDelFileFolder(){
                if(this.visibleCommon){
                    this.$store.dispatch("POST_DELETE_FILE",this.deleteFileParams).then( res =>{
                        this.$emit('cancelDel',{ visibleOkCancel : false })
                        this.$emit('OkCancel')
                        this.onGetData();
                    })
                }else{
                    this.$store.dispatch("POST_DELETE_FOLDER",this.deleteFolderParams).then( res =>{
                        this.$emit('cancelDel',{ visibleOkCancel : false })
                        this.onGetData();
                    })
                }
            },
            onCancel(){
                this.$emit('cancelDel',{ visibleOkCancel : false })
            },
            handleFile(val){
                let index = val.lastIndexOf('/');
                let len = val.length;
                let fileName = val.substring(index+1, len);
                return fileName;
            },
            handleFolder(i){
                let dirName = i.split("/");
                let len = dirName.length;
                return dirName[len-2];
            },
        },
        watch:{
            
        },
    }
</script>

<style lang="scss" scope>
    
</style>
