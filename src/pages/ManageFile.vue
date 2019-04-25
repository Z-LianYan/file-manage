<template>
    <div class="manage_container">
        <el-card class="card-box">
            <HeaderCom
            :requestParams='requestParams'
            :history='history'
            :onGetData='getData'/>
            <div 
            class="folder-box" 
            :class="isUploadStatus? 'active':''"
            @contextmenu="menuContainer"
            @click="comEvent"
            @drop="uploadFile($event)">
                <ul>
                    <li 
                    v-for="(item,index,key) in this.resouceData.commonPrefixes"
                    :key="key"
                    class="folder"
                    :class="selectFolderIdx==index? 'active':''"
                    @dblclick="openFolder(item)"
                    @contextmenu.prevent.stop="showRightMenu(item,index)"
                    @click.stop="onSelectedFolder(index)"
                    @mousedown="onSelectedFolder(index)"
                    @dragenter="dragEnterFolder($event,item,index)"
                    @dragleave="dragLeaveFolder($event,item)">
                        <img 
                        src="@/assets/img/folder.png" 
                        alt="" 
                        class="folderImg"/>
                        <span class="fileName">{{item|folderName}}</span>
                    </li>
                </ul>
                <ul ref="parent">
                    <li 
                    v-for="(item,index) in this.resouceData.items"
                    :key="index"
                    class="folder"
                    id="file_name_item"
                    :class="selectFileIdx == index? 'active':''"
                    @dblclick="openFile(item)"
                    draggable="true"
                    @contextmenu.prevent.stop="showRightMenu(item,index)"
                    @click.stop="onSelectedFile($event,index)"
                    @mousedown="fileDown(index)"
                    @dragstart="dragStartFile($event,item,index)">
                        <img 
                        :src="getIconSrc(item)" 
                        alt="" 
                        class="folderImg"/>
                        <span class="fileName">
                            {{item.key|fileName}}
                        </span>
                    </li>
                </ul>
            </div>
            <FileFolderMenu
            :left='left'
            :top='top'
            :changeSaveParams='changeSaveParams'
            :onGetData='getData'
            @onCloseMenu='closeMenuFF'
            v-show="visibleDetList"
            :copySrcKey='copySrcKey'
            @on_copy_file='_copy_file'
            :visibleCommon='visibleCommon'
            :onRenameFile='renameFile'
            :onDelete="OkCancel"
            :onShowAttribute='showAttribute'
            :dataClipboard='dataClipboard'
            :onCut='cut'
            @onOutSideChain='_outside_chain'
            :outsideChain='outsideChain'/>
            <FileAttribute 
            v-show='propertyShow' 
            :attributeTitle='attribute' 
            :propertyData='propertyData' 
            @onClose="closeBtn" 
            :lefts='left'
            :tops='top'
            :attrOutsideChain='attrOutsideChain'/>
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
            <NewFolder
            :onGetData='getData'
            @onCancelFolder='cancelFolder'/>
        </el-dialog>

        <el-dialog
        :visible.sync="isVisibleImg"
        :modal-append-to-body="false"
        align='center'
        width='50%'
        @close="closeImg">
            <img :src="imgSrc" alt="">
        </el-dialog>

        <el-dialog
        :visible.sync="visibleRename"
        :modal-append-to-body="false"
        width='30%'>
            <RenameFile
            :renameFileParams='renameFileParams'
            :onGetData='getData'
            @onCancelRename='cancelRename'/>
        </el-dialog>

        <el-dialog
        :visible.sync="visibleOkCancel"
        :modal-append-to-body="false"
        align='center'
        width='30%'>
            <Delete
            :visibleOkCancel='visibleOkCancel'
            :visibleCommon='visibleCommon'
            :deleteFileParams='deleteFileParams'
            :deleteFolderParams='deleteFolderParams'
            :onGetData='getData'
            @cancelDel='cancel'
            :delFileName='delFileName'/>
        </el-dialog>
        <el-dialog
        :visible.sync="visibleRenameFileExists"
        :modal-append-to-body="false"
        align="center"
        width='20%'>
            <ReplaceFile
            :moveFiles='renameFileParams'
            :onGetData='getData'
            :onFileExists='fileExists'
            :fileNamekey='fileNamekey'
            :folderNamekey='folderNamekey'
            />
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
    import FileFolderMenu from '@/components/FileFolderMenu';
    import HeaderCom from '@/components/HeaderCom';
    import ReplaceFile from '@/components/ReplaceFile';
    import Delete from '@/components/Delete';
    import NewFolder from '@/components/NewFolder';
    import RenameFile from '@/components/RenameFile';
    var extnameMap={
        ".js":require("@/assets/img/file_icon.png"),
        ".html":require("@/assets/img/html_icon.png"),
        ".zip":require("@/assets/img/zip.png"),
    };
    var folder_icon = require("@/assets/img/file_icon.png");
    var unknow_icon = require("@/assets/img/file_icon.png");
    export default {
        name:"stockDetail",
        data(){
            return{
                folder_drop_map:{},
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
                renameFileParams:{
                    srcKey:'',
                    destKey:'',
                    isForce:0,
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
                selectedFileFolder:false,
                visibleRenameFileExists:false,
                moveFileFolder:false,
                isVisibleImg:false,
                isFileFolder:false,
                isUploadStatus:false,
                left:"",
                top:"",
                history:[],
                propertyData:{},
                attribute:'',
                selectFolderIdx:null,
                selectFileIdx:null,
                copySrcKey:'',
                copyExistsFile:'',
                createFileData:{
                    files:[{
                        name:"",
                        key:"",
                        force:0
                    }]
                },
                fileNamekey:'',
                folderNamekey:'',
                dataClipboard:'',
                isCutCopy:true,
                staticDns:'',
                outsideChain:'',
                attrOutsideChain:'',
                imgSrc:''
            }
        },
        created(){  
        },
        components:{
            FileAttribute,
            NewContainerMenu,
            FileFolderMenu,
            HeaderCom,
            ReplaceFile,
            Delete,
            NewFolder,
            RenameFile
        },
        methods:{
            createFile(){
               this.$store.dispatch("POST_CREATE_FILE",this.createFileData).then((res)=>{
                   this.getData();
               })
            },
            getIconSrc(item){
                var extname = this.getExtName(item.key);
                return extnameMap[extname]? extnameMap[extname]:unknow_icon;
            },
            getExtName(val){
                var pointPos=val.lastIndexOf(".");
                var len=val.length;
                var suffix=val.substring(pointPos, len);
                return `${suffix}`;
            },
            openFile(item){
                let images = item.mimeType.split('/');
                if(images[0] == 'image'){
                    this.imgSrc = this.staticDns + item.key + `?rm=${Math.floor(Math.random()*1000000)}`;
                    this.isVisibleImg = true;
                }
            },
            closeImg(){
                this.imgSrc = '';
            },
            //单击选中
            onSelectedFolder(index){
                this.isFileFolder = true;
                this.visibleDetList = false;
                this.visibleMenuList = false;
                this.selectFileIdx = null;
                this.selectFolderIdx = index;
            },
            onSelectedFile(e,index){
                this.visibleDetList = false;
                this.visibleMenuList = false;
                this.selectFolderIdx = null;
                this.selectFileIdx = index;
            },
            fileDown(index){
                this.isFileFolder = false;
                this.selectFolderIdx = null;
                this.selectFileIdx = index;
            },
            uploadFile(evt){
                this.isUploadStatus = false;
                let fileData = evt.dataTransfer.files;
                let createData = this.createFileData.files;
                const formData = new FormData();
                for(var i=0; i < fileData.length; i++){
                    let fileName = fileData[i].name;
                    this.fileNamekey = fileData[i].name;
                    formData.append('file', fileData[i]);
                    new Promise((resolve,reject)=>{
                        this.$store.dispatch("POST_UPLOADING_FILE",formData).then( res => {
                            resolve(res);
                            createData.map((item,index)=>{
                                item.name = res
                                item.key = `${localStorage.folderPath ? localStorage.folderPath:''}${fileName}`
                            })
                        })
                    }).then((res)=>{
                        this.uploaderCreateFile(fileName);
                    })
                }
            },
            uploaderCreateFile(fileName){
                this.$store.dispatch('POST_CREATE_FILE',this.createFileData).then( res => {
                    var item=res.data[0];
                    if( item.error == 614 ){
                        this.isConfirmReplace(fileName);
                    }
                    if( res.error == 0 ){
                        this.getData();
                    }
                    this.createFileData.files[0].force = 0;
                })
            },
            isConfirmReplace(fileName){
                this.$confirm(`该目录中已存在${fileName}文件确定要替换吗`).then( _ => {
                    this.createFileData.files[0].force = 1;
                    this.uploaderCreateFile();
                });
            },
            dragLeaveFolder(evt,item){
                if(!this.folder_drop_map[item]){
                    this.selectFolderIdx = null;
                    document.ondragend = null;
                    return;
                }
                this.folder_drop_map[item] = false;
            },
            dragEnterFolder(evt,item,index){
                this.selectFolderIdx = index;
                if(this.folder_drop_map[item] || this.isFileFolder){
                    return;
                }
                this.folder_drop_map[item]=true;
                this.folderNamekey = item;
                this.moveFileFolder = true;
                this.renameFileParams.destKey = item + this.fileNamekey;
                document.ondragend = (e)=> {
                    this.genRename();
                }
            },
            genRename(){
                this.$store.dispatch("POST_RENAME_FILE",this.renameFileParams).then( res => {
                    this.selectFileIdx = null;
                    if( res.error == 614 ){
                        this.visibleRenameFileExists = true;
                    }
                    if(res.error == 0){
                        Message({
                            type:'success',
                            message:"成功移动文件"
                        });
                    }
                    this.getData();
                    document.ondragend = null;
                })
            },
            dragStartFile(evt,item,index){
                this.renameFileParams.srcKey = item.key;
                let idx = item.key.lastIndexOf('/');
                let len = item.key.length;
                let fileNamekey = item.key.substring(idx+1, len); 
                this.fileNamekey = fileNamekey;
            },
            fileExists(){
                this.visibleRenameFileExists = false;
                this.uploadFileExists = false;
                this.renameFileParams.destKey = '';
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
                    this.resouceData = res.data;
                    this.getStaticDns();
                })
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
                let itmStr = new String(item);
                if(item instanceof Object){
                    this.selectFileIdx = index;
                    this.selectFolderIdx = null;
                    this.propertyParams.filename = item.key;
                    this.changeSaveParams.filename = item.key;
                    this.changeSaveParams.newType = item.type;
                    this.attribute = item.key;
                    this.renameFileParams.srcKey = item.key;
                    this.delFileName = item.key;
                    this.dataClipboard = item.key;
                    this.attrOutsideChain = this.staticDns + item.key;
                    this.outsideChain = this.staticDns + item.key +`?rm=${Math.floor(Math.random()*1000000)}`;
                    this.deleteFileParams.files.map((itm,index)=>{
                        itm.name = item.key;
                    })
                    this.copySrcKey = item.key,
                    this.fileNamekey = item.key
                }else if(itmStr instanceof String){
                    this.selectFolderIdx = index;
                    this.selectFileIdx = null;
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
                this.requestParams.prefix = val;
                this.getData();
            },
            //获取文件详情
            showAttribute(){
                this.visibleDetList = false;
                this.propertyShow = true;
                this.$store.dispatch("POST_RESOURCE_DETAIL",this.propertyParams).then( res => {
                    console.log("resProperty",res);
                    this.propertyData = res.data;
                })
            },
            closeBtn(data){
                this.propertyShow = data.propertyShow;
            },
            closeMenuFF(data){
                this.visibleDetList = data.visibleDetList;
            },
            createFold(data){
                this.visibleCreate = data.visibleCreate; 
                this.visibleMenuList = data.visibleMenuList;
            },
            cancelFolder(data){
                this.visibleCreate = data.visibleCreate
            },
            //剪切
            cut(){
                this.visibleDetList = false;
                this.isCutCopy = false;
                localStorage.setItem("copySrcKey",this.copySrcKey);
            },
            //复制文件
            _copy_file(data){
                this.visibleDetList = data.visibleDetList;
                this.isCutCopy = data.isCutCopy;
            },
            handleFile(val){
                let index = val.lastIndexOf('/');
                let len = val.length;
                let fileName = val.substring(index+1, len);
                return fileName;
            },
            pasteFile(val){
                this.copyFileParams.srcKey = localStorage.copySrcKey.replace(/\s*/g,'');
                let copyDestKeyFile = this.handleFile(localStorage.copySrcKey);
                let copyDestKey = `${localStorage.folderPath? localStorage.folderPath:''}
                    ${copyDestKeyFile}`;
                this.copyFileParams.destKey = copyDestKey.replace(/\s*/g,'');
                if(this.isCutCopy){
                    if(val == 0){
                        this.copyFileParams.isForce = val;
                        this.$store.dispatch("POST_COPY_FILE",this.copyFileParams).then( res =>{
                            this.visibleMenuList = false;
                            if(res.error == 614){
                                this.copyExistsFile = res;
                                this.visibleCopyExists = true;
                            }
                            this.getData();
                        })
                    }else if( val == 1){
                        this.copyFileParams.isForce = val;
                        this.$store.dispatch("POST_COPY_FILE",this.copyFileParams).then( res =>{
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
                }else{
                    this.renameFileParams.srcKey = localStorage.copySrcKey.replace(/\s*/g,'');
                    this.renameFileParams.destKey = copyDestKey.replace(/\s*/g,'');
                    this.genRename();
                    this.isCutCopy = true;
                    this.visibleMenuList = false;
                }  
            },
            getStaticDns(){
                this.$store.dispatch('POST_STATIC_HOST').then((res)=>{
                    this.staticDns = res.data;
                })
            },
            _outside_chain(data){
                this.visibleDetList = data.visibleDetList;
            },
            replaceClose(){
                this.visibleCopyExists = false;
            },
            //删除文件&&文件夹
            OkCancel(){
                this.visibleOkCancel = true;
                this.visibleDetList = false;
            },
            cancel(data){
                this.visibleOkCancel = data.visibleOkCancel;
            },
            //重命名文件
            renameFile(){
                this.visibleDetList = false;
                this.visibleRename = true;
            },
            cancelRename(data){
                this.visibleRename = data.visibleRename;
            },
        },
        mounted(){
            this.getData();
            window.oncontextmenu = ()=>{
                event.preventDefault();
            }
            document.addEventListener('drop', function (e) {
                e.preventDefault()
            }, false)
            document.addEventListener('dragover', function (e) {
                e.preventDefault()
            }, false)
        },
    }
</script>

<style lang="scss" scope>
    .manage_container{
    .active{
        background:#ccc;
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
        // background-color: red;
        .folder-box{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin-top: 80px;
            padding-top: 20px;
            padding-left: 100px;
            .folder{
                float: left;
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
                    width: 60px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    text-align: center;

                }
                &.active{
                    background-color: #ccc;
                }
            }
        }
        .contextmenu{
            position: fixed;
            background-color: #fff;
            border: 1px solid #ccc;
            li:hover{
                background-color: #ccc;
            }
            li{
                display: flex;
                justify-content: space-between;
                align-items: center;
                min-width: 140px;
                padding: 10px;
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
