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
                <el-col :span="22">
                    <el-input 
                        v-model="requestParams.prefix"
                        @keyup.enter.native="getData()">
                    </el-input>
                </el-col>
                
            </el-row>
            <el-row class="folder-box">
                <span 
                    v-for="(i,idx,key) in this.resouceData.commonPrefixes"
                    :key="key"
                    class="folder"
                    @contextmenu="showRightMenu()"
                    @dblclick="openFolder(i)">
                    <img 
                    src="@/assets/img/folder.png" 
                    alt="" 
                    class="folderImg"/>
                    <span class="fileName">{{handleFolder(i,idx)}}</span>
                </span>
                <span 
                    v-for="(item,index) in this.resouceData.items"
                    :key="index"
                    class="folder"
                    @contextmenu="showRightMenu(item)">
                    <img 
                    :src="getIconSrc(item)" 
                    alt="" 
                    class="folderImg"/>
                    <span 
                        class="fileName">
                        {{handleFile(item.key)}}
                    </span>
                </span>
            </el-row>

            <ul 
                class='contextmenu' 
                v-show="visibleDetList" 
                :style="{left:left+'px',top:top+'px'}">
                <li>属性大风大风</li>
                <li>复旦复</li>
                <li @click="changeSaveTpye()">更改存储类型</li>
                <li @click="onProperty(requestParams.prefix)">属性</li>
            </ul>

            <ul 
                class="attribute-box" 
                v-show="propertyShow" 
                :style="{left:left+'px',top:top+'px'}">
                <li 
                    class="closeBtn" 
                    @click="closeBtn()">
                    X
                </li>
                <li>
                    <el-form
                        >
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
                                <!-- {{getTime(propertyData.putTime)}} -->
                                {{propertyData.putTime}}
                            </span>
                        </el-form-item>
                    </el-form>
                </li>
            </ul>

            <!-- <el-row>

            </el-row> -->

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
                    prefix:''
                },
                propertyParams:{
                    filename:''
                },
                changeSaveParams:{
                    filename:"",
                    newType:""
                },
                resouceData:'',
                visibleDetList:false,
                propertyShow:false,
                left:"",
                top:"",
                history:[],
                propertyData:{}
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
            getData(){
                this.$store.dispatch("POST_RESOURCE_GETLIST",this.requestParams).then((res)=>{
                    console.log("res",res);
                    this.resouceData = res.data;
                })
            },
            showRightMenu(val){
                event.preventDefault();
                
                console.log("123",val)

                this.propertyParams.filename = val.key;

                this.changeSaveParams.filename = val.key;
                this.changeSaveParams.newType = val.type;

                this.visibleDetList = true;
                this.left = event.clientX;
                this.top = event.clientY;
            },
            openFolder(val){
                console.log("abc",val)
                this.history.push(val);

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
                this.getData();
            },
            // public/private/1.0/
            
            // ["public/", "public/private/", "public/private/1.0/"]

            // public/private/1.0/

            advance(){
                console.log("888");
                let len = this.history.length-1;
                this.requestParams.prefix = this.history[len];
                console.log("666",this.requestParams.prefix);
                this.getData();
            },
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
            // getTime(val){
            //     console.log('val123',val)
            //     if(val){
            //         // let Timestamp = val.slice(-1,-8)
            //     }
                
            //     // console.log('Timestamp',Timestamp)
            //     let timeDate = moment(1548992994).format("YYYY-MM-DD HH:mm:ss")
            //     return timeDate;
            // },
            changeSaveTpye(){
                console.log("123")
                this.$store.dispatch("POST_CHANGE_SAVE_TYPE",this.changeSaveParams).then((res)=>{
                    // console.log("resProperty",res);
                    // this.propertyData = res.data;
                })
            }
        },
        mounted() {
            this.getData();
            if(!this.visibleDetList){
                addEventListener("click",()=>{
                    this.visibleDetList = false;
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
            margin: 30px 0 0 200px; 
            flex-wrap: wrap;
            .folder{
                display: flex;
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
                text-align: center;
                li{
                    padding: 10px;
                    text-align: center;
                    border-bottom: 1px solid #ccc;
                    
                }
                li:nth-last-child(1){
                    border-bottom: 1px solid transparent;
                }
            }
            .attribute-box{
                width: 300px;
                background-color: #fff;
                border:1px solid #ccc;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                padding: 15px;
                .closeBtn{
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
