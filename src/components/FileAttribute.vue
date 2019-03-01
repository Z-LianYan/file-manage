<template>
    <div>
        <ul 
        id="attribute-box" 
        :style="{left:left_s+'px',top:top_s+'px'}">
            <li 
            class="closeBtn"
            @mousedown="onDrag">
                <span >{{attributeTitle|fileName}}属性</span>
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
                        label="外链">
                        <span class="comlabel"
                        v-clipboard:copy="outSideChain"
                        v-clipboard:success="onCopyFile">
                            {{attrOutsideChain}}
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
    import {Message} from 'element-ui';
    export default {
        name:"stockDetail",
        data(){
            return{
                outSideChain:'',
                left_s:'',
                top_s:''
            }
        },
        props:['attributeTitle','propertyData','lefts','tops','attrOutsideChain'],
        created(){  
        },
        mounted() {
        },
        methods:{
            closeBtn(){
                let data = {
                    propertyShow:false
                }
                this.$emit("onClose",data)
            },
            onCopyFile(){
                Message({
                    type:'success',
                    message:'外链已复制到粘贴板'
                })
            },
            onDrag(e){
                e.preventDefault();
                var target = document.getElementById('attribute-box');
                let disX = e.clientX - target.offsetLeft;
                let disY = e.clientY - target.offsetTop;
                document.onmousemove = (evt)=> { 
                    evt.preventDefault();
                    let lefts = evt.clientX - disX;    
                    let tops = evt.clientY - disY;
                    this.top_s = tops;
                    this.left_s = lefts;
                };
                document.onmouseup = () => {
                    document.onmousemove = null;
                };
            },
        },
        watch:{
            attrOutsideChain(){
                this.outSideChain = this.attrOutsideChain + `?rm=${Math.floor(Math.random()*100000)}`
            },
            lefts(){
                this.left_s = this.lefts;
                this.top_s = this.tops;
            }
        },
    }
</script>

<style lang="scss">
    #attribute-box{
        min-width: 350px;
        background-color: #fff;
        border:1px solid #ccc;
        position:fixed;
        left:0;
        top:0;
        padding: 10px;
        border-radius: 8px;
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
            // width: 250px;
        }
        .comlabel{
            color: #8B8B7A;
        }
    }
</style>
