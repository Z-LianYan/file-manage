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
                    <el-upload
                    class="upload-demo"
                    action="/API/common/upload"
                    multiple
                    :limit="3"
                    :on-success="handleAvatarSuccess">
                        <el-button type='text' class="el-icon-upload2"></el-button>
                    </el-upload>
                </el-col>
            </el-row>
            <el-row>
                <div class="folder-box" @contextmenu="menuContainer">
                    <div 
                    v-for="(item,idx,key) in this.resouceData.commonPrefixes"
                    :key="key"
                    class="folder"
                    @dblclick="openFolder(item)"
                    @contextmenu.prevent.stop="showRightMenu(item)">
                        <img 
                        src="@/assets/img/folder.png" 
                        alt="" 
                        class="folderImg"/>
                        <span class="fileName">{{handleFolder(item,idx)}}</span>
                    </div>
                    <div 
                    v-for="(item,index) in this.resouceData.items"
                    :key="index"
                    class="folder"
                    @contextmenu.prevent.stop="showRightMenu(item)">
                        <img 
                        :src="getIconSrc(item)" 
                        alt="" 
                        class="folderImg"/>
                        <span 
                            class="fileName">
                            {{handleFile(item.key)}}
                        </span>
                    </div>

                </div>
                
                
            </el-row>

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
                <!-- <li @click="deleteFile()">删除</li> -->
                <li @click="deleteFileFolder()">
                    <i class="fa fa-trash-o"></i>
                    <span>删除</span>
                    <i></i>
                </li>
                <li @click="onProperty(requestParams.prefix)" v-show="visibleCommon">
                    <i></i>
                    <span>属性</span>
                    <i></i>
                </li>
            </ul>

            <ul 
            id="attribute-box" 
            v-show="propertyShow" 
            @mousedown="move"
            :style="{left:left+'px',top:top+'px'}">
                <li 
                class="closeBtn">
                    <span >{{handleFile(attribute)}}属性</span>
                    <i @click="closeBtn()" class="fa fa-close"></i>
                </li>
                <li>
                    <el-form>
                        <el-form-item 
                            label="类型">
                            <span
                                class="comlabel">
                                {{propertyData.mimeType}}
                            </span>
                        </el-form-item>
                        <el-form-item 
                            label="大小">
                            <span
                                class="comlabel">
                                {{propertyData.fsize}}
                            </span>
                        </el-form-item>
                        <el-form-item 
                            label="上传时间">
                            <span
                                class="comlabel">
                                {{propertyData.putTime}}
                            </span>
                        </el-form-item>
                    </el-form>
                </li>
            </ul>

            <ul
            class='contextmenu' 
            v-show="visibleMenuList"
            :style="{left:left+'px',top:top+'px'}">
                <li 
                class="news"
                @mouseover="overNews()" 
                @mouseout="outNews()">
                    <i class="el-icon-plus"></i>
                    <span>新建</span>
                    <i class="fa fa-angle-right"></i>
                    <ul class="newsContent" v-show="visibleNews">
                        <li>文件夹</li>
                    </ul>
                </li>
            </ul>

        </el-card>



       

    </div>
</template>

<script>
    import moment from 'moment';
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
                    files:[{name:''}]
                },
                deleteFolderParams:{
                    folder_name:""
                },
                createFolderParams:{
                    folder_name:''
                },
                resouceData:'',
                visibleDetList:false,
                propertyShow:false,
                visibleNews:false,
                visibleCommon:true,
                visibleMenuList:false,
                left:"",
                top:"",
                history:[],
                propertyData:{},
                saveType:false,
                attribute:''
            }
        },
        created(){  
        },
        methods:{
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
                let len = val.length
                let fileName = val.substring(index+1, len)
                return fileName;
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
                console.log("123")
            },
            menuContainer(){
                console.log("11111")
                this.visibleMenuList = true;
                this.left = event.clientX;
                this.top = event.clientY;
            },
            showRightMenu(itm){
                console.log("e")
                console.log("123456",itm instanceof Object);
                console.log("123",itm);
                this.visibleCommon = true;
                // if(itm instanceof Object){
                //     this.propertyParams.filename = itm.key;
                //     this.changeSaveParams.filename = itm.key;
                //     this.changeSaveParams.newType = itm.type;
                //     this.attribute = itm.key
                //     this.deleteFileParams.files.map((item,index)=>{
                //         item.name = itm.key
                //     })
                // }else{
                //     this.visibleCommon = false
                //     this.deleteFolderParams.folder_name = itm
                // }
                let itmStr = new String(itm)
                if(itm instanceof Object){
                    this.propertyParams.filename = itm.key;
                    this.changeSaveParams.filename = itm.key;
                    this.changeSaveParams.newType = itm.type;
                    this.attribute = itm.key
                    this.deleteFileParams.files.map((item,index)=>{
                        item.name = itm.key
                    })
                }else if(itmStr instanceof String){
                    this.visibleCommon = false
                    this.deleteFolderParams.folder_name = itm
                }




                this.visibleDetList = true;
                this.left = event.clientX;
                this.top = event.clientY;
            },
            openFolder(val){
                console.log("abc",val)
                this.history.push(val);
                localStorage.setItem('folderPath',val)
                console.log('folderPath',localStorage.folderPath)
                console.log("efg",this.history);
                this.requestParams.prefix = val;
                this.getData();
            },
            handleFolder(i,idx){
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
                localStorage.folderPath = this.history[len]
                console.log("666",this.requestParams.prefix);
                this.getData();
            },
            //获取文件详情
            onProperty(){
                this.propertyShow = true;
                this.$store.dispatch("POST_RESOURCE_DETAIL",this.propertyParams).then((res)=>{
                    console.log("resProperty",res);
                    this.propertyData = res.data;
                })
            },
            closeBtn(){
                this.propertyShow = false;
            },
            //更改存储类型
            changeSaveTpye(){
                this.saveType = true
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
                    this.getData();
                }) 
            },
            overNews(){
                this.visibleNews = true;
            },
            outNews(){
                this.visibleNews = false;
            },
            //创建文件夹
            createFold(){
                this.$store.dispatch("POST_DELETE_FILE",this.createFolderParams).then((res)=>{
                    this.getData();
                })
            },
            //删除文件$文件夹
            deleteFileFolder(){
                if(this.visibleCommon){
                    this.$store.dispatch("POST_DELETE_FILE",this.deleteFileParams).then((res)=>{
                        this.getData();
                    })
                }else{
                    this.$store.dispatch("POST_DELETE_FOLDER",this.deleteFolderParams).then((res)=>{
                        this.getData();
                    })
                }
            },
            move(e){
                e.preventDefault();
                var target = document.getElementById('attribute-box');
                let disX = e.clientX - target.offsetLeft;
                let disY = e.clientY - target.offsetTop;
                document.onmousemove = (evt)=> { 
                    e.preventDefault();
                    let left = evt.clientX - disX;    
                    let top = evt.clientY - disY;
                    this.top = top;
                    this.left = left;
                };
                document.onmouseup = () => {
                    document.onmousemove = null;
                };
            },
            handleAvatarSuccess(res, file) {
                console.log('res',res,'file',file)
                this.imageUrl = URL.createObjectURL(file.raw);
            },  

        },
        mounted(){
            this.getData();
            if(!this.visibleDetList){
                addEventListener("click",()=>{
                    this.visibleDetList = false;
                })
            }
            if(!this.visibleMenuList){
                addEventListener("click",()=>{
                    this.visibleMenuList = false;
                })
            }
            window.oncontextmenu = ()=>{
                event.preventDefault()
            }
            
        },
    }
</script>

<style lang="scss">
    .manage_container{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        .folder-box{
            display: flex;
            height: 300px;
            margin: 30px 0 0 200px; 
            // background-color: #fff;
            flex-wrap: wrap;
            flex: 1;
            .folder{
                display: flex;
                height: 75px;
                flex-flow: column;
                margin-right: 20px;
                .folderImg{
                    width: 60px;
                    height: 55px;
                }
                .fileName{
                    text-align: center;
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
                        min-width: 140px;
                        border: 1px solid #ccc;
                        position: absolute;
                        top: -1px;
                        right: -142px;
                    }

                }
                
            }
            #attribute-box{
                width: 250px;
                background-color: #fff;
                border:1px solid #ccc;
                position:fixed;
                left:0;
                top:0;
                padding: 10px;
                .closeBtn{
                    display: flex;
                    justify-content: space-between;
                    text-align: right;
                    margin-top: -5px;
                }
                .comlabel{
                    color: #8B8B7A;
                }
            }
        }
    }
    
</style>
