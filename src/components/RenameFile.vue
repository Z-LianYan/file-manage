<template>
    <div>
        <el-form 
        :model="renameFileParams" 
        :rules="renameFileRules" 
        ref="renameFile" 
        label-width="100px">
            <el-form-item 
            label="文件">
                <span>{{renameFileParams.srcKey|fileName}}</span>
            </el-form-item>
            <el-form-item 
            label="重命名" 
            prop="destKey">
                <el-input 
                v-model="renameFileParams.destKey"
                style="marginBottom:10px;" 
                @keyup.enter.native="submitRenameForm('renameFile')"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="submitRenameForm('renameFile')">创建</el-button>
                <el-button type="success" @click="resetRenameForm('renameFile')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {Message} from 'element-ui';
    export default {
        name:"delete",
        data(){
            return{
                renameFileRules:{
                    destKey: [
                        { required: true, message: '请输入文件夹名', trigger: 'blur' },
                        { pattern: /^((?!\/|\+|\||\\|\*|:|\?|"|<|>).)*$/gi, message: '文件名称不能包含空格及/ | \\ * + : ? " < >字符' }
                    ]
                },
            }
        },
        props:['renameFileParams','onGetData'],
        created(){  
        },
        mounted() {
        },
        methods:{
            renameFileSend(){
                let renameFileName = `
                    ${localStorage.folderPath? localStorage.folderPath:''}
                    ${this.renameFileParams.destKey}`;
                this.renameFileParams.destKey = renameFileName.replace(/\s*/ig,'');
                this.$store.dispatch("POST_RENAME_FILE",this.renameFileParams).then( res =>{
                    if(res.error == 614){
                        this.visibleRenameFileExists = true;
                        return;
                    }
                    if(res.error == 0){
						Message({
							type:'success',
							message:"重命名完成"
                        });
                    }
                    this.$emit("onCancelRename",{ visibleRename : false })
                    this.renameFileParams.destKey='';
                    this.onGetData();
                })
            },
            submitRenameForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.renameFileSend();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetRenameForm(formName) {
                this.$refs[formName].resetFields();
            },
        },
        watch:{
            
        },
    }
</script>

<style lang="scss" scope>
    
</style>
