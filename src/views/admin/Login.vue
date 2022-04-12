<template>
  <el-container direction="vertical"    style="background-image: url('/adminimg/back.jpg');background-size: cover">

    <el-container>
      <el-main >
      <div style="width:500px;height:auto;margin:7rem auto 0 auto;position:relative;border-radius:10px;" align="center">


          <el-tabs type="border-card">
              <h1 style="font-size: 20px;">校园快递代收系统-后台</h1>
              <el-tab-pane label="管理员" >
                  <table>
                      <tr>
                          <td><div>账号:</div></td>
                          <td  colspan="2"> <el-input v-model="username"   placeholder="请输入管理员账号" style="width:20rem;"/></td>

                      </tr>
                      <tr>
                          <td>密码:</td>
                          <td  colspan="2"> <el-input v-model="password"    show-password  placeholder="请输入密码" style="width:20rem;"/></td>

                      </tr>


                  </table>


                  <div>
                      <el-button type="primary" style="width:10rem;margin-top:2rem" @click="loginClick">登录</el-button>
                  </div>
              </el-tab-pane>
              <el-tab-pane label="配送员登录">

                  <table >



                      <div v-if="senderForm.loginType == 'zh'">
                          <tr>
                              <td>登录方式</td>
                              <td>
                                  <el-radio v-model="senderForm.loginType" label="zh"  >账号登录</el-radio>
                                  <el-radio v-model="senderForm.loginType"  label="dx"  >短信登录</el-radio>
                              </td>
                          </tr>
                          <tr>
                              <td><div>账号:</div></td>
                              <td  colspan="2"> <el-input v-model="senderForm.username"   placeholder="请输入账号" style="width:20rem;"/></td>

                          </tr>
                          <tr>
                              <td>密码:</td>
                              <td  colspan="2"> <el-input v-model="senderForm.password"    show-password  placeholder="请输入密码" style="width:20rem;"/></td>

                          </tr>
                          <p style="color:red; text-align: center">忘记密码或者想要修改密码请联系管理员</p>

                      </div>

                      <div v-else>
                          <tr>
                              <td>登录方式</td>
                              <td>
                                  <el-radio v-model="senderForm.loginType" label="zh"  >账号登录</el-radio>
                                  <el-radio v-model="senderForm.loginType"  label="dx"  >短信登录</el-radio>
                              </td>
                          </tr>
                          <tr>
                              <td><div>手机号:</div></td>
                              <td  colspan="2"> <el-input v-model="senderForm.phone"   placeholder="请输入手机号" style="width:20rem;"/></td>
                              <td>
                                  <el-button type="primary" size="mini"  @click="sendSms()" v-show="show">发送短信</el-button>
                                  <el-button type="primary" size="mini" v-show="!show">{{count}}s后重新获取</el-button>
                              </td>
                          </tr>

                          <tr>
                              <td>短信验证码:</td>
                              <td  colspan="2"> <el-input v-model="senderForm.smscode"      placeholder="请输入验证码" style="width:20rem;"/></td>

                          </tr>
                      </div>





                  </table>



                  <div>

                      <el-button type="primary" style="width:10rem;margin-top:2rem" @click="loginSender">登录</el-button>
                  </div>
              </el-tab-pane>

          </el-tabs>

          <br>
      </div>


          <!--人脸识别窗口-->
          <el-dialog customClass="customWidth" :visible.sync="cameraVisible" >
              <div slot="title" class="header-title">
                  <span class="header-title-span"><i class="el-icon-edit"></i>人脸识别窗口-员工姓名:{{realname}}-员工编号:{{username}}</span>
              </div>
              <div class="container" style="text-align: center;">
                  <video id="video" width="480" height="320">  </video>
                  <p id="video_tip" >脸部识别中，请正脸看向摄像头</p>
                  <canvas id="canvas" width="480" height="320" style="display: none;"></canvas>
                  <p id="result"></p>
              </div>
              <div slot="footer" class="dialog-footer">
                  <el-button @click="cameraVisible = false">取 消</el-button>
                  <el-button type="primary" @click="saveFaceData()">开始识别</el-button>
              </div>
          </el-dialog>
      </el-main>
    </el-container>
      <el-footer style="text-align:center;vertical-align: bottom;line-height:3rem">
          开发 @ xxx
          <router-link to="/Login">
              <span style="background-color: #66b1ff;margin-left: 10px;color: #ffffff">管理员和配送员登录</span>

          </router-link>
          <router-link to="/userLogin">
              <span style="background-color: #66b1ff; margin-left: 10px;color:#ffffff"> 普通用户登录</span>

          </router-link>
      </el-footer>
  </el-container>
</template>
<script>
    import {login,faceMatch,sendSms,sendereLoginByCode,sendereLoginByPassword} from "../../api"
    const reg =/^[1][3,4,5,7,8,9][0-9]{9}$/;
    export default{
        name: 'Login',
        data () {
             return {
                 show: true,
                 count: '',
                 timer: null,
                 username:'admin',
                 password:'123456',
                 cameraVisible:false,
                 video: null,
                 canvas : null,
                 context : null,
                 realname: '',
                 faceData:{
                     img: ''
                 },
                 senderForm:{
                     loginType:'zh',
                     username:'20220331',
                     password:'123456',
                     phone:'15336574540',
                     smscode:''

                 },
                 userForm:{
                     loginType:'zh',
                     username:'',
                     password:'',
                     phone:'',
                     smscode:''

                 }
            }
        },
        methods: {
            sendSms(){
                //先判断手机号是否输入了
                if(this.senderForm.phone == '' ){
                    this.$message.error("请输入手机号")
                    return false
                }else if(!reg.test(this.senderForm.phone)){
                    this.$message.error("手机号格式错误")
                    return false
                }
                else{
                    //请求后台发送验证码
                    sendSms({phone:this.senderForm.phone}).then((res) => {
                        if (res.data.status == 1) {
                            this.$message({
                                duration:3000,
                                message:res.data.msg,
                                type: 'success'
                            })

                        } else {
                            this.$message.error(res.data.msg)

                        }

                    })


                    const TIME_COUNT = 60;
                    if (!this.timer) {
                        this.count = TIME_COUNT;
                        this.show = false;
                        this.timer = setInterval(() => {
                            if (this.count > 0 && this.count <= TIME_COUNT) {
                                this.count--;
                            } else {
                                this.show = true;
                                clearInterval(this.timer);
                                this.timer = null;
                            }
                        }, 1000)
                    }
                }

            },
            loginSender(){
                const that = this;
                if(that.senderForm.loginType =='zh'){
                    if(that.senderForm.username == "" ){
                        that.$message("请输入账号")
                        return false;
                    }
                    if(that.senderForm.password == "" ){
                        that.$message("请输入密码")
                        return false;
                    }

                    //请求后台判断用户输入的是否正确
                    console.log('zhang-请求后台判断用户输入的是否正确')
                    sendereLoginByPassword({username:that.senderForm.username,password:that.senderForm.password}).then((res) => {
                        if (res.data.status == 1) {
                            that.$message({
                                duration:3000,
                                message:res.data.msg,
                                type: 'success'
                            })

                            //把登录者的信息保存起来
                            localStorage.lander=JSON.stringify(res.data.obj);//登陆者
                            //跳转到配送员的菜单页面

                            that.$router.replace("AdminOrderList");

                        } else {
                            this.$message.error(res.data.msg)

                        }

                    })
                }else{
                    if(that.senderForm.phone == "" ){
                        that.$message("请输入手机号")
                        return false;
                    }
                    if(!reg.test(that.senderForm.phone)){
                        that.$message("手机号格式错误")
                        return false;
                    }
                    if(that.senderForm.smscode == "" ){
                        that.$message("请输入验证码")
                        return false;
                    }
                    //请求后台判断用户输入的是否正确
                    console.log('dx-请求后台判断用户输入的是否正确')

                    sendereLoginByCode({phone:that.senderForm.phone,smscode:that.senderForm.smscode}).then((res) => {
                        if (res.data.status == 1) {
                            that.$message({
                                duration:3000,
                                message:res.data.msg,
                                type: 'success'
                            })

                            //把登录者的信息保存起来
                            localStorage.lander=JSON.stringify(res.data.obj);//登陆者
                            //跳转到配送员的菜单页面
                            that.$router.replace("AdminOrderList");

                        } else {
                            this.$message.error(res.data.msg)

                        }

                    })
                }


                // const loading = this.$loading({
                //     lock: true,
                //     text: "登录中",
                //     spinner: "el-icon-loading",
                //     background: "rgba(0, 0, 0, 0.7)",
                // });
                // employeLogin(this.senderForm).then(res=>{
                //     if(res.data.code == 200 ){
                //         loading.close();
                //         that.username=res.data.obj.username
                //         that.realname=res.data.obj.realname
                //         //直接弹出人脸识别的窗口
                //         if(res.data.obj.empType == '门卫'){
                //             that.getCompetence()
                //         }else{
                //             localStorage.lander=JSON.stringify(res.data.obj);//登陆者
                //             //跳转到管理维护信息的页面
                //             that.$router.replace("AdminRepairList");
                //         }
                //
                //
                //
                //
                //     }else{
                //         that.$message(res.data.msg)
                //     }
                //     loading.close();
                // })
            },
            getFace() {
                this.context.drawImage(this.video,0,0,150,150);
                var imgSrc=this.canvas.toDataURL('image/jpg')
                //获取完整的base64编码
                imgSrc=imgSrc.split(',')[1];
                return imgSrc;
            },

            getCompetence() {
                const that=this
                this.cameraVisible =true
                this.$nextTick(()=>{
                    that.canvas = document.getElementById('canvas');
                    that.context=this.canvas.getContext('2d')
                    console.log(that.context)
                    that.video = document.getElementById('video');
                    // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
                    if (navigator.mediaDevices === undefined) {
                        navigator.mediaDevices = {}
                    }
                    // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
                    // 使用getUserMedia，因为它会覆盖现有的属性。
                    // 这里，如果缺少getUserMedia属性，就添加它。
                    if (navigator.mediaDevices.getUserMedia === undefined) {
                        navigator.mediaDevices.getUserMedia = function (constraints) {
                            // 首先获取现存的getUserMedia(如果存在)
                            var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia
                            // 有些浏览器不支持，会返回错误信息
                            // 保持接口一致
                            if (!getUserMedia) {
                                return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
                            }
                            // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
                            return new Promise(function (resolve, reject) {
                                getUserMedia.call(navigator, constraints, resolve, reject)
                            })
                        }
                    }
                    var constraints = { audio: false, video: { width: this.videoWidth, height: this.videoHeight, transform: 'scaleX(-1)' } }
                    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                        // 旧的浏览器可能没有srcObject
                        if ('srcObject' in that.video) {
                            that.video.srcObject = stream
                        } else {
                            // 避免在新的浏览器中使用它，因为它正在被弃用。
                            that.video.src = window.URL.createObjectURL(stream)
                        }
                        that.video.onloadedmetadata = function () {
                            that.video.play()
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                })




            },
            saveFaceData(){
                //请求后台
                this.faceData.img=this.getFace()
                faceMatch(this.faceData).then((res) => {
                    if (res.data.code == 200) {
                        this.$message({
                            duration:3000,
                            message:res.data.msg,
                            type: 'success'
                        })

                        this.usersList()
                    } else {
                        this.$message.error(res.data.msg)

                    }

                })
            },
            loginClick(){
             const that = this;
             if(this.username == "" ){
               this.$message("请输入管理员账号")
               return;
             }
             if(this.password == "" ){
               this.$message("请输入密码")
               return;
             }
               const loading = this.$loading({
                lock: true,
                text: "登录中",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)",
              });
             login({username:this.username,password:this.password}).then(res=>{
               if(res.data.status == 1){
                 loading.close();
                 localStorage.lander=JSON.stringify(res.data.obj);//登陆者
                 that.$router.replace("AdminSenderList");


               }else{
                 this.$message(res.data.msg)
               }
               loading.close();
         })

       }


     }
    }
</script>

<style scoped lang="less">

    .el-main {

        color: #333;
        height: calc(100vh - 60px);
    }
    .el-footer{
        height: 60px;
        background-color: #3d3d3d;
        color: #f3f3f3;
    }
    table tr td{line-height: 70px;}
</style>
