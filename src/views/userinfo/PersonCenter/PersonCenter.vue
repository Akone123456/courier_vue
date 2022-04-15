<template>
  <div class="personCenter">
    <el-card style="width: 600px;height: 600px" shadow="hover">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="头像" prop="photo">
          <el-upload
              class="avatar-uploader"
              action="http://localhost:8011/admin/userinfo/upimg"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
            <img v-if="ruleForm.photo" :src="ruleForm.photo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="账号" prop="userName" style="width: 90%;">
          <el-input v-model="ruleForm.userName" clearable  placeholder="账号" disabled prefix-icon="el-icon-s-custom"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone" style="width: 90%;">
          <el-input v-model="ruleForm.phone" clearable placeholder="手机号" prefix-icon="el-icon-tickets"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="note" style="width: 90%;">
          <el-input v-model="ruleForm.note" clearable placeholder="简介" prefix-icon="el-icon-tickets"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button  @click="dialogFormVisible=true">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-card>


    <el-dialog title="修改密码"
               :visible.sync="dialogFormVisible"
               append-to-body
               close-on-click-modal
               width="30%"
               style="text-align: center">

      <el-form :model="form"
               status-icon
               :rules="rulesPass"
               ref="formPass"
               label-width="100px"
               class="demo-ruleForm">

        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="password" v-model="form.oldPassword" ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="form.newPassword" ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input type="password" v-model="form.checkPassword" ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" style="text-align: center;padding-top: 0">
        <el-button @click="exitPassword('formPass')">退出</el-button>
        <el-button type="primary" @click="modifyPassword('formPass')">修改</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {exitUser,changePwd,getUser} from '../../../api/Consumer/Consumer'
export default {
  name: "PersonCenter",
  data(){
    let validateNewPass = (rule , value , callback) =>{
      if (value === ''){
        callback(new Error("请输入旧密码"))
      }else if(value.length < 6){
        callback(new Error("密码不能小于6位"))
      }else if(value.length > 16){
        callback(new Error("密码不能超过16位"))
      }else
        callback()
    }
    let validatePass = (rule, value, callback) => {

      if (value === '') {
        callback(new Error('请输入密码'));
      }
      else if (value === this.form.oldPassword){
        callback("新密码和旧密码不能一样")
      }
      else {
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    var validateAttach = (rule, value, callback) => {
      if (value === undefined){
        callback(new Error("上传图片不能为空"))
      }
      callback()
    }
    return{
      form:{
        oldPassword:'',
        newPassword:'',
        checkPassword:''
      },
      rulesPass: {
        oldPassword: [
          {required:true,validator: validateNewPass, trigger:'blur'}
        ],
        newPassword: [
          {required:true,validator: validatePass, trigger: 'blur'}
        ],
        checkPassword: [
          {required:true,validator: validatePass2, trigger: 'blur'}
        ]
      },

      dialogFormVisible:false,
      formLabelWidth: '120px',
      ruleForm:{
        id:'',
        avatarImg:'',
        phone:'',
        photo:'',
        username:''
      },
      rules: {
        photo: [
          {required: true, validator: validateAttach, trigger: 'blur'},
        ],
        phone:[
          {required: true, message: '电话不能为空' , trigger: 'blur'},
          {required: true,min:11,max:11, message: '电话必须为11位' , trigger: 'blur'},
        ],
        userName:[
          {required: true, message: '账号不能为空' , trigger: 'blur'},
        ]
      }
    }
  },
  methods:{
    exitPassword(formName){
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false
    },
    modifyPassword(formName){
      this.$refs[formName].validate((valid) =>{
        if(valid){
          let query = {
            userId: this.ruleForm.id,
            originalPassword:this.form.oldPassword,
            newPassword:this.form.newPassword,
            confirmPassword:this.form.checkPassword
          }
          console.log(query)
          changePwd(query).then(res=>{
            if(res.data.status === 0){
              // 退出dialog，重置表单
              this.exitPassword(formName)
              this.$message.success(res.data.msg)
            }else{
              this.$message.error(res.data.msg)
            }
          })

        }else {
          return false
        }
      })
    },
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let query = {
            username:this.ruleForm.username,
            userId:this.ruleForm.userId,
            phone:this.ruleForm.phone,
            photo:this.ruleForm.photo,
            note:this.ruleForm.note
          }
          exitUser(query).then(res=>{
            console.log(res)
            if(res.data.status === 0){
              this.$message.success("修改成功")
            }else{
              this.$message.error("修改失败")
            }
          })
        } else {
          return false;
        }
      })
    },
    resetForm(formName){
      this.$refs[formName].resetFields();
    },
    handleAvatarSuccess(res){
      if (res.status === 1){
        console.log(res)
        this.ruleForm.photo =process.env.VUE_APP_BASE_URL+ res.obj
        this.$message.success(res.msg)
      }else {
        this.$message.error(res.msg)
      }
    },
    beforeAvatarUpload(file){
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('轮播图只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('轮播图大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    exitUserInfo(){

    },
    getUserById(id){
      getUser(id).then(res=>{
        console.log(res.data)
        if (res.data.status === 0){

          this.ruleForm = res.data.data
        }
      })
    }
  },
  mounted() {
    try{
      let lander=JSON.parse(localStorage.lander);
      // console.log(lander)
      console.log(lander.id)
      this.getUserById(lander.id)
    }catch(e){
      this.$router.replace('userLogin');

    }
  }
}
</script>

<style scoped>
.personCenter{
  margin-top: 100px;
  margin-left: 200px;
  width: 90%;
  height: auto;
  display: inline-block;
}
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}
.avatar-uploader :hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
