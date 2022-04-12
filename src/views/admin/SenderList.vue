<template>

    <el-container>
        <el-main style="margin: 0 0 0 10rem">

            <div>
                <div style="margin:5rem 0 2rem 0">
                    姓名：
                    <el-input v-model="realname" style="width:10rem" @keyup.native="searchF"/>
                    状态：
                    <el-select v-model="status" style="width:10rem" @change="searchF">
                        <el-option label="-请选择-" value="">-请选择-</el-option>
                        <el-option label="启用" value="1">启用</el-option>
                        <el-option label="禁用" value="0">禁用</el-option>
                    </el-select>

                    <el-button @click="addSender" class="el-button el-button--primary"><i class="el-icon-plus"></i>添加
                    </el-button>

                </div>
                <el-table :data="tableData" border style="width: 100%" stripe
                          :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                    <el-table-column
                            prop="id"
                            label="编号"
                            width="80px"
                    >
                    </el-table-column>

                    <el-table-column prop="realname" label="姓名"></el-table-column>

                    <el-table-column label="性别" width="80px">
                        <template slot-scope="scope">
                            <span v-if="scope.row.sex== 0">男</span>
                            <span v-if="scope.row.sex==1">女</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="手机号" prop="phone">
                    </el-table-column>
                    <el-table-column label="配送员编号" prop="username">
                    </el-table-column>

                    <el-table-column label="状态">
                        <template slot-scope="scope">

                            <span v-if="scope.row.status==1">已启用</span>
                            <button v-if="scope.row.status==1" @click="cState(scope.$index, scope.row)" type="button"
                                    class="el-button el-button--danger is-round"><!----><i class="el-icon-close"></i> 禁用
                            </button>

                            <span v-if="scope.row.status==0">已禁用</span>
                            <button v-if="scope.row.status==0" @click="cState(scope.$index, scope.row)" type="button"
                                    class="el-button el-button--success is-round"><!----><i class="el-icon-check"></i>
                                启用
                            </button>


                        </template>
                    </el-table-column>

                    <el-table-column label="添加时间" prop="createTime">
                    </el-table-column>

                    <el-table-column label="操作" width="400px">
                        <template slot-scope="scope">
                            <el-button class="el-button el-button--primary"
                                       size="mini"
                                       @click="cInitUpass(scope.$index, scope.row)"><i class="el-icon-key"></i>初始化密码</el-button>
                            <el-button class="el-button el-button--warning"
                                       size="mini"
                                       @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit-outline"></i>编辑
                            </el-button>

                            <el-button class="el-button el-button--danger"
                                       size="mini"
                                       @click="cDel(scope.$index, scope.row)"><i class="el-icon-delete"></i>删除</el-button>



                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页-->
                <div class="block">

                    <el-pagination
                            style="float:left"
                            background
                            layout="prev, pager, next"

                            :page-count="pages" :current-page="pageNo" @current-change="changee">
                    </el-pagination>

                    <span style="float:left;line-height: 25px;">共{{count}}条数据,共{{pages}}页,一页显示{{pageSize}}条</span>
                </div>
            </div>

            <el-dialog customClass="customWidth" :visible.sync="dialogTableVisible">
                <div slot="title" class="header-title">
                    <span class="header-title-span"><i class="el-icon-edit"></i>{{senderForm.id  ?"编辑": "添加"}}配送员</span>
                </div>

                <el-form :model="senderForm" :rules="formRule" ref="senderForm">
                    <el-form-item label="姓名" prop="realname">
                        <el-input v-model="senderForm.realname" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-radio v-model="senderForm.sex" :label="0">男</el-radio>
                        <el-radio v-model="senderForm.sex" :label="1">女</el-radio>
                    </el-form-item>

                    <el-form-item label="编号(用于登录，默认密码123456)"  prop="username" >
                        <el-input v-model="senderForm.username" autocomplete="off"  @keyup.native="existsUno"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model="senderForm.phone" autocomplete="off" ></el-input>
                    </el-form-item>

                    <el-form-item label="备注"  prop="note" >
                        <el-input
                                type="textarea"
                                :rows="3"
                                placeholder="请输入内容"
                                v-model="senderForm.note">
                        </el-input>
                    </el-form-item>

                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogTableVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit">{{senderForm.id ?"更新": "新建"}}</el-button>
                </div>


            </el-dialog>



        </el-main>




    </el-container>

</template>

<script>
    import {
        adminSenderPage,
        adminAddSender,
        adminDeleteSender,
        adminChaneStateSender,
        adminSenderexistsUno,
        adminInitUpassSender
    } from '../../api'

    import {validatePhone} from "../../api/validator"

    export default {
        name: "SenderList",
        data() {
            return {
                dialogTableVisible: false,
                realname: '',
                status: '',
                tableData: [],
                pages: 0,
                pageSize: 0,
                count: 0,
                pageNo: 1,
                exisetsUnoMsg : true,
                senderForm: {
                    id: '',
                    username: '',
                    realname: '',
                    sex: '',
                    phone: '',
                    note: ''
                },

                formRule: {
                    username: [{required: true, message: '不能为空', trigger: 'blur'}],
                    realname: [{required: true, message: '不能为空', trigger: 'blur'}],
                    sex: [{required: true, message: '不能为空', trigger: 'blur'}],
                    phone: [{required: true, message: '不能为空', trigger: 'blur'},
                        {validator: validatePhone, message: '手机号格式不对', trigger: 'blur'}],
                },

            }
        },
        methods: {
            cInitUpass(a,b){
                const that = this;


                console.log(b.id);
                adminInitUpassSender({id:b.id}).then(res=>{
                    if( res.data.status==1){
                        this.$message({
                            type: 'success',
                            message: res.data.msg
                        });
                        that.senderList();
                    }else{
                        this.$message.error(res.data.msg);
                    }


                })

            }  ,

            existsUno(){
                let username=this.senderForm.username;
                let myreg = /^(\d){8}$/;
                if (!myreg.test(username)) {
                    this.$message('编号格式错误，8位数字组成')
                    return false;
                }
                adminSenderexistsUno({ username:username}).then((res) => {
                    if( res.data.status==0){
                        this.exisetsUnoMsg=false;
                        this.$message.error(res.data.msg);
                    }else{

                        this.$message({
                            message:res.data.msg,
                            type: 'success'
                        });
                        this.exisetsUnoMsg=true;
                    }
                })


            },

            addSender() {
                this.senderForm = {};
                this.dialogTableVisible = true
            },

            /*启用禁用*/
            cState(a, b) {
                const that = this;

                let status = b.status;
                if (status == 1) status = 0;
                else status = 1;
                console.log(b.id);
                adminChaneStateSender({id: b.id, status: status}).then(res => {
                    if (res.data.status == 1) {
                        this.$message({
                            type: 'success',
                            message: res.data.msg
                        });
                        that.senderList();
                    } else {
                        this.$message.error(res.data.msg);
                    }


                })

            },

            cDel(a, b) {
                const that = this;

                this.$confirm('此操作将删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log(b.id);
                    adminDeleteSender({id: b.id}).then(res => {
                        if (res.data.status == 1) {
                            this.$message({
                                type: 'success',
                                message: res.data.msg
                            });
                            that.senderList();
                        } else {
                            // this.$message.error(res.data.msg);
                            this.$notify.error({
                                title: '提示',
                                message: res.data.msg,
                                duration: 0,
                                offset: 200
                            });
                        }


                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            submit() {
                if(!this.exisetsUnoMsg){
                    this.$message.error('编号已存在');

                    return false ;
                }

                this.$refs.senderForm.validate(valid => {

                    //表单验证失败
                    if (!valid) {
                        //提示语
                        this.$message.error("请按提示填写表单");

                        return false;
                    } else {
                        adminAddSender(this.senderForm).then(res => {
                            if (res.data.status == 1) {
                                this.dialogTableVisible = false;
                                this.$message({
                                    type: 'success',
                                    message: '操作成功'
                                });
                                this.senderList();

                            } else {
                                this.$message.error('操作失败');
                            }


                        });
                    }
                });

            },

            senderList() {
                adminSenderPage({
                    pageNo: this.pageNo,
                    limit: 10,
                    realname: this.realname,
                    status: this.status
                }).then((res) => {
                    console.log(res.data)
                    this.tableData = res.data.obj.list
                    this.pages = res.data.obj.pages//有多少页
                    this.pageSize = res.data.obj.pageSize//一页显示多少条
                    this.count = res.data.obj.total//该页总共多少条记录
                    this.pageNo = res.data.obj.pageNum
                })
            },
            handleEdit(pageNo, row) {

                this.senderForm.id = row.id;
                this.senderForm.realname = row.realname;
                this.senderForm.username = row.username;
                this.senderForm.note = row.note;
                this.senderForm.sex = row.sex;
                this.senderForm.phone = row.phone;
                this.dialogTableVisible = true

                console.log(pageNo, row)
            },

            changee(e) {
                this.pageNo = e
                this.senderList()
            },
            searchF() {
                this.pageNo = 1
                this.senderList()
            },



        },
        mounted() {
            const that = this;

            that.senderList();

        }
    }
</script>

<style scoped>
    .el-main {
        width: 125rem;
        z-pageNo: 100;
        position: relative;
        background-color: #ffffff;
        color: #333;
        height: calc(100vh - 80px);
        height: 100vh;
    }

    .header-title {
        border-bottom: 1px dotted #409EFF;
        padding-bottom: 10px;
    }

    .header-title-span {
        border: 1px dotted #409EFF;
        color: #409EFF;
        padding: 10px;
        border-radius: 10px;
    }
</style>



