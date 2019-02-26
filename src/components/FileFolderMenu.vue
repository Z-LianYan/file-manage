<template>
    <div>
        <ul 
        class='contextmenu'
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
                    <el-radio-group v-model="changeSaveParams.newType" @change="onSaveChange">
                        <el-radio :label="0">普通存储</el-radio>
                        <el-radio :label="1">低频存储</el-radio> 
                    </el-radio-group>
                </div>
            </li>
            <li 
            @click="onCopyFile" 
            :data-clipboard-text="dataClipboard" 
            v-show="visibleCommon">
                <i></i>
                <span>复制</span>
                <i></i>
            </li>
            <li @click="onRenameFile" v-show="visibleCommon">
                <i></i>
                <span>重命名</span>
                <i></i>
            </li>
            <li @click="onCut" v-show="visibleCommon">
                <i class="fa fa-cut"></i>
                <span>剪切</span>
                <i></i>
            </li>
            <li @click="onDelete">
                <i class="fa fa-trash-o"></i>
                <span>删除</span>
                <i></i>
            </li>
            <li @click="onShowAttribute" v-show="visibleCommon">
                <i></i>
                <span>属性</span>
                <i></i>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name:"stockDetail",
        data(){
            return{
                saveType:false
            }
        },
        props:[
            'left',
            'top',
            'changeSaveParams',
            'visibleCommon',
            'onSaveChange',
            'onCopyFile',
            'onRenameFile',
            'onDelete',
            'onShowAttribute',
            'dataClipboard',
            'onCut'
        ],
        created(){  
        },
        mounted() {
            
        },
        methods:{
            //更改存储类型
            changeSaveTpye(){
                this.saveType = true;
            },
            outSaveType(){
                this.saveType = false;
            },
        },
    }
</script>

<style lang="scss">

</style>
