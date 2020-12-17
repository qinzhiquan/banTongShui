<template>
  <div>
    <el-table
      :data="tempData"
      style="width: 100%">

      <el-table-column
        label="ID"
        prop="id">
        <template slot-scope="props">
          <el-input v-model="props.row.id"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="账号"
        prop="account">
        <template slot-scope="props">
          <el-input v-model="props.row.account"></el-input>
        </template>
      </el-table-column>
        <el-table-column label="密码" prop="pwd">
          <template slot-scope="props">
            <el-input v-model="props.row.pwd"></el-input>
          </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="props">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(props.row)">{{props.row.isAdd?'添加':'编辑保存'}}</el-button>

          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(props.$index, props.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="addAdmin" style="float: right">添加一行</el-button>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-count="pageNum"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
  import {changeGoodsInfo, getAlladmins,deleteAdmin, changeAdmin, addAdmin} from './../../../api/index';
  import {mapState} from 'vuex';
  import {mapActions} from 'vuex'

  export default {
    data() {
      return {
        currentIndex: 1,
        pageSize: 5,
        tableData: [],
        tempData: [],
      }
    },
    mounted(){
      this.getAlladmins();
    },
    methods: {
      // 添加管理员
      addAdmin(){
        this.tempData.push({
          id: '',
          account: '',
          pwd: '',
          isAdd: true,
        })
      },


      // 修改管理员信息
      async handleEdit(row){
        if(row.isAdd){

          let result = await addAdmin(row);
          if(result.success_code === 200){
            this.$message({
              type: 'success',
              message: '添加成功'
            });
          }
        }else{
          let result = await changeAdmin(row);
          if(result.success_code === 200){
            this.$message({
              type: 'success',
              message: '修改成功'
            });
          }
        }

      },

      // 删除管理员
      async handleDelete(index, row) {
        this.$confirm('您确定删除该管理员账号吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async() => {
		  let result = await deleteAdmin(row.id);
          if(result.success_code === 200){
            this.$message({
              type: 'success',
              message: '已删除'
            });
          }
          this.getAlladmins();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleCurrentChange(val) {
        this.currentIndex = val;
        this.tempData = [];
        this.tableData.forEach((data,index)=>{
          if(index >= (this.currentIndex-1) * this.pageSize && index < (this.currentIndex) * this.pageSize){
            this.tempData.push(data);
          }
        });
      },
      async getAlladmins(){
        this.tempData = []
        let result = await getAlladmins();
        if(result.success_code === 200){
          this.tableData = result.message;
          this.tableData.forEach((data,index)=>{
            if(index >= (this.currentIndex-1) * this.pageSize && index < (this.currentIndex) * this.pageSize){
              this.tempData.push(data);
            }
          });
        }
      },
    },
    computed: {
      pageNum(){
        return Math.ceil(this.tableData.length / this.pageSize);
      }
    },
    filters: {
      priceFormat(price) {
        return price.toFixed(2);
      },
    },
  }
</script>

<style scoped>
  .el-table{
    margin: 20px auto 50px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .el-pagination{
    text-align: center;
  }
</style>

