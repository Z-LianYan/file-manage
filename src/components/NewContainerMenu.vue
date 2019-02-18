<template>
    <div>
        <ul
        class='contextmenu' 
        :style="{left:left+'px',top:top+'px'}">
            <li 
            class="news"
            @mouseover="overNews()" 
            @mouseout="outNews()">
                <i class="el-icon-plus"></i>
                <span>新建</span>
                <i class="fa fa-angle-right"></i>
                <ul class="newsContent" v-show="visibleNews">
                    <li @click="createFold">文件夹</li>
                </ul>
            </li>
            <li @click="OnPasteFile(0)">
                <i></i>
                <span>粘贴</span>
                <i></i>
            </li>
            <li @click="refresh">
                <i></i>
                <span>刷新</span>
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
                visibleNews:false
            }
        },
        props:['left','top','onCreateFold','OnPasteFile'],
        created(){  
        },
        mounted() {
        },
        methods:{
            overNews(){
                this.visibleNews = true;
            },
            outNews(){
                this.visibleNews = false;
            },
            createFold(){
                let data = {
                    visibleCreate:true,
                    visibleMenuList:false,
                }
                this.$emit("onCreateFold",data)
            },
            refresh(){
                window.location.reload();
            },
        },
    }
</script>

<style lang="scss">

</style>
