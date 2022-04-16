<template>
  <div class="addressManger">
<!--    <el-form :inline="true"  class="demo-form-inline">-->
<!--      <el-form-item label="">-->
<!--        <el-input v-model="listSelect.userCode" placeholder="评论人" style="width: 200px" clearable></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="">-->
<!--        <el-input v-model="listSelect.commentContent" placeholder="评论内容" style="width: 300px" clearable></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-date-picker-->
<!--            v-model="timeSelect"-->
<!--            type="daterange"-->
<!--            align="right"-->
<!--            unlink-panels-->
<!--            range-separator="至"-->
<!--            start-placeholder="开始日期"-->
<!--            end-placeholder="结束日期"-->
<!--            value-format="yyyy-MM-dd HH:mm:ss"-->
<!--            :picker-options="pickerOptions">-->
<!--        </el-date-picker>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button type="primary" @click="onSubmit">查询</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->
    <el-row style="margin-bottom: 10px">
      <el-button type="success" plain @click="dialogForm.dialogFormVisible = true;dialogForm.title='新增地址'">添加</el-button>
    </el-row>
    <el-table
        v-loading="loading"
        :align="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        :key="1"
        :data="tableData"
        :default-sort = "{prop: 'createTime'}"
        :header-cell-style="{'text-align':'center'}"
        border
        tooltip-effect="dark"
        style="width: 90%;">
      <el-table-column
          type="selection"
          sortable
          width="55">
      </el-table-column>
      <el-table-column
          sortable
          prop="consignee"
          label="收货人">
      </el-table-column>
      <el-table-column
          sortable
          prop="phone"
          label="手机号"
          width="100"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          sortable
          prop="city"
          label="地区"
          width="150"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          sortable
          prop="address"
          label="详细地址"
          width="150"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          sortable
          prop="label"
          label="标签"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          sortable
          prop="isDefault"
          label="默认地址"
          width="150"
          show-overflow-tooltip>
        <template #default="{row}">
          <span v-if="row.isDefault !== ''">
            <el-button size="mini" type="success" v-if="row.isDefault === 1">是</el-button>
            <el-button size="mini" type="warning" v-else>不是</el-button>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作"  width="150">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="success" @click="exitAdd(scope.$index, scope.row)">修改</el-button>
          <el-button
              size="mini"
              type="danger" @click="delAdd(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page= page.pageNum
        :page-sizes="[5, 10]"
        :page-size = page.size
        layout="total, sizes, prev, pager, next, jumper"
        :total= page.total
        style="margin-top: 33px">
    </el-pagination>
    <el-dialog :title="dialogForm.title" :visible.sync="dialogForm.dialogFormVisible" width="30%"
               style="text-align: center" @close="cancelDialog('ruleForm')" >
      <el-form :model="dialogForm.form" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="收货人" prop="consignee">
          <el-input  v-model="dialogForm.form.consignee" class="ellin" placeholder="收货人" autocomplete="off" clearable ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input  v-model="dialogForm.form.phone"  class="ellin" placeholder="手机号" autocomplete="off" clearable ></el-input>
        </el-form-item>
        <el-form-item label="地区" prop="city">
          <el-input v-model="dialogForm.form.city" class="ellin" placeholder="所在地区" autocomplete="off" clearable ></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="dialogForm.form.address"  class="ellin" placeholder="详细地址" autocomplete="off" clearable ></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="label" >
          <el-select v-model="dialogForm.form.label" clearable placeholder="标签">
            <el-option label="家" value="家"></el-option>
            <el-option label="公司" value="公司"></el-option>
            <el-option label="学校" value="学校"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="默认地址" prop="isDefault" >
          <el-select v-model="dialogForm.form.isDefault" clearable placeholder="默认地址">
            <el-option label="是" value = "1" ></el-option>
            <el-option label="不是" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="cancelDialog('ruleForm')">取 消</el-button>
        <el-button type="primary" v-show="dialogForm.title === '新增地址'"  @click="addAddre('ruleForm')">添加</el-button>
        <el-button type="primary" v-show="dialogForm.title === '修改地址'" @click="updateAdd('ruleForm')">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addressByPage,addAddress,exitAddress,delAddress,getAddressById} from "../../../api/Consumer/AddressManger/AddressMange";

export default {
  name: "AddressManger",
  data(){
    return{
      dialogForm:{
        dialogFormVisible:false,
        title:'',
        form:{
          consignee:'',
          phone:'',
          city:'',
          address:'',
          label:'',
          isDefault:0
        }
      },
      userId:null,
      listSelect:{

      },
      loading:false,
      tableData:[],
      page:{
        pageNum:1,
        pageSize:10,
        total:undefined
      },
      rules:{
        consignee:[
          { required:true, message: '收货人不能为空', trigger: 'blur' },
        ],
        phone:[
          { required: true, message: '电话号码不能为空', trigger: 'blur' },
          { required: true,min:11,max:11, message: '手机号不符合要求', trigger: 'blur' },
        ],
        city:[
          {required:true, message: "地区不能为空", trigger: 'blur' },
        ],
        address:[
          {required:true, message: "详细地址不能为空", trigger: 'blur' },
        ],
        isDefault:[
          {required:true, message: "是否是默认地址不能为空", trigger: 'blur' },
        ]
      }
    }
  },
  methods:{
    cancelDialog(formName){
      this.$refs[formName].resetFields();
      this.dialogForm.dialogFormVisible=false
      this.dialogForm.form = {}
    },
    updateAdd(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.dialogForm.form.isDefault)
          if (this.dialogForm.form.isDefault === '是' || this.dialogForm.form.isDefault === '不是'){
            this.dialogForm.form.isDefault === '' ? this.dialogForm.form.isDefault=null : this.dialogForm.form.isDefault === '是' ? this.dialogForm.form.isDefault= 1 : this.dialogForm.form.isDefault = 0
          }
          let query = {
            userId:this.userId,
            ...this.dialogForm.form
          }
          console.log(query)
          exitAddress(query).then((res) => {
            if (res.data.status === 0) {

              this.$message.success(res.data.msg);
              this.pageUtil(1,this.page.pageSize)
              this.dialogForm.dialogFormVisible = false
            } else
              this.$message.error(res.data.msg)
          })
        } else {
          return false;
        }
      })

    },
    addAddre(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let query = {
            userId:this.userId,
            ...this.dialogForm.form
          }
          addAddress(query).then((res)=>{
            console.log(res)
            if(res.data.status === 0){
              this.dialogForm.dialogFormVisible = false
              this.$message.success(res.data.msg);
              this.pageUtil(1,this.page.pageSize)
            }else
              this.$message.error(res.data.msg)
          })
        } else {
          return false;
        }
      });
      addAddress()
    },
    exitAdd(index,row){
      console.log(index,row)
      let query = {
        addressId : row.addressId
      }
      getAddressById(query).then(res=>{
        if(res.data.status === 0){
          console.log(res.data)
          res.data.data.isDefault === 1 ? res.data.data.isDefault = '是': res.data.data.isDefault = '不是'
          this.dialogForm.form = res.data.data
          this.dialogForm.title = "修改地址"
          this.dialogForm.dialogFormVisible = true
        }
      })
    },
    delAdd(index,row){
      if(!confirm("确定删除该地址吗？")){
        return 0
      }
      console.log(index,row)
      let query = {
        addressId : row.addressId,
        userId:this.userId
      }
      delAddress(query).then(res=>{
        if(res.data.status === 0){
          this.$message.success(res.data.msg)
          this.pageUtil(1,this.page.pageSize)
        }else{
          this.$message.error(res.data.msg)
        }
      })

    },
    handleSizeChange(val){
      this.page.pageSize = val
      this.pageUtil(this.page.pageNum,this.page.pageSize)
    },
    handleCurrentChange(val){
      this.page.pageNum = val
      this.pageUtil(this.page.pageNum,this.page.pageSize)
    },
    pageUtil(pageNum,pageSize){
      this.loading = true
      let query = {
        userId : this.userId,
        pageNum : pageNum,
        pageSize : pageSize
      }
      console.log(query)
      addressByPage(query).then(res=>{
        if (res.data.status === 0){
          console.log(res.data.data)
          this.tableData = res.data.data.addressList
          this.page.total = res.data.data.pageTotal
        }
      }).finally(()=>{
        this.loading = false
      })
    }
  },
  mounted() {
    let lander=JSON.parse(localStorage.lander);
    this.userId = lander.id
    this.pageUtil(1,this.page.pageSize)
  }
}
</script>

<style scoped>
.addressManger{
  width: 1100px;
  height: auto;
  margin-left: 200px;
  margin-top: 100px;
}
.ellin{
  width: 70%;
}
</style>
