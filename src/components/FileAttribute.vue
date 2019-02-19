<template>
    <div>
        <ul 
        id="attribute-box" 
        :style="{left:left+'px',top:top+'px'}">
            <li 
            class="closeBtn"
            @mousedown="onDrag">
                <span >{{handleFile(attributeTitle)}}属性</span>
                <i @click="closeBtn()" class="fa fa-close"></i>
            </li>
            <li class="formItem">
                <el-form>
                    <el-form-item 
                        label="类型">
                        <span class="comlabel">
                            {{propertyData.mimeType}}
                        </span>
                    </el-form-item>
                    <el-form-item 
                        label="大小">
                        <span class="comlabel">
                            {{propertyData.fsize|fileSize}}
                        </span>
                    </el-form-item>
                    <el-form-item 
                        label="上传时间">
                        <span class="comlabel">
                            {{propertyData.putTime|formatDate}}
                        </span>
                    </el-form-item>
                </el-form>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name:"stockDetail",
        data(){
            return{
            }
        },
        props:['attributeTitle','propertyData','onDrag','left','top'],
        created(){  
        },
        mounted() {
        },
        methods:{
            handleFile(val){
                let index = val.lastIndexOf('/');
                let len = val.length
                let fileName = val.substring(index+1, len)
                return fileName;
            },
            closeBtn(){
                let data = {
                    propertyShow:false
                }
                this.$emit("onClose",data)
            },
        },
        watch:{
            
        },
    }
</script>

<style lang="scss">
    #attribute-box{
        width: 280px;
        background-color: #fff;
        border:1px solid #ccc;
        position:fixed;
        left:0;
        top:0;
        padding: 10px;
        border-radius: 8px;
        :nth-child(1){
            
        }
        .closeBtn{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            background-color:#e0e0e0;
            position: absolute;
            top: 0;
            left: 0;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            padding: 5px;
        }
        .formItem{
            margin-top: 30px;
        }
        .comlabel{
            color: #8B8B7A;
        }
    }
</style>
