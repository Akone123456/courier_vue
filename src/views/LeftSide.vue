<template>

    <el-col :span="12" style="position:fixed;left:0;width:11rem;top:4rem;z-index:999">
        <el-menu
                router :default-active="this.$route.path"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                background-color="#545c64"
                text-color="#fff"
                style="height:60rem;"
                mode="vertical"
                active-text-color="#ffd04b">


            <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name">



                <template slot="title" >
                    <i :class="item.navClass"></i>
                    <span> {{ item.navItem }}</span>
                </template>


            </el-menu-item>



        </el-menu>

    </el-col>

</template>

<script>

    export default {
        name: "LeftSide",
        data() {
            return {
                navList: [],
                navList2: [],
                lander:{},
            }
        },methods :{
            handleOpen(key, keyPath)
            {
                console.log(key, keyPath);
            }
        ,
            handleClose(key, keyPath)
            {
                console.log(key, keyPath);
            }
        },
        mounted()
        {
            let lander = JSON.parse(localStorage.lander);
            this.lander=lander;
            if(lander.loginType == 'sender'){
                this.navList = [
                    {name: '/AdminOrderList', navItem: '接单大厅', navClass: 'el-icon-bell'},
                    {name: '/AdminUpdatePass', navItem: '修改密码', navClass: 'el-icon-key'},
                    {name: '/SenderCenter', navItem: '个人中心', navClass: 'el-icon-user-solid'},
                    {name: '/SenderOrder', navItem: '我的订单', navClass: 'el-icon-menu'},
                    {name: '/SenderEvaluation', navItem: '我的评价', navClass: 'el-icon-s-comment'},
                ];
            }else if(lander.loginType == 'admin'){
                this.navList = [
                    {name: '/AdminSenderList', navItem: '配送员管理', navClass: 'el-icon-s-custom'},
                    {name: '/AdminUsersList', navItem: '普通用户', navClass: 'el-icon-user-solid'},
                    {name: '/AdminUpdatePass', navItem: '修改密码', navClass: 'el-icon-key'},
                    {name: '/AdminCenter', navItem: '个人中心', navClass: 'el-icon-user-solid'},
                ];
            }else{
                this.navList = [
                    {name: '/MyCenter', navItem: '基本信息', navClass: 'el-icon-s-custom'},
                    {name: '/AdminUpdatePass', navItem: '修改密码', navClass: 'el-icon-key'},
                    {name: '/PersonCenter', navItem: '个人中心', navClass: 'el-icon-user-solid'},
                    {name: '/AddressManger', navItem: '地址管理', navClass: 'el-icon-s-promotion'},
                    {name: '/Order', navItem: '我的订单', navClass: 'el-icon-menu'},
                    {name: '/OrderImmediately', navItem: '立即下单', navClass: 'el-icon-shopping-cart-full'},
                    {name: '/Evaluation', navItem: '我的评价', navClass: 'el-icon-s-comment'},
                ];
            }

            }



    }
</script>

<style scoped>

</style>
