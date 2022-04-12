<template>

    <el-container>
        <el-main style="margin: 0 0 0 10rem" >
            <div style="padding-top: 100px;width: 500px;margin: auto auto;">
                <el-form :model="userform" :rules="userformRule" ref="userform" style="background: #fff;padding: 20px 20px;">
                    <h1 style="text-align: center">用户基本信息</h1>
                    <el-upload
                            :show-file-list="false"
                            :action="baseURL+'admin/userinfo/upimg'"
                            :multiple="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            style="text-align: center"

                    >

                        <img  :src="imageUrl" class="imgface_fx">
                        <div >
                            <em>点击上传</em>
                            <div class="el-upload__tip">只能上传 jpg/png 文件，且不超过 10M</div>
                        </div>
                    </el-upload>

                    <el-form-item prop="username">
                        <el-input v-model="userform.username" >
                            <template slot="prepend" >账号：</template>
                        </el-input>
                    </el-form-item>

                    <el-form-item  prop="phone">
                        <el-input  v-model="userform.phone"   >
                            <template slot="prepend">手机号：</template>
                        </el-input>
                    </el-form-item >


                    <el-form-item style="text-align: center">
                        <p v-if="msg" style="color:red">{{msg}}</p>
                        <el-button type="primary" @click="onSubmit">确定修改</el-button>
                        <el-button type="danger" @click="getCompetence()">采集人脸</el-button>
                    </el-form-item>
                </el-form>

            </div>

            <!--采集人脸特征窗口-->
            <el-dialog customClass="customWidth" :visible.sync="cameraVisible" >
                <div slot="title" class="header-title">
                    <span class="header-title-span"><i class="el-icon-edit"></i>采集人脸特征窗口</span>
                </div>
                <div class="container" style="text-align: center;">
                    <video id="video" width="480" height="320">  </video>
                    <p id="video_tip" >脸部特征采集中，请正脸看向摄像头</p>
                    <canvas id="canvas" width="480" height="320" style="display: none;"></canvas>
                    <p id="result"></p>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cameraVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveFaceData()">开始采集</el-button>
                </div>
            </el-dialog>

        </el-main>




    </el-container>

</template>

<script>
    let  baseURL=process.env.VUE_APP_BASE_URL
    import {addFaceData, updateUser, valiUserName} from "../../api"
    import { validatePhone} from "../../api/validator"
    export default {
        name: "MyCenter",
        data() {
            const validateName = (rule, value, callback) => {

                if(value != this.lander.username){
                    valiUserName({username: value}).then((res) => {
                        console.log(res);
                        if (res.data.status == 0) {
                            callback(new Error("此用户名已被注册"));
                        }else{
                            callback();
                        }
                    })
                }else{
                    callback();
                }

            }
            return {
                video: null,
                canvas : null,
                context : null,
                cameraVisible: false,
                baseURL:baseURL,
                lander:{},
                msg: '',
                imageUrl: '',
                faceData:{
                    id: '',
                    img: ''
                },
                userform: {
                    id:'',
                    username:'',
                    phone:'',
                    photo: '',

                },
                userformRule:{
                    username: [{required: true, message: '不能为空', trigger: 'blur'},
                        {validator: validateName, trigger: 'blur'}],
                    phone: [{required: true, message: '不能为空', trigger: 'blur'},
                        {validator: validatePhone, trigger: 'blur'}],
                }

            }
        },
        methods: {
            saveFaceData(){
                //请求后台
                this.faceData.img=this.getFace()
                addFaceData(this.faceData).then((res) => {
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
                    that.faceData.id= this.lander.id
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
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const ispng = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 10;

                if (!isJPG) {
                    if(!ispng){
                        this.$message.error('上传封面图片只能是 JPG/PNG 格式!');
                    }

                }
                if (!isLt2M) {
                    this.$message.error('上传封面图片大小不能超过20MB!');
                }
                return (isJPG||ispng) && isLt2M;
            },
            handleAvatarSuccess(res, file) {
                this.imageUrl = this.baseURL+file.response.obj
                this.userform.photo=file.response.obj
            },

            onSubmit() {
                this.$refs.userform.validate(valid => {

                    //表单验证失败
                    if (!valid) {
                        //提示语
                        this.$message("请按提示填写表单");
                        return false;
                    } else {
                        //请求后台修改
                        updateUser(this.userform).then((res) => {
                            if (res.data.status == 1) {
                                this.$message({
                                    duration: 3000,
                                    message: res.data.msg,
                                    type: 'success'
                                })
                                //设置登录者
                                //把登录者的信息保存起来
                                localStorage.lander = JSON.stringify(res.data.obj);//登陆者


                            } else {
                                this.$message.error(res.data.msg)

                            }

                        })
                    }
                })
            }

        },
        mounted(){
            try{
                let lander=JSON.parse(localStorage.lander);
                if (lander!=null) {
                    console.log(lander)
                    this.lander=lander;
                    this.userform.id=lander.id
                    this.userform.phone=lander.phone
                    this.userform.photo=lander.photo
                    this.userform.username=lander.username
                    this.imageUrl=process.env.VUE_APP_BASE_URL+lander.photo
                }else {
                    this.$router.replace('userLogin');
                }
            }catch(e){
                this.$router.replace('userLogin');

            }


        }
    }
</script>

<style scoped>
    .imgface_fx{
        width: 80px;
        height: 80px;
        border-radius: 5px 5px;
        border: 1px solid #dddddd;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
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
    .el-main {
        width: 125rem;
        z-pageNo: 100;
        position: relative;
        background-color: #f3f3f3;
        color: #333;
        height: calc(100vh - 80px);
        height: 100vh ;
    }
    .header-title{border-bottom: 1px dotted #409EFF;padding-bottom: 10px; }
    .header-title-span{border:1px dotted #409EFF;color:#409EFF;padding: 10px;border-radius: 10px;}
</style>



