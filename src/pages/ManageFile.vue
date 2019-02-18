<template>
    <div class="manage_container">
        <el-card class="card-box">
            <el-row>
                <el-col :span="1">
                    <el-button 
                        type="text" 
                        icon="el-icon-arrow-left"
                        @click="goback(requestParams.prefix)">
                    </el-button>
                </el-col>
                <el-col 
                :span="1" 
                style="text-align:center">
                    <el-button 
                        type="text" 
                        icon="el-icon-arrow-right"
                        @click="advance()">
                    </el-button>
                </el-col>
                <el-col :span="20">
                    <el-input 
                        v-model="requestParams.prefix"
                        @keyup.enter.native="getData()"
                        @input ='pathChange'>
                    </el-input>
                </el-col>
                <el-col :span='2' align='center'>
                </el-col>
            </el-row>

            <div 
            class="folder-box" 
            @contextmenu="menuContainer"
            @click="comEvent">
                <div 
                v-for="(item,index,key) in this.resouceData.commonPrefixes"
                :key="key"
                class="folder"
                :class="selectFolderIdx==index? 'active':''"
                @dblclick="openFolder(item)"
                @contextmenu.prevent.stop="showRightMenu(item,index)"
                @click.stop="onSelectedFolder(index)">
                    <img 
                    src="@/assets/img/folder.png" 
                    alt="" 
                    class="folderImg"/>
                    <span class="fileName">{{handleFolder(item)}}</span>
                </div>
                <div 
                v-for="(item,index) in this.resouceData.items"
                :key="index"
                class="folder"
                :class="selectFileIdx==index? 'active':''"
                @contextmenu.prevent.stop="showRightMenu(item,index)"
                @click.stop="onSelectedFile(index)">
                    <img 
                    :src="getIconSrc(item)" 
                    alt="" 
                    class="folderImg"/>
                    <span class="fileName">
                        {{handleFile(item.key)}}
                    </span>
                </div>
            </div>

            <ul 
                class='contextmenu' 
                v-show="visibleDetList" 
                :style="{left:left+'px',top:top+'px'}">
                <li 
                @mouseover="changeSaveTpye()" 
                @mouseout="outSaveType()" 
                class="change-save"
                v-show="visibleCommon">
                    <i></i>
                    <span>更改存储类型</span>
                    <i class="fa fa-angle-right"></i>
                    <div v-show="saveType" class="change-save-type">
                        <el-radio-group v-model="changeSaveParams.newType" @change="saveChange">
                            <el-radio :label="0">普通存储</el-radio>
                            <el-radio :label="1">低频存储</el-radio> 
                        </el-radio-group>
                    </div>
                </li>
                <li @click="copyFile" v-show="visibleCommon">
                    <i></i>
                    <span>复制</span>
                    <i></i>
                </li>
                <li @click="renameFile" v-show="visibleCommon">
                    <i></i>
                    <span>重命名</span>
                    <i></i>
                </li>
                <li @click="OkCancel">
                    <i class="fa fa-trash-o"></i>
                    <span>删除</span>
                    <i></i>
                </li>
                <li @click="onProperty()" v-show="visibleCommon">
                    <i></i>
                    <span>属性</span>
                    <i></i>
                </li>
            </ul>

            <FileAttribute 
            v-show='propertyShow' 
            :attributeTitle='attribute' 
            :propertyData='propertyData' 
            @onClose="closeBtn" 
            :onDrag='drag'
            :left='left'
            :top='top'/>

            <NewContainerMenu 
            :left='left' 
            :top='top'
            v-show='visibleMenuList' 
            @onCreateFold='createFold'
            :OnPasteFile='pasteFile'/>

        </el-card>

        <el-dialog
        :visible.sync="visibleCreate"
        :modal-append-to-body="false"
        align='center'
        width='30%'>
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
        </el-dialog>

        <el-dialog
        :visible.sync="visibleRename"
        :modal-append-to-body="false"
        width='30%'>
            <el-form 
            :model="renameFileParams" 
            :rules="renameFileRules" 
            ref="renameFile" 
            label-width="100px">
                <el-form-item 
                label="文件">
                    <span>{{handleFile(renameFileParams.srcKey)}}</span>
                </el-form-item>
                <el-form-item 
                label="重命名" 
                prop="renameDestKey">
                    <el-input 
                    v-model="renameFileParams.renameDestKey" 
                    @keyup.enter.native="submitRenameForm('renameFile')"></el-input>
                </el-form-item>
                <el-form-item 
                label="是否强制替换">
                    <el-radio-group v-model="renameFileParams.isForce">
                        <el-radio :label="0">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="submitRenameForm('renameFile')">确定</el-button>
                    <el-button type="success" @click="resetRenameForm('renameFile')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog
        :visible.sync="visibleOkCancel"
        :modal-append-to-body="false"
        align='center'
        width='20%'>
            <el-row style="marginBottom:20px;">您确定要删除 {{visibleCommon?handleFile(delFileName)+'文件':handleFolder(delFileName)+'文件夹'}}吗？</el-row>
            <el-button type="success" @click="deleteFileFolder">确定</el-button>
            <el-button type="success" @click="cancel">取消</el-button>
        </el-dialog>
        
        <el-dialog
        :visible.sync="visibleCopyExists"
        :modal-append-to-body="false"
        align="center"
        width='20%'>
            <el-row style="marginBottom:20px;text-align:center;">{{copyExistsFile.message}}是否强制替换</el-row>
            <el-button type="success" @click="pasteFile(1)">替换</el-button>
            <el-button type="success" @click="replaceClose">不替换</el-button>
        </el-dialog>

    </div>
</template>

<script>
    import {Message} from 'element-ui';
    import FileAttribute from '@/components/FileAttribute';
    import NewContainerMenu from '@/components/NewContainerMenu';

    var extnameMap={
        ".js":require("@/assets/img/file_icon.png"),
        ".html":require("@/assets/img/html_icon.png"),
        ".zip":require("@/assets/img/zip.png"),
    };
    var folder_icon = require("@/assets/img/file_icon.png")
    var unknow_icon = require("@/assets/img/file_icon.png");
    export default {
        name:"stockDetail",
        data(){
            return{
                requestParams:{
                    prefix:localStorage.folderPath
                },
                propertyParams:{
                    filename:''
                },
                changeSaveParams:{
                    filename:"",
                    newType:""
                },
                deleteFileParams:{
                    files:[{
                        name:''
                    }]
                },
                delFileName:'',
                deleteFolderParams:{
                    folder_name:""
                },
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
                renameFileParams:{
                    srcKey:'',
                    destKey:'',
                    isForce:0,
                    renameDestKey:''
                },
                renameFileRules:{
                    renameDestKey: [
                        { required: true, message: '请输入文件夹名', trigger: 'blur' },
                        { pattern: /^((?!\/|\s+|\||\\|\*|:|\?|"|<|>).)*$/gi, message: '文件名称不能包含空格及/ | \\ * + : ? " < >字符' }
                    ]
                },
                copyFileParams:{
                    srcKey:'',
                    destKey:'',
                    isForce:''
                },
                resouceData:'',
                visibleDetList:false,
                propertyShow:false,
                visibleNews:false,
                visibleCommon:false,
                visibleMenuList:false,
                visibleRename:false,
                visibleCreate:false,
                visibleOkCancel:false,
                visibleCopyExists:false,
                left:"",
                top:"",
                history:[],
                propertyData:{},
                saveType:false,
                attribute:'',
                selectFolderIdx:null,
                selectFileIdx:null,
                copySrcKey:'',
                copyExistsFile:'',
                createFileData:{
                    files:[{
                        name:"",
                        key:"",
                        force:""
                    }]
                },
                fileLists:[],
                
            }
        },
        created(){  
        },
        components:{
            FileAttribute,
            NewContainerMenu
        },
        methods:{
            handleAvatarSuccess(response,file,fileList){
                console.log("response",response)
                console.log("file",file)
                console.log("fileList",fileList)
                this.fileLists = fileList
                this.createFileData.files.map((item,index)=>{
                    item.name = response;
                    item.key = file.name;
                })
                console.log("this.createFileData",this.createFileData)
            },

            createFile(){
               this.$store.dispatch("POST_CREATE_FILE",this.createFileData).then((res)=>{
                   this.getData();
               })
            },
            
            getIconSrc(item){
                var extname = this.getExtName(item.key);
                return extnameMap[extname]?extnameMap[extname]:unknow_icon;
            },
            getExtName(val){
                var pointPos=val.lastIndexOf(".");
                var len=val.length;
                var suffix=val.substring(pointPos, len);
                return `.${suffix}`;
            },
            handleFile(val){
                let index = val.lastIndexOf('/');
                let len = val.length;
                let fileName = val.substring(index+1, len);
                return fileName;
            },
            //单击选中
            onSelectedFolder(index){
                this.visibleDetList = false;
                this.visibleMenuList = false;
                this.selectFileIdx = null;
                this.selectFolderIdx = index;
            },
            onSelectedFile(index){
                this.visibleDetList = false;
                this.visibleMenuList = false;
                this.selectFolderIdx = null;
                this.selectFileIdx = index;
            },
            comEvent(){
                this.visibleDetList = false;
                this.visibleMenuList = false;
                this.selectFolderIdx = null;
                this.selectFileIdx = null;
            },
            //获取目录下文件
            getData(){
                this.$store.dispatch("POST_RESOURCE_GETLIST",this.requestParams).then((res)=>{
                    console.log("res",res);
                    this.resouceData = res.data;
                })
            },
            pathChange(){
                localStorage.folderPath = this.requestParams.prefix
               
            },

            menuContainer(){
                this.visibleMenuList = true;
                this.visibleDetList = false;
                this.left = event.clientX;
                this.top = event.clientY;
            },

            showRightMenu(item,index){
                this.visibleMenuList = false;
                this.visibleCommon = true;
                let itmStr = new String(item)
                if(item instanceof Object){
                    this.propertyParams.filename = item.key;
                    this.changeSaveParams.filename = item.key;
                    this.changeSaveParams.newType = item.type;
                    this.attribute = item.key;
                    this.renameFileParams.srcKey = item.key;

                    this.delFileName = item.key;
                    
                    this.deleteFileParams.files.map((itm,index)=>{
                        itm.name = item.key;
                    })

                    this.copySrcKey = item.key

                }else if(itmStr instanceof String){
                    this.visibleCommon = false;
                    this.deleteFolderParams.folder_name = item;
                    this.folderDir = item;
                    this.delFileName = item;
                }
                this.visibleDetList = true;
                this.left = event.clientX;
                this.top = event.clientY;
            },
            openFolder(val){
                this.history.push(val);
                localStorage.setItem('folderPath',val)
                console.log('folderPath',localStorage.folderPath)
                console.log("efg",this.history);
                this.requestParams.prefix = val;
                this.getData();
            },
            handleFolder(i){
                let dirName = i.split("/");
                let len = dirName.length;
                return dirName[len-2];
            },
            goback(val){
                let index = val.lastIndexOf('/');
                let second = val.lastIndexOf('/',index-1);
                let dir = val.slice(0,second+1);
                this.requestParams.prefix = dir;
                console.log('dir',dir)
                localStorage.folderPath = dir;
                this.getData();
            },
            advance(){
                let len = this.history.length-1;
                this.requestParams.prefix = this.history[len];
                localStorage.folderPath = this.history[len];
                this.getData();
            },


            //获取文件详情
            onProperty(){
                this.visibleDetList = false;
                this.propertyShow = true;
                this.$store.dispatch("POST_RESOURCE_DETAIL",this.propertyParams).then((res)=>{
                    console.log("resProperty",res);
                    this.propertyData = res.data;
                })
            },

            closeBtn(data){
                this.propertyShow = data.propertyShow;
                // this.visibleDetList = false;
            },
            //更改存储类型
            changeSaveTpye(){
                this.saveType = true;
            },
            outSaveType(){
                this.saveType = false;
            },
            
            closeDialog(){
                this.saveType = false;
            },
            saveChange(){
                this.$store.dispatch("POST_CHANGE_SAVE_TYPE",this.changeSaveParams).then((res)=>{
                    this.closeDialog();
                    this.visibleDetList = false;
                    this.getData();
                }) 
            },

            createFold(data){
                console.log("55");
                this.visibleCreate = data.visibleCreate; 
                this.visibleMenuList = data.visibleMenuList;
            },


            createFolder(){
                let folderDirctory = `${localStorage.folderPath? localStorage.folderPath:''}
                    ${this.newFolderName.folderNane}/`;
                this.createFolderParams.folder_name = folderDirctory.replace(/\s*/g,'');
                this.$store.dispatch("POST_CREATE_FOLDER",this.createFolderParams).then((res)=>{
                    this.visibleCreate = false;
                    this.getData();
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
            //复制文件
            copyFile(){
                this.visibleDetList = false;
                // this.copyFileParams.srcKey = this.copySrcKey;
                localStorage.setItem("copySrcKey",this.copySrcKey)
                
            },

            pasteFile(val){
                this.copyFileParams.srcKey = localStorage.copySrcKey.replace(/\s*/g,'');
                let copyDestKeyFile = this.handleFile(localStorage.copySrcKey);
                let copyDestKey = `${localStorage.folderPath?localStorage.folderPath:''}
                    ${copyDestKeyFile}`;
                this.copyFileParams.destKey = copyDestKey.replace(/\s*/g,'');
                if(val == 0){
                    this.copyFileParams.isForce = val;
                    this.$store.dispatch("POST_COPY_FILE",this.copyFileParams).then((res)=>{
                        this.visibleMenuList = false;
                        if(res.error == 614){
                            console.log("123456789")
                            this.copyExistsFile = res;
                            this.visibleCopyExists = true;
                        }
                        this.getData();
                    })
                }else if( val == 1){
                    this.copyFileParams.isForce = val;
                    this.$store.dispatch("POST_COPY_FILE",this.copyFileParams).then((res)=>{
                        this.visibleMenuList = false;
                        this.visibleCopyExists = false;
                        this.copyFileParams.isForce = 0;
                        this.getData();
                        Message({
							type:'success',
							message:"替换成功"
						});
                    })
                }
            },

            replaceClose(){
                this.visibleCopyExists = false;
            },



            //删除文件&&文件夹
            OkCancel(){
                this.visibleOkCancel = true;
                this.visibleDetList = false;
            },
            cancel(){
                this.visibleOkCancel = false;
            },
            deleteFileFolder(){
                if(this.visibleCommon){
                    console.log("11121322")
                    this.$store.dispatch("POST_DELETE_FILE",this.deleteFileParams).then((res)=>{
                        this.visibleOkCancel = false;
                        this.getData();
                    })
                }else{
                    console.log("55")
                    this.$store.dispatch("POST_DELETE_FOLDER",this.deleteFolderParams).then((res)=>{
                        this.visibleOkCancel = false;
                        this.getData();
                    })
                }
            },
            //重命名文件
            renameFile(){
                
                this.visibleDetList = false;
                this.visibleRename = true;
            },
            renameFileSend(){
                let renameFileName = `${localStorage.folderPath? localStorage.folderPath:''}${this.renameFileParams.renameDestKey}`
                this.renameFileParams.destKey = renameFileName
                this.$store.dispatch("POST_RENAME_FILE",this.renameFileParams).then((res)=>{
                    this.visibleRename = false;
                    this.getData();
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
            drag(e){
                console.log("1123")
                e.preventDefault();
                var target = document.getElementById('attribute-box');
                let disX = e.clientX - target.offsetLeft;
                let disY = e.clientY - target.offsetTop;
                document.onmousemove = (evt)=> { 
                    evt.preventDefault();
                    let left = evt.clientX - disX;    
                    let top = evt.clientY - disY;
                    this.top = top;
                    this.left = left;
                };
                document.onmouseup = () => {
                    document.onmousemove = null;
                };
            },

        },
        mounted(){
            this.getData();
            window.oncontextmenu = ()=>{
                event.preventDefault()
            }
        },
    }
</script>

<style lang="scss">
    .manage_container{
        .folder-box{
            display: flex;
            height: 300px;
            margin: 30px 0 0 200px; 
            flex-wrap: wrap;
            // background-color: #fff;
            .folder{
                display: flex;
                height: 85px;
                flex-flow: column;
                align-items: center;
                margin-right: 10px;
                padding: 5px;
                align-items: center;
                .folderImg{
                    width: 60px;
                    height: 55px;
                }
                .fileName{
                    text-align: center;
                }
                &.active{
                    background-color: #ccc;
                }
            }
        }
        .card-box{
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin:10px;
            width:auto;
            background-color: #ebebeb;
            .contextmenu{
                position: fixed;
                background-color: #fff;
                border: 1px solid #ccc;
                // text-align: center;
                li:hover{
                    background-color: #ccc;
                }
                li{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    min-width: 140px;
                    padding: 10px;
                    // text-align: center;
                    border-bottom: 1px solid #ccc;
                    i{
                        width: 10px;
                    }
                    
                }
                li:nth-last-child(1){
                    border-bottom: 1px solid transparent;
                }
                .change-save{
                    position: relative;
                    .change-save-type{
                        width: 215px;
                        padding: 10px 7px;
                        border: 1px solid #ccc;
                        position: absolute;
                        top: -1px;
                        right: -215px;
                        background-color: #fff;
                    }
                }
                .news{
                    position: relative;
                    .newsContent{
                        background-color: #fff;
                        border: 1px solid #ccc;
                        position: absolute;
                        top: -1px;
                        right: -142px;
                        >li{
                            display: flex;
                            justify-content: space-around;
                            height: 39px;
                        }
                    }

                }
            }
        }
    }
</style>


