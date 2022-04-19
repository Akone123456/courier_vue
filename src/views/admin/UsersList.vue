<template>

    <el-container>
        <el-main style="margin: 0 0 0 10rem">

            <div>
                <div style="margin:5rem 0 2rem 0">
                    姓名：
                    <el-input v-model="username" style="width:10rem" @keyup.native="searchF"/>
                    状态：
                    <el-select v-model="status" style="width:10rem" @change="searchF">
                        <el-option label="-请选择-" value="">-请选择-</el-option>
                        <el-option label="启用" value="1">启用</el-option>
                        <el-option label="禁用" value="0">禁用</el-option>
                    </el-select>

                </div>
                <el-table :data="tableData" border style="width: 100%" stripe
                          :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                    <el-table-column
                            prop="id"
                            label="编号"
                            width="80px"
                    >
                    </el-table-column>

                    <el-table-column prop="username" label="账号"></el-table-column>
                    <el-table-column label="手机号" prop="phone">
                    </el-table-column>

                    <el-table-column label="状态">
                        <template slot-scope="scope">

                            <span v-if="scope.row.status=='0'">已启用</span>
                            <button v-if="scope.row.status=='0'" @click="cState(scope.$index, scope.row)" type="button"
                                    class="el-button el-button--danger is-round"><!----><i class="el-icon-close"></i> 禁用
                            </button>

                            <span v-if="scope.row.status=='1'">已禁用</span>
                            <button v-if="scope.row.status=='1'" @click="cState(scope.$index, scope.row)" type="button"
                                    class="el-button el-button--success is-round"><!----><i class="el-icon-check"></i>
                                启用
                            </button>


                        </template>
                    </el-table-column>

<!--                    <el-table-column label="操作" width="400px">-->
<!--                        <template slot-scope="scope">-->
<!--                            <el-button class="el-button el-button&#45;&#45;primary"-->
<!--                                       size="mini"-->
<!--                                       v-if="scope.row.status==1"-->
<!--                                       @click="chooseRoom(scope.$index, scope.row)"><i class="el-icon-key"></i>房屋分配-->
<!--                            </el-button>-->
<!--                            <el-button class="el-button el-button&#45;&#45;danger"-->
<!--                                       size="mini"-->
<!--                                       v-if="scope.row.status==1"-->
<!--                                       @click="choosePay(scope.$index, scope.row)"><i class="el-icon-key"></i>添加缴费-->
<!--                            </el-button>-->
<!--                            <el-button class="el-button el-button&#45;&#45;warning"-->
<!--                                       size="mini"-->
<!--                                       @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit-outline"></i>编辑-->
<!--                            </el-button>-->
<!--                            <el-button class="el-button el-button&#45;&#45;success"-->
<!--                                       size="mini"-->
<!--                                       @click="getCompetence(scope.$index, scope.row)"><i class="el-icon-camera"></i>采集人脸-->
<!--                            </el-button>-->


<!--                        </template>-->
<!--                    </el-table-column>-->
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

        </el-main>




    </el-container>

</template>

<script>
    import {
        adminUsersPage,
        updateUser,
    } from '../../api'

    export default {
        name: "usersList",
        data() {
            return {
                video: null,
                canvas : null,
                context : null,
                username: '',
                status: '',
                tableData: [],
                pages: 0,
                pageSize: 0,
                count: 0,
                pageNo: 1,


            }
        },
        methods: {


            cState(a, b) {
                const that = this;

                let status = b.status;
                if (status == 1) status = 0;
                else status = 1;
                console.log(b.id);
                updateUser({id: b.id, status: status}).then(res => {
                    if (res.data.status == 1) {
                        this.$message({
                            type: 'success',
                            message: res.data.msg
                        });
                        that.usersList();
                    } else {
                        this.$message.error(res.data.msg);
                    }


                })

            },



            usersList() {
                adminUsersPage({
                    pageNo: this.pageNo,
                    limit: 10,
                    username: this.username,
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

            changee(e) {
                this.pageNo = e
                this.usersList()
            },
            searchF() {
                this.pageNo = 1
                this.usersList()
            },


        },
        mounted() {
            const that = this;

            that.usersList();

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



