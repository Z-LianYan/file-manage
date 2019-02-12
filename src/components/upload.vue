<template>
    <div>

        <!-- <input type="button" value="按钮" @contextmenu="show()"/> 
        <input type="button" value="按钮1" @contextmenu.prevent="show1()"/> -->
        <el-input type="button" @contextmenu="show()" value="123"></el-input>
        <el-input type="button" @contextmenu.prevent="show1()" value="789"></el-input>

    </div>
</template>

<script>
  export default {
    data() {
      return {
        
      };
    },
    methods:{
      show(){
        console.log("666")
      },
      show1(){
        console.log("888")
      }
    }
  }
</script>

<style lang="scss">

</style>
