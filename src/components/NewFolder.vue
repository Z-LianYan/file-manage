<template>
    <div>
        <el-form 
        :model="newFolderName" 
        :rules="rules" 
        ref="newFolderNames" 
        label-width="100px">
            <el-form-item 
            label="文件夹名称" 
            prop="folderNane">
                <el-input 
                v-model="newFolderName.folderNane" 
                @keyup.enter.native="submitForm('newFolderNames')"></el-input>
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
                createFolderParams:{
                    folder_name:''
                },
                newFolderName:{
                    folderNane:''
                },
                rules:{
                        folderNane: [
                            { required: true, message: '请输入文件夹名', trigger: 'blur' },
                            { pattern: /^((?!\/|\s+|\||\\|\*|:|\?|"|<|>).)*$/gi, message: '文件夹名称不能包含空格及/ | \\ * + : ? " < >字符' }
                        ]
                },
            }
        },
        props:['onGetData'],
        created(){  
        },
        mounted() {
        },
        methods:{
            createFolder(){
                let folderDirctory = `${localStorage.folderPath? localStorage.folderPath:''}
                    ${this.newFolderName.folderNane}/`;
                this.createFolderParams.folder_name = folderDirctory.replace(/\s*/g,'');
                this.$store.dispatch("POST_CREATE_FOLDER",this.createFolderParams).then( res =>{
                    this.$emit('onCancelFolder',{visibleCreate : false});
                    this.onGetData();
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.createFolder();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        },
        watch:{
            
        },
    }
</script>

<style lang="scss" scope>
    
</style>
