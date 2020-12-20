<template>
  <div>
    <el-card>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="商品分类">
          <el-select v-model="searchForm.categoryId" clearable filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.cate_id"
              :label="item.cate_name"
              :value="item.cate_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.goodsName" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!--:summary-method="getSummaries"-->
    <!--show-summary-->
    <el-table

      :data="tempData"
      style="width: 100%">
      <el-table-column
        type="index"
        width=50>
      </el-table-column>
      <el-table-column label="商品名称" prop="goods_name" width=300></el-table-column>
      <el-table-column label="商品价格" prop="goods_price" width=150></el-table-column>
      <el-table-column label="购买数量" prop="goods_count" width=150></el-table-column>
      <!--<el-table-column prop="orderStatus" label="订单状态">-->
        <!--<template slot-scope="scope">-->
          <!--<span v-if="scope.row.orderStatus == 1">待发货</span>-->
          <!--<span v-if="scope.row.orderStatus == 2">发货</span>-->
          <!--<span v-if="scope.row.orderStatus == 3">退货</span>-->
          <!--<span v-if="scope.row.orderStatus == 4">已收货</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="商品图片" prop="isActive" width=150>
        <template slot-scope="props">
          <img :src="props.row.image_url" style="width:70px"/>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" prop="isActive" width=150>
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

      <el-table-column label="操作" width="350">
        <template slot-scope="scope">
          <el-button v-if="scope.row.state == null" @click="deliverGoode(scope.row, 5)" size="mini">申请换货</el-button>
          <el-button v-if="scope.row.state == null" @click="deliverGoode(scope.row, 6)" size="mini">申请退货</el-button>
          <el-button v-if="scope.row.orderStatus != 4" @click="deliverGoode(scope.row, 4)" size="mini">确认到货</el-button>
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
  import {
    changeGoodsInfo,
    getAllgoods,deleteRecomGoods,
    searchgoods2,
    getCategory,
    getUserOrder,
    updateOrder,//确认收货
    exchangeOrderGoods,//申请退换货
  } from './../../../api/index';
  import {mapState} from 'vuex';
  import {mapActions} from 'vuex'

  export default {
    data() {
      return {
        options: [],//商品分类
        searchForm: {
          userId: null,
          goodsName: '',
          categoryId: ''
        },//搜索栏数据
        category: ['热门男鞋','热门女鞋','服饰、箱包','电子产品','美食宝典'],
        currentIndex: 1,
        pageSize: 5,
        tableData: [],
        tempData: [],
      }
    },
    mounted(){
      this.getUserOrderFun();
      //获取商品分类
      getCategory().then(res=>{
        this.options = res.message
      })
    },
    methods: {
      // 申请换货
      changeGoode(row, num){
        let str = num == 1?'退货':'换货'
        const h = this.$createElement;
        this.$msgbox({
          title: '申请换货',
          message: h('p', null, [
            h('span', null, `确认申请${str}?`)
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              setTimeout(() => {
                done();
                setTimeout(() => {
                  let data = {
                    userId: JSON.parse(window.localStorage.getItem("userInfo")).id,
                    ordergoodsid: row.goods_id,
                    orderid: row.order_id,
                    count: row.goods_count,
                    price: row.price,
                    state: num

                  }
                  exchangeOrderGoods(data).then(res=>{
                    if(res.success){
                      this.$message.success(`${str}成功`)
                      this.getUserOrderFun()
                    }
                  })
                  instance.confirmButtonLoading = false;
                }, 300);
              }, 1000);
            } else {
              done();
            }
          }
        }).then(action => {

        }).catch(()=>{
          return;
        });

      },
      // 确认收货
      async deliverGoode(row, number){
        console.log(row);
        // return;
        let result = await updateOrder(row.order_id,number);
        if(result.success_code === 200){
          this.$message({
            type: 'success',
            message: '修改状态成功'
          });
          row.orderStatus = number
        }
      },
      // 销量统计
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 2) {
            sums[index] = '销量统计';
          }else if(index == 3){
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
            } else {
              sums[index] = 'N/A';
            }
          }

        });

        return sums;
      },
      // 搜索商品
      async search(){
        this.tempData = []
        let userId = JSON.parse(window.localStorage.getItem("userInfo")).id;
        console.log(JSON.parse(window.localStorage.getItem("userInfo")));
        console.log(this.searchForm);
        let result = await getUserOrder(userId, this.searchForm.goodsName, this.searchForm.categoryId);
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
      async getUserOrderFun(){
        this.tempData = []
        if(!JSON.parse(window.localStorage.getItem("userInfo"))){
          this.$message.warning('获取信息失败，请重新登录')
          return;
        }
        let userId = JSON.parse(window.localStorage.getItem("userInfo")).id
        let result = await getUserOrder(userId);
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

