<template>
  <div id="admin-users">
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column prop="id" label="订单ID" width="150"></el-table-column>
      <el-table-column prop="user_name" label="用户"></el-table-column>
      <el-table-column prop="user_name" label="商品"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="orderStatus" label="订单状态">
        <template slot-scope="scope">
          <span v-if="scope.row.orderStatus == 1">待发货</span>
          <span v-if="scope.row.orderStatus == 2">发货</span>
          <span v-if="scope.row.orderStatus == 3">退货</span>
          <span v-if="scope.row.orderStatus == 4">已收货</span>
          <span v-if="scope.row.orderStatus == 5">申请换货</span>
          <span v-if="scope.row.orderStatus == 6">申请退货</span>
          <span v-if="scope.row.orderStatus == 7">已同意换货</span>
          <span v-if="scope.row.orderStatus == 8">已同意退货</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-button @click="lookGoods(scope.row)" size="mini">查看商品</el-button>
          <el-button @click="deliverGoode(scope.row, 7)" v-if="scope.row.orderStatus == 5" size="mini">同意换货</el-button>
          <el-button @click="deliverGoode(scope.row, 8)" v-if="scope.row.orderStatus == 6" size="mini">同意退货</el-button>
          <el-button @click="deliverGoode(scope.row, 2)" size="mini">发货</el-button>
          <el-button @click="deliverGoode(scope.row, 3)" size="mini">退货</el-button>
          <!--<el-button @click="deliverGoode(scope.row, 4)" size="mini">确认收货</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="提示"
      :visible.sync="orderGoodsDialogVisible"
      width="60%"
      center>
      <el-table
        :data="orderGoods"
        style="width: 100%">
        <el-table-column type="index" />
        <el-table-column prop="goods_name" label="商品" />
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="goods_count" label="数量" />
        <el-table-column prop="goods_count" label="销售额" >
          <template slot-scope="props">
            {{props.row.goods_count * props.row.price}}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="orderGoodsDialogVisible = false">关 闭</el-button>
  </span>
    </el-dialog>
  </div>

</template>

<script>
  import {getAllOrders, updateOrder,
    getGoodsList,// 获取订单商品
  } from '../../../api/index'
  export default {
    data() {
      return {
        tableData: [],
        orderGoodsDialogVisible: false,//订单商品
        orderGoods: [],//订单商品
      }
    },
    mounted(){
      this.getUsers();
    },
    methods: {
      // 查看订单商品
      lookGoods(row){
        getGoodsList(row.id).then(res=>{
          this.orderGoods = res.message
          this.orderGoodsDialogVisible = true
        })
      },
      // 发货
      async deliverGoode(row, number){
        console.log(row);
        // return;
        let result = await updateOrder(row.id,number);
        if(result.success_code === 200){
          this.$message({
            type: 'success',
            message: '修改状态成功'
          });
          row.orderStatus = number
        }
      },
      async getUsers(){
        const results = await getAllOrders();
        if(results.success_code === 200){
          this.tableData = results.message;
          console.log(this.tableData);
        }
      }
    }
  }
</script>

<style scoped>

</style>
