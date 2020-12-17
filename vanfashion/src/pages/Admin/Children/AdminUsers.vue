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
    </el-table>
  </div>
</template>

<script>
  import {getAllUsers, searchusers} from '../../../api/index'
  export default {
    data() {
      return {
        searchName: '',
        tableData: []
      }
    },
    mounted(){
      this.getUsers();
    },
    methods: {
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
