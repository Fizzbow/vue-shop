<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'" v-else>已付款</el-tag>
            <el-tag type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">
          <template slot-scope="scope">
            <template>
              {{scope.row.is_send}}
            </template>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
              {{scope.row.create_time | dataFormate}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary"
            icon="el-icon-edit"
            @click="showBox"
            ></el-button>
            <el-button size="mini" type="success"
                       icon="el-icon-location"
                       @click = "showProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>


      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="queryInfo.pagenum"
          :page-sizes="[5,10,15]"
          :page-size="queryInfo.pagesize"
          layout="total, prev, pager, next"
          :total="total">
      </el-pagination>
    </el-card>


    <el-dialog
        title="提示"
        :visible.sync="addressDialogVisible"
        width="50%"
        @close="addressDialogClosed">
      <el-form :model="addressForm" :rules="addressFromRules" ref="addressFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省市区县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="addressDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
    </el-dialog>

    <el-dialog
        title="提示"
        :visible.sync="progressDialogVisible"
        width="50%"
        @close="addressDialogClosed">
      <el-timeline>
        <el-timeline-item v-for = "(activity,index) in progressData.data"
                          :timestamp = "activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import progressData from "./progressdata";
import cityData from './citydata'
export default {
  name: "Order",
  data() {
    return {
      queryInfo: {
        query:'',
        pagenum:1,
        pagesize:10
      },
      total:0,
      orderlist:[],
      addressForm:{
        address1: [],
        address2: ''
      },
      addressDialogVisible:false,
      addressFromRules:{
        address1:[
          { required: true, message: '请选择省市区县', trigger: 'change' }
        ],
        address2:[
          { required: true, message: '请输入详细地址', trigger: 'change' }
        ]
      },
      cityData:cityData,
      progressDialogVisible:false,
      progressInfo:[],
      progressData:progressData,
    }
  },
  created() {
    this.getOrderList()
  },
  methods:{
    async getOrderList() {
      const { data : res } = await this.$http.get(
          'orders', {
            params: this.queryInfo
          })
      console.log(res)
      this.total = res.data.total
      this.orderlist = res.data.goods
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagenum = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    showBox() {
      this.addressDialogVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    showProgressBox() {
      console.log(progressData.data)
        this.progressDialogVisible = true
      }
    }
  }
</script>

<style lang="less" scoped>
.cascader{
  width: 100%;
}
</style>