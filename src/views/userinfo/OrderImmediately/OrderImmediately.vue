<template>
  <div class="orderImmediately">
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
    <div slot="footer" class="dialog-footer" style="margin-left: 100px">
      <el-button type="primary" @click="addOrd('ruleForm')">添加</el-button>
      <el-button @click="cancelDialog('ruleForm')">取 消</el-button>
    </div>
  </div>
</template>

<script>
import {addOrder} from "../../../api/Consumer/Order/Order";
import {getAddressByUserId} from "../../../api/Consumer/AddressManger/AddressMange";

export default {
  name: "OrderImmediately",
  data(){
    return{
      dialogForm:{
        form:{
          takeUserName:'',
          phone:'',
          courierAddress:'',
          note:' ',
          bounty:'',
          courierNumber:''
        }
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
    cancelDialog(formName){
      this.$refs[formName].resetFields();
      this.dialogForm.dialogFormVisible=false
      this.dialogForm.form = {}
    },
    addOrd(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let query = {
            userId:this.userId,
            ...this.dialogForm.form
          }
          console.log(query)
          addOrder(query).then(res=>{
            if(res.data.status === 0){
              this.$message.success(res.data.msg)
              this.cancelDialog(formName)
            }else {
              this.$message.error(res.data.msg)
            }
          })
        } else {
          return false;
        }
      })
    },
  },
  mounted() {
    let lander=JSON.parse(localStorage.lander);
    this.userId = lander.id
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
.orderImmediately{
  margin-left: 150px;
  margin-top: 100px;
  width: 35%;
  height: auto;
  display: inline-block;
}
.ellin{
  width: 50%;
}
</style>
