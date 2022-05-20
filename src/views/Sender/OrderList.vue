<template>
  <el-container>
      <el-main style="margin: 0 0 0 10rem;align-items: center;" >
          <div style="text-align: center; margin-top: 100px">
            <el-form :inline="true"  class="demo-form-inline">
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
            <el-table
                v-loading="loading"
                :align="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}"
                :key="1"
                :data="tableData"
                
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
                  prop="takeUserName"
                  label="取件人姓名"
                  show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                  sortable
                  prop="phone"
                  label="联系电话"
                  show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                  sortable
                  prop="courierAddress"
                  label="收件地址"
                  show-overflow-tooltip>
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
                  prop="note"
                  label="备注"
                  width="80"
                  show-overflow-tooltip>
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
                      type="success" @click="receiveOd(scope.$index, scope.row)">接单</el-button>
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
          </div>
      </el-main>
  </el-container>
</template>

<script>
import {acceptOrder, receiveOrder} from '../../api/Sender/Order/Order'
  export default {
      name: "OrderList",
      data() {
          return {
            loading:true,
            userId:null,
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
            timeSelect:null,
            tableData:[],
            page:{
              pageNum:1,
              pageSize:10,
              total:0
            }
          }
      },
      methods: {
        handleSizeChange(val){
          this.page.pageSize = val
          this.pageUtil(this.page.pageNum,val)
        },
        handleCurrentChange(val){
          this.page.pageNum = val
          this.pageUtil(val,this.page.pageSize)
        },
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
        receiveOd(index,row){
          if(!confirm("确定配送此单吗?")){
            return 0
          }
          console.log(index,row)
          let query ={
            userId:this.userId,
            orderId:row.orderId,
            orderStatus:2
          }
          receiveOrder(query).then(res=>{
            if(res.data.status === 0){
              this.$message.success(res.data.msg)
              this.onSubmit()
            }else{
              this.$message.error(res.data.msg)
            }
          })
        },
        pageUtil(pageNum,pageSize) {
          this.loading = true
          let query = {
            pageNum,
            pageSize,
            startTime:this.timeSelect === null ? '' : this.dateToDay(this.timeSelect[0]),
            endTime:this.timeSelect === null ? '' : this.dateToDay(this.timeSelect[1])
          }
          acceptOrder(query).then(res=>{
            console.log(res.data)
            if(res.data.status === 0 ){
              this.tableData = res.data.data.orderList
              console.log("----------------");
              console.log(this.tableData);
              console.log("----------------");
              this.page.total = res.data.data.pageTotal
            }else{
              this.$message.error(res.data.msg)
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
      }
  }
</script>

<style scoped>

</style>



