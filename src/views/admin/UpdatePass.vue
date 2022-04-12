<template>

    <el-container>
        <el-main style="margin: 0 0 0 10rem" >

            <div style="padding-top: 100px;width: 500px;margin: auto auto;">


                    <el-form :model="passForm" :rules="formRule" ref="passForm" style="background: #fff;padding: 20px 20px;">
                        <h1 style="text-align: center">修改密码</h1>


                        <el-form-item prop="oldp">
                            <el-input placeholder="格式：6-20位数字或者字符组成" v-model="passForm.oldp" type="password" >
                                <template slot="prepend" >原密码：</template>
                            </el-input>
                        </el-form-item>

                        <el-form-item  prop="newp">
                            <el-input placeholder="格式：6-20位数字或者字符组成" v-model="passForm.newp"  type="password" >
                                <template slot="prepend">新密码：</template>
                            </el-input>
                        </el-form-item >

                        <el-form-item  prop="newp2">
                            <el-input placeholder="格式：6-20位数字或者字符组成" v-model="passForm.newp2"   type="password" >
                                <template slot="prepend">确认密码：</template>
                            </el-input>
                        </el-form-item>



                        <el-form-item style="text-align: center">
                            <p v-if="msg" style="color:red">{{msg}}</p>
                            <el-button type="primary" @click="submit">确定修改</el-button>
                        </el-form-item>
                    </el-form>


            </div>






        </el-main>




    </el-container>

</template>

<script>
    import {AdminUpdateUpass,EmpUpdateUpass,UserUpdateUpass} from '../../api'

    let uid=JSON.parse(localStorage.lander).id;
    let lander=JSON.parse(localStorage.lander);

    export default {
        name: "passList",
        data() {
            return {


                msg:'',
                passForm: {
                    oldp: '',
                    newp : '',
                    newp2:'',
                    id:'',

                },

                formRule: {
                    oldp: [{required: true, message: '不能为空', trigger: 'blur'}],
                    newp: [{required: true, message: '不能为空', trigger: 'blur'}],
                    newp2: [{required: true, message: '不能为空', trigger: 'blur'}],
                },

            }
        },
        methods: {





            submit () {

                this.passForm.id=uid;
                let oldp=this.passForm.oldp;
                let newp=this.passForm.newp;
                let newp2=this.passForm.newp2;

                let myreg = /^(\w){6,20}$/;
                if (!myreg.test(oldp)) {
                    this.$message('原密码格式错误')
                    return false;
                }
                if (!myreg.test(newp)) {
                    this.$message('新密码格式错误')
                    return false;
                }
                if (!myreg.test(newp2)) {
                    this.$message('确认密码格式错误')
                    return false;
                }


                this.$refs.passForm.validate(valid => {

                    //表单验证失败
                    if (!valid) {
                        //提示语
                        this.$message("请按提示填写表单");
                        return false;
                    }else{
                        if(lander.loginType == "admin"){
                            AdminUpdateUpass(this.passForm).then(res=>{
                                this.msg=res.data.msg;
                                if(res.data.status===1){
                                    this.passForm={};
                                    this.$message({
                                        message:res.data.msg,
                                        type: 'success'
                                    });
                                }else{
                                    this.$message.error(res.data.msg);
                                }


                            });
                        }else if(lander.loginType == "sender"){
                            console.log("修改配送员密码")
                            EmpUpdateUpass(this.passForm).then(res=>{
                                this.msg=res.data.msg;
                                if(res.data.status===1){
                                    this.passForm={};
                                    this.$message({
                                        message:res.data.msg,
                                        type: 'success'
                                    });
                                }else{
                                    this.$message.error(res.data.msg);
                                }
                            });
                        }else{
                            UserUpdateUpass(this.passForm).then(res=>{
                                this.msg=res.data.msg;
                                if(res.data.status===1){
                                    this.passForm={};
                                    this.$message({
                                        message:res.data.msg,
                                        type: 'success'
                                    });
                                }else{
                                    this.$message.error(res.data.msg);
                                }
                            });
                        }

                    }
                });

            },



        },
        mounted(){
            // const that = this;



        }
    }
</script>

<style scoped>
    .el-main {
        width: 125rem;
        z-pageNo: 100;
        position: relative;
        background-color: #f3f3f3;
        color: #333;
        height: calc(100vh - 80px);
        height: 100vh ;
    }
</style>



