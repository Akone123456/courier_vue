<template>
  <el-container direction="vertical"    style="background-image: url('/adminimg/back.jpg');background-size: cover">

    <el-container>
      <el-main >
      <div style="width:500px;height:auto;margin:7rem auto 0 auto;position:relative;border-radius:10px;" align="center">


          <el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">
              <h1 style="font-size: 20px;">校园快递代收系统-普通用户端</h1>

              <el-tab-pane label="用户名登录" name="bypass">
                      <table>
                          <tr>
                              <td><div>账号:</div></td>
                              <td  colspan="2"> <el-input v-model="userForm.username"   placeholder="请输入账号" style="width:20rem;"/></td>

                          </tr>
                          <tr>
                              <td>密码:</td>
                              <td  colspan="2"> <el-input v-model="userForm.password"    show-password  placeholder="请输入密码" style="width:20rem;"/></td>

                          </tr>

                      </table>
                      <div>
                          <p style="color:red; ">忘记密码或者想要修改密码请联系管理员</p>
                          <el-button type="primary" style="width:10rem;margin-top:2rem" @click="loginByPass">登录</el-button>
                      </div>


              </el-tab-pane>
              <el-tab-pane label="验证码登录" name="bycode">
                  <table>
                      <tr>
                          <td><div>手机号:</div></td>
                          <td  colspan="2"> <el-input v-model="userForm.phone"   placeholder="请输入手机号" style="width:20rem;"/></td>
                          <td>
                              <el-button type="primary" size="mini"  @click="sendSms()" v-show="show">发送短信</el-button>
                              <el-button type="primary" size="mini" v-show="!show">{{count}}s后重新获取</el-button>
                          </td>
                      </tr>

                      <tr>
                          <td>短信验证码:</td>
                          <td  colspan="2"> <el-input v-model="userForm.smscode"     placeholder="请输入验证码" style="width:20rem;"/></td>

                      </tr>

                  </table>
                  <div>
                      <el-button type="primary" style="width:10rem;margin-top:2rem" @click="loginByCode">登录</el-button>
                  </div>


              </el-tab-pane>
              <el-tab-pane label="人脸登录"  name="byface">
                  <div slot="title" class="header-title">
                      <span class="header-title-span"><i class="el-icon-edit"></i>人脸识别窗口-员工姓名:{{realname}}-员工编号:{{username}}</span>
                  </div>
                  <div class="container" style="text-align: center;">
                      <video id="video" width="480" height="320">  </video>
                      <p id="video_tip" >脸部识别中，请正脸看向摄像头</p>
                      <canvas id="canvas" width="480" height="320" style="display: none;"></canvas>
                      <p id="result"></p>
                  </div>
                  <el-button type="primary" @click="saveFaceData()">识别登录</el-button>

              </el-tab-pane>
              <el-tab-pane label="注册"  name="adduser">

                      <el-form
                              :model="userForm"
                              :rules="formRule"
                              ref="userForm"
                      >
                          <el-form-item prop="phone"  >
                              <el-input v-model="userForm.phone"   placeholder="手机号"  style="width: 70%" ></el-input>
                              <el-button type="primary" size="mini"  @click="sendSms()" v-if="show" style="width: 30%">发送短信</el-button>
                              <el-button type="primary" size="mini" v-else style="width: 30%">{{count}}s后重新获取</el-button>
                          </el-form-item >

                          <el-form-item prop="smscode" >
                              <el-input v-model="userForm.smscode"     placeholder="短信验证码" ></el-input>
                          </el-form-item>

                          <el-form-item  prop="username">
                              <el-input v-model="userForm.username"    placeholder="设置账号" ></el-input>
                          </el-form-item>

                          <el-form-item  prop="password">
                              <el-input v-model="userForm.password"    placeholder="密码"  type="password"></el-input>
                          </el-form-item  >

                      </el-form>
                  <div>
                      <el-button type="primary" style="width:10rem;margin-top:2rem" @click="addUserinfo">注册</el-button>
                  </div>

              </el-tab-pane>

          </el-tabs>

          <br>
      </div>


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
    import {faceMatch,sendSms,userinfoLoginByCode,userinfoLoginByPassword,addUserinfo,valiUserName} from "../../api"
    import { validatePhone} from "../../api/validator"
    const reg =/^[1][3,4,5,7,8,9][0-9]{9}$/;
    export default{
        name: 'Login',
        data () {
            const validateName = (rule, value, callback) => {
                valiUserName({username: value}).then((res) => {
                    console.log(res);
                    if (res.data.status == 0) {
                        callback(new Error("此用户名已被注册"));
                    }else{
                        callback();
                    }
                })
            }
             return {
                 activeName: "bypass",
                 show: true,
                 count: '',
                 timer: null,
                 username:'admin',
                 password:'123456',
                 video: null,
                 canvas : null,
                 context : null,
                 realname: '',
                 faceData:{
                     img: ''
                 },
                 userForm:{
                     username:'',
                     password:'',
                     phone:'',
                     smscode:''

                 },
                 formRule: {
                     username: [{required: true, message: '不能为空', trigger: 'blur'},
                         {validator: validateName, trigger: 'blur'}],
                     smscode:[{required: true, message: '不能为空', trigger: 'blur'}],
                     phone: [{required: true, message: '不能为空', trigger: 'blur'},
                         {validator: validatePhone, message: '手机号格式不对', trigger: 'blur'}
                     ],
                     password: [
                         {required: true, message: '不能为空', trigger: 'blur'},
                         {
                             pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
                             message: '密码必须包含字母和数字，且在6~18位之间',
                             trigger: 'blur'
                         }

                     ]
                 },
            }
        },
        methods: {
            addUserinfo() {

                this.$refs.userForm.validate(valid => {

                    //表单验证失败
                    if (!valid) {
                        //提示语
                        this.$message("请按提示填写表单");
                        return false;
                    }else {
                        addUserinfo({
                            phone: this.userForm.phone,
                            smscode: this.userForm.smscode,
                            password: this.userForm.password,
                            username: this.userForm.username,
                        }).then((res) => {
                            if (res.data.status == 1) {
                                this.$message({
                                    duration: 3000,
                                    message: res.data.msg,
                                    type: 'success'
                                })
                                //设置登录者
                                //把登录者的信息保存起来
                                localStorage.lander = JSON.stringify(res.data.obj);//登陆者
                                this.$router.replace("MyCenter");

                            } else {
                                this.$message.error(res.data.msg)

                            }

                        })
                    }
                })
            },
            handleClick(tab) {
                if (tab.name == "byface") {
                    this.getCompetence()
                }
            },
            sendSms() {

                //先判断手机号是否输入了
                if (this.userForm.phone == '') {
                    this.$message.error("请输入手机号")
                } else if(!reg.test(this.userForm.phone)){
                    this.$message.error("手机号格式错误")
                }else {
                    //请求后台发送验证码
                    sendSms({phone: this.userForm.phone}).then((res) => {
                        if (res.data.status == 1) {
                            this.$message({
                                duration: 3000,
                                message: res.data.msg,
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
            loginByPass() {
                const that = this;

                if (that.userForm.username == "") {
                    that.$message("请输入账号")
                    return false;
                }
                if (that.userForm.password == "") {
                    that.$message("请输入密码")
                    return false;
                }

                //请求后台判断用户输入的是否正确
                userinfoLoginByPassword({username: that.userForm.username, password: that.userForm.password}).then((res) => {
                    if (res.data.status == 1) {
                        that.$message({
                            duration: 3000,
                            message: res.data.msg,
                            type: 'success'
                        })

                        //把登录者的信息保存起来
                        localStorage.lander = JSON.stringify(res.data.obj);//登陆者
                        //跳转到普通用户的菜单页面

                        that.$router.replace("MyCenter");

                    } else {
                        this.$message.error(res.data.msg)

                    }

                })
            },
            loginByCode() {
                const that = this;

                if (that.userForm.phone == "") {
                    that.$message("请输入手机号")
                    return false;
                }
                if (that.userForm.smscode == "") {
                    that.$message("请输入短信验证码")
                    return false;
                }

                //请求后台判断用户输入的是否正确
                userinfoLoginByCode({phone: that.userForm.phone, smscode: that.userForm.smscode}).then((res) => {
                    if (res.data.status == 1) {
                        that.$message({
                            duration: 3000,
                            message: res.data.msg,
                            type: 'success'
                        })

                        //把登录者的信息保存起来
                        localStorage.lander = JSON.stringify(res.data.obj);//登陆者
                        //跳转到普通用户的菜单页面

                        that.$router.replace("MyCenter");

                    } else {
                        this.$message.error(res.data.msg)

                    }

                })
            },

            getFace() {
                this.context.drawImage(this.video, 0, 0, 150, 150);
                var imgSrc = this.canvas.toDataURL('image/jpg')
                //获取完整的base64编码
                imgSrc = imgSrc.split(',')[1];
                return imgSrc;
            },

            getCompetence() {
                const that = this
                this.$nextTick(() => {
                    that.canvas = document.getElementById('canvas');
                    that.context = this.canvas.getContext('2d')
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
                    var constraints = {
                        audio: false,
                        video: {width: this.videoWidth, height: this.videoHeight, transform: 'scaleX(-1)'}
                    }
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
            saveFaceData() {
                //请求后台
                this.faceData.img = this.getFace()
                faceMatch(this.faceData).then((res) => {
                    if (res.data.status == 1) {
                        this.$message({
                            duration: 3000,
                            message: res.data.msg,
                            type: 'success'
                        })
                        //把登录者的信息保存起来
                        localStorage.lander = JSON.stringify(res.data.obj);//登陆者
                        //跳转到普通用户的菜单页面

                        this.$router.replace("MyCenter");

                    } else {
                        this.$message.error(res.data.msg)

                    }

                })
            },

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
