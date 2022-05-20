<template>
  <div class="evalution">
    <el-form :inline="true" :model="listSelect"  class="demo-form-inline">
      <el-form-item>
        <el-select v-model="listSelect.evaluation" placeholder="评价状态" clearable>
          <el-option  label="好评" value="1"></el-option>
          <el-option  label="中评" value="2"></el-option>
          <el-option  label="差评" value="3"></el-option>
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
      <!--      <el-button type="success" plain @click="dialogForm.dialogFormVisible = true;dialogForm.title='下单'">添加</el-button>-->
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
          prop="orderId"
          label="订单编号">
      </el-table-column>
      <el-table-column
          sortable
          prop="evaluation"
          label="评价"
          show-overflow-tooltip>
        <template #default="{row}">
          <span v-if="row.isDefault !== null">
            <el-tag  type="warning" v-if="row.evaluation === 1">好评</el-tag>
            <el-tag  type="success" v-else-if="row.evaluation === 2">中评</el-tag>
            <el-tag  type="primary" v-else-if="row.evaluation === 3">差评</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column
          sortable
          prop="commentNote"
          label="评语"
          width="200"
          show-overflow-tooltip>
      </el-table-column>
<!--      <el-table-column label="操作" width="260">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--              size="mini"-->
<!--              type="danger"  @click="delEvaluation(scope.$index, scope.row)">删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
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
  </div>
</template>

<script>
import {evaluationByPage} from "../../../api/Sender/Evaluation/Evaluation";

export default {
  name: "SenderEvaluation",
  data(){
    return{
      loading:false,
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
      listSelect:{
        evaluation:''
      },
      timeSelect:null,
      tableData:[],
      page:{
        pageNum:1,
        size:10,
        total:0
      }
    }
  },
  methods:{
    // delEvaluation(index,row){
    //   if(!confirm("确定要删除该评价"))
    //     return 0
    //   console.log(index,row)
    //
    //   let query = {
    //     userId:this.userId,
    //     orderId:row.orderId,
    //     commentId:row.commentId
    //   }
    //   delEvaluation(query).then(res=>{
    //     if(res.data.status === 0){
    //       this.$message.success(res.data.msg)
    //       this.onSubmit()
    //     }else{
    //       this.$message.error(res.data.msg)
    //     }
    //   })
    //
    // },
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
    handleCurrentChange(val){
      this.page.pageNum = val
      this.pageUtil(val,this.page.size)
    },
    handleSizeChange(val){
      this.page.size = val
      this.pageUtil(this.page.pageNum,val)
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
      console.log(query)
      evaluationByPage(query).then(res=>{
        if(res.data.status === 0){
          this.tableData = res.data.data.commentList
          this.page.total = res.data.data.pageTotal
          this.loading = false
        }
      }).finally(()=>{
        this.loading = false
      })
    },
    onSubmit(){
      this.pageUtil(1,this.page.size)
    }
  },
  mounted() {
    let lander=JSON.parse(localStorage.lander);
    this.userId = lander.id
    this.pageUtil(1,10)
  }
}
</script>

<style scoped>
.evalution{
  width: 1200px;
  margin-left: 200px;
  margin-top: 100px;
}
</style>
