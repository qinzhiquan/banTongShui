<template>
  <div>
    <el-card>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="商品名称">
          <el-input v-model="searchName" clearable filterable placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-table
      :data="tempData"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品名称">
              <span>{{ props.row.short_name }}</span>
            </el-form-item>
            <el-form-item label="商品 ID">
              <span>{{ props.row.goods_id }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ category[props.row.category - 1] }}</span>
            </el-form-item>
            <el-form-item label="商品价格">
              <span>{{ (props.row.price / 100) | priceFormat}}</span>
            </el-form-item>
            <el-form-item label="商品库存">
              <span>{{ props.row.counts }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.goods_name }}</span>
            </el-form-item>
            <el-form-item label="商品图片">
              <img :src="props.row.thumb_url" style="width:70px"/>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        label="名称"
        prop="short_name" width=150>
      </el-table-column>
        <el-table-column label="销量" prop="sum(goods_count)" width=150>
      </el-table-column>
      <el-table-column label="状态" prop="isActive" width=150>
        <template slot-scope="props">
          <span>{{ props.row.isActive?'上架中':'下架中' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="描述"
        prop="goods_name">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="props">
          <el-button
            size="mini"
            @click="handleEdit(props.$index, props.row)">编辑</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleChange(props.$index, props.row)">{{ props.row.isActive?'下架':'上架' }}</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(props.$index, props.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-count="pageNum"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
  import {changeGoodsInfo, getAllgoods,deleteRecomGoods, searchgoods2} from './../../../api/index';
  import {mapState} from 'vuex';
  import {mapActions} from 'vuex'

  export default {
    data() {
      return {
        searchName: '',
        category: ['热门男鞋','热门女鞋','服饰、箱包','电子产品','美食宝典'],
        currentIndex: 1,
        pageSize: 5,
        tableData: [],
        tempData: [],
      }
    },
    mounted(){
      this.getAllGoods();
    },
    methods: {
      // 搜索商品
      async search(){
        this.tempData = []
        let result = await searchgoods2({name: this.searchName});
        if(result.success_code === 200){
          this.tableData = result.message;
          this.tableData.forEach((data,index)=>{
            if(index >= (this.currentIndex-1) * this.pageSize && index < (this.currentIndex) * this.pageSize){
              this.tempData.push(data);
            }
          });
        }
      },
      // 商品下架
      async handleChange(index, row){
        row.isActive = !row.isActive
        let result = await changeGoodsInfo(row);
        if(result.success_code === 200){
          this.$message({
              type: 'success',
              message: row.isActive?'上架成功':'下架成功'
            });
          this.$router.replace('/admin');
          getAllgoods();
        }
      },
      // 编辑商品
      handleEdit(index, row) {
        console.log(index, row);
        window.localStorage.setItem('goodsInfo',JSON.stringify(row));
        this.$router.replace('/admin/adminupdate');
      },
      // 删除商品
      async handleDelete(index, row) {
        this.$confirm('您确定永久删除该商品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async() => {
		  let result = await deleteRecomGoods(row.goods_id);
          if(result.success_code === 200){
            this.$message({
              type: 'success',
              message: '已删除'
            });
          }
          this.getAllGoods();
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
      async getAllGoods(){
        this.tempData = []
        let result = await getAllgoods();
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

