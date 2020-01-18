<template>
  <div>
<!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

<!--    卡片视图区域-->
    <el-card>
<!--      gutter: 槽，使得 el-row 内的两个 el-col 有20个间距-->
      <el-row :gutter="20">
        <el-col :span="8">
<!--          实现关键字搜索功能: -->
<!--          1.在 名为 请输入内容 的组件 el-input 内 v-model="queryInfo.query"-->
<!--          2.在名为 请输入内容 的组件 el-input 下面的 el-button 组件内-->
<!--          绑定单击事件 @click="getGoodsList"-->

<!--          实现清空 回到搜索前的页面: 在名为 请输入内容 的组件 el-input 内-->
<!--          添加 clearable 及监听清空事件 @clear="getGoodsList"-->
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    clearable
                    @clear="getGoodsList">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getGoodsList">
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

<!--      table 表格区域-->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template v-slot="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button size="mini"
                       type="danger"
                       icon="el-icon-delete"
                       @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

<!--      分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'List',
    data() {
      return {
        // 查询参数对象
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        // 商品列表
        goodsList: [],
        // 总数据条数,用来实现分页
        total: 0,
      }
    },
    created () {
      this.getGoodsList()
    },
    methods: {
      // 通过分页的方式获取对应的商品列表,
      // get 的请求参数要由 params 属性来指定
      getGoodsList() {
        this.axios.get('goods', { params: this.queryInfo})
          .then(res => {
            if(res.data.meta.status !==200) {
              return this.$message.error('获取商品列表失败！')
            }
            this.$message.success('获取商品列表成功！')
            // console.log(res.data.data)
            this.goodsList = res.data.data.goods
            this.total = res.data.data.total
          }
        )
      },
      // 一旦触发 el-pagination 组件中的
      // @size-change="handleSizeChange"事件(一页显示几条数据），
      // 就利用其本身的形参 newSize，更新 qureyInfo 中的 pagesize，并重新获取数据
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getGoodsList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getGoodsList()
      },
      removeById(id) {
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          this.axios.delete(`goods/${id}`).then(res => {
            if(res.data.meta.status !==200) {
              return this.$message.error('删除失败！')
            }
            this.$message.success('删除成功！')
            this.getGoodsList()
          })
        })
          .catch(err => {
          return this.$message.info('已取消删除！')
        })
      },
      goAddpage() {
        this.$router.push('/goods/add')
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
