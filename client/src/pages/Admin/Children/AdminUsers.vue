<template>
  <div id="admin-users">
    <el-card>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="searchName" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="用户ID">
      </el-table-column>
      <el-table-column
        prop="user_name"
        label="账号">
      </el-table-column>
      <el-table-column
        prop="user_phone"
        label="手机">
      </el-table-column>
      <el-table-column
        prop="user_nickname"
        label="昵称">
      </el-table-column>
      <el-table-column
        prop="user_address"
        label="住址">
      </el-table-column>
      <el-table-column label="操作">
      <template slot-scope="props">
        <el-button size="mini" @click="lookUserOrder(props.row)">查看订单</el-button>

      </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="提示"
      :visible.sync="userOrderDialogVisible"
      width="60%"
      center>
      <el-table
        :data="userOrderData"
        style="width: 100%">
        <el-table-column prop="id" label="用户ID" />

        <el-table-column prop="user_name" label="账号" />
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
    <el-button type="primary" @click="userOrderDialogVisible = false">关 闭</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getAllUsers,
    searchusers,
    getOrderList,// 获取单个用户订单
  } from '../../../api/index'
  export default {
    data() {
      return {
        searchName: '',
        tableData: [], //表格数据
        userOrderDialogVisible: false,//用户订单弹框
        userOrderData: [],//用户订单
      }
    },
    mounted(){
      this.getUsers();
    },
    methods: {
      // 查看用户订单
      lookUserOrder(row){
        getOrderList(row.id).then(res=>{
          this.userOrderData = res.message
          this.userOrderDialogVisible = true
        })
      },
      // 搜索用户
      async search(){
        this.tempData = []
        let result = await searchusers({searchName: this.searchName});
        if(result.success_code === 200){
          this.tableData = result.message;
          this.tableData.forEach((data,index)=>{
            if(index >= (this.currentIndex-1) * this.pageSize && index < (this.currentIndex) * this.pageSize){
              this.tempData.push(data);
            }
          });
        }
      },
      async getUsers(){
        const results = await getAllUsers();
        if(results.success_code === 200){
          this.tableData = results.message;
        }
      }
    }
  }
</script>

<style scoped>

</style>
