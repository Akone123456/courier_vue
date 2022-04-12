<template>
    <el-header>
        <h1 style="color: #ffffff;"><img src="/adminimg/logo.gif" style="width:30px;margin-right: 20px;"/>校园快递代收系统</h1>
        <div style="position: absolute; top: 1rem; right: 5rem; cursor: pointer;" >
        <el-dropdown trigger="click">
            <span class="el-dropdown-link"  style="color: #ffffff;">
             你好， {{lander.loginType =='sender'?lander.realname:lander.username}}
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="tuiChu"
                >退出登录</el-dropdown-item
                >
            </el-dropdown-menu>
        </el-dropdown>
    </div>
    </el-header>
</template>

<script>
    export default {
        name: "Header",
        data() {
            return {
                lander: {},
            }
        },
        methods:{
            tuiChu() {
                const that = this
                if(that.lander.loginType == 'userinfo'){
                    localStorage.removeItem('lander')
                    that.$router.replace('userLogin')
                }else{
                    localStorage.removeItem('lander')

                    that.$router.replace('Login')
                }

            },
        },
        mounted(){

            try{
                let lander=JSON.parse(localStorage.lander);
                if (lander!=null) {
                    console.log(lander)
                    this.lander=lander;
                }else {
                    this.$router.replace('Login');
                }
            }catch(e){
                this.$router.replace('Login');

            }
        }
    }
</script>

<style scoped>
    .el-header{
        display: block;
        z-index: 10;
        position: fixed;
        width:100%;
        top: 0px;
        background-color:rgb(84, 92, 100);
         line-height: 2rem;
        color: #fff;


    }
</style>
