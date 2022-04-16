<template>
  <div class="order">
    <el-form :inline="true" :model="listSelect"  class="demo-form-inline">
      <el-form-item>
        <el-select v-model="listSelect.orderStatus" placeholder="订单状态" clearable>
          <el-option label="未接单" value="1"></el-option>
          <el-option label="已接单" value="2"></el-option>
          <el-option label="配送中" value="3"></el-option>
          <el-option label="完成订单" value="4"></el-option>
          <el-option label="取消订单" value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
            v-model="timeSelect"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row style="margin-bottom: 10px">
      <el-button type="success" plain @click="dialogForm.dialogFormVisible = true;dialogForm.title='下单'">添加</el-button>
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
          prop="courierNumber"
          label="快递单号">
      </el-table-column>
      <el-table-column
          sortable
          prop="bounty"
          label="赏金"
          width="80"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          sortable
          prop="payStatus"
          label="支付状态"
          show-overflow-tooltip>
        <template #default="{row}">
          <span v-if="row.isDefault !== null">
            <el-button size="mini" type="warning" v-if="row.payStatus === 1">未支付</el-button>
            <el-button size="mini" type="success" v-else-if="row.payStatus === 2">已支付</el-button>
            <el-button size="mini" type="primary" v-else-if="row.payStatus === 3">已退款</el-button>
          </span>
        </template>
      </el-table-column>
      <el-table-column
          sortable
          prop="orderStatus"
          label="订单状态"
          show-overflow-tooltip>
        <template #default="{row}">
          <span v-if="row.orderStatus !== null">
            <el-button size="mini" type="primary" round v-if="row.orderStatus === 1">未接单</el-button>
            <el-button size="small" type="success" round v-else-if="row.orderStatus === 2">已接单</el-button>
            <el-button size="small" type="info" round v-else-if="row.orderStatus === 3">配送中</el-button>
            <el-button size="small" type="warning" round v-else-if="row.orderStatus === 4">完成订单</el-button>
            <el-button size="small" type="danger" round v-else-if ="row.orderStatus === 5">订单已取消</el-button>
          </span>
        </template>
      </el-table-column>
      <el-table-column
          sortable
          prop="createTime"
          label="下单时间"
          width="200"
          show-overflow-tooltip>
        <template #default="{row}">
          <span v-if="row.createTime">
            {{row.createTime | dateFormat}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="success" @click="exitOrder(scope.$index, scope.row)">取消订单</el-button>
          <el-button
              size="mini"
              type="danger" @click="delOrder(scope.$index, scope.row)">删除</el-button>
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
        <el-form-item label="取件人" prop="takeUserName">
          <el-input  v-model="dialogForm.form.takeUserName" class="ellin" placeholder="取件人" autocomplete="off" clearable ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input  v-model="dialogForm.form.phone"  class="ellin" placeholder="手机号" autocomplete="off" clearable ></el-input>
        </el-form-item>
        <el-form-item label="快递单号" prop="courierNumber">
          <el-input  v-model="dialogForm.form.courierNumber"  class="ellin" placeholder="快递单号" autocomplete="off" clearable ></el-input>
        </el-form-item>
        <el-form-item label="收货地址" prop="courierAddress">
          <el-select v-model="dialogForm.form.courierAddress" placeholder="收货地址">
            <el-option v-for="(address,index) in addressList" :key="index" :label="address.addressDetail" :value="address.addressDetail"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="note" >
          <el-input  v-model="dialogForm.form.note"  class="ellin" placeholder="备注" autocomplete="off" clearable ></el-input>
        </el-form-item>
        <el-form-item label="赏金" prop="bounty" >
          <el-input  v-model="dialogForm.form.bounty"  class="ellin" placeholder="赏金" autocomplete="off" clearable ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="cancelDialog('ruleForm')">取 消</el-button>
        <el-button type="primary" v-show="dialogForm.title === '下单'"  @click="addOrd('ruleForm')">添加</el-button>
        <el-button type="primary" v-show="dialogForm.title === '修改订单'" @click="updateOrd('ruleForm')">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addOrder, orderByPage, exitOrder, delOrder} from "../../../api/Consumer/Order/Order";
import {getAddressByUserId} from  '../../../api/Consumer/AddressManger/AddressMange'

export default {
  name: "Order",
  data(){
    return{
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      dialogForm:{
        dialogFormVisible:false,
        title:'',
        form:{
          takeUserName:'',
          phone:'',
          courierAddress:'',
          note:'',
          bounty:'',
          courierNumber:''
        }
      },
      userId:null,
      listSelect:{
        orderStatus:''
      },
      timeSelect:null,
      loading:true,
      tableData:[],
      page:{
        pageNum:1,
        pageSize:10,
        total:0
      },
      addressList:[],
      rules:{
        takeUserName:[
          { required:true, message: '取件人不能为空', trigger: 'blur' },
        ],
        phone:[
          { required: true, message: '电话号码不能为空', trigger: 'blur' },
          { required: true,min:11,max:11, message: '手机号不符合要求', trigger: 'blur' },
        ],
        courierAddress:[
          {required:true, message: "收货地址不能为空", trigger: 'blur' },
        ],
        // note:[
        //   {required:true, message: "备注不能为空", trigger: 'blur' },
        // ],
        bounty:[
          {required:true, message: "赏金不能为空", trigger: 'blur' },
        ],
        courierNumber:[
          {required:true, message: "快递单号", trigger: 'blur' },
        ]
      }
    }
  },
  methods:{
    dateToDay (originVal){
      console.log(originVal)
      const dt = new Date(originVal)
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, '0')
      const d = (dt.getDate() + '').padStart(2, '0')
      const hh = "00"
      const mm = "00"
      const ss = "00"
      return `${y}.${m}.${d} ${hh}:${mm}:${ss}`
    },
    onSubmit(){
      this.pageUtil(1,this.page.pageSize)
    },
    addOrd(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let query = {
            userId:this.userId,
            ...this.dialogForm.form
          }
          addOrder(query).then(res=>{
            if(res.data.status === 0){
              this.$message.success(res.data.msg)
              this.dialogForm.dialogFormVisible = false
              this.onSubmit()
            }else {
              this.$message.error(res.data.msg)
            }
          })
        } else {
          return false;
        }
      })
    },
    updateOrd(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // let query = {
          // }
        } else {
          return false;
        }
      })
    },
    exitOrder(index,row){
      if(!confirm("确认取消此订单吗?"))
        return 0
      console.log(index,row)
      if(row.orderStatus === 2){
        this.$message.error("订单配送中,不可以取消")
        return 0
      }
      if(row.orderStatus === 4){
        this.$message.error("订单已完成,不可以取消")
        return 0
      }
      if(row.orderStatus === 5){
        this.$message.error("订单已取消,不可以再次取消")
        return 0
      }
      exitOrder(row.orderId).then(res=>{
        if(res.data.status === 0){
          this.$message.success(res.data.msg)
          this.onSubmit()
        }else {
          this.$message.error(res.data.msg)
        }
      })
    },
    delOrder(index,row){
      if(!confirm("确认删除此订单吗?"))
        return 0
      console.log(index,row)
      if(row.orderStatus === 0){
        this.$message.error("未接单,不可以删除")
      }
      if(row.orderStatus === 1){
        this.$message.error("已接单,不可以删除")
      }
      if(row.orderStatus === 2){
        this.$message.error("订单配送中,不可以删除")
      }
      let query = {
        userId:this.userId,
        orderId: row.orderId
      }
      delOrder(query).then(res=>{
        if(res.data.status === 0){
          this.$message.success(res.data.msg)
          this.onSubmit()
        }else{
          this.$message.error(res.data.msg)
        }
      })

    },
    cancelDialog(formName){
      this.$refs[formName].resetFields();
      this.dialogForm.dialogFormVisible=false
      this.dialogForm.form = {}
    },
    handleCurrentChange(val){
      this.page.pageNum = val
      this.pageUtil(val,this.page.pageSize)
    },
    handleSizeChange(val){
      this.page.pageSize = val
      this.pageUtil(1,val)
    },
    pageUtil(pageNum,pageSize){
      this.loading = true
      let query = {
        userId:this.userId,
        pageNum: pageNum,
        pageSize: pageSize,
        ...this.listSelect,
        startTime:this.timeSelect === null ? '':this.dateToDay(this.timeSelect[0]),
        endTime:this.timeSelect === null ? '':this.dateToDay(this.timeSelect[1])
      };
      orderByPage(query).then(res=>{
        if(res.data.status === 0){
          console.log(res.data)
          this.tableData = res.data.data.orderList
          this.page.total = res.data.data.pageTotal
          this.loading = false
        }
      }).finally(()=>{
        this.loading = false
      })

    }
  },
  mounted() {
    let lander=JSON.parse(localStorage.lander);
    this.userId = lander.id
    this.pageUtil(1,10)

    getAddressByUserId(this.userId).then(res=>{
      if(res.data.status === 0){
        console.log(res.data.data)
        this.addressList = res.data.data
      }else{
        this.$message.error(res.data.msg)
      }
    })
  }

}
</script>

<style scoped>
.order{
  width: 1200px;
  margin-left: 200px;
  margin-top: 100px;
}
.ellin{
  width: 70%;
}
</style>
