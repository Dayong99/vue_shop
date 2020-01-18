<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">订单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    卡片视图区域-->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append"
                       icon="el-icon-search">
            </el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--      订单列表数据-->
      <el-table :data="oderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status === 1">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button size="mini"
                       type="primary"
                       icon="el-icon-edit"
                       @click="showBox"></el-button>
            <el-button size="mini"
                       type="success"
                       icon="el-icon-location"
                       @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--      分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!--    修改地址对话框-->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%" @close="addressDialogClosed">
      <el-form :model="addressForm"
               :rules="addressFormRules"
               ref="addressFormRef"
               label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData"
                       v-model="addressForm.address1">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!--    展示物流进度对话框-->
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="50%">
      <!--      时间线-->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
  import cityData from './citydata'

  export default {
    name: 'Order',
    data () {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        total: 0,
        oderList: [],
        addressVisible: false,
        addressForm: {
          addressForm: [],
          address2: ''
        },
        addressFormRules: {
          address1: [
            { required: true, message: '请选择省市区/县', trigger: 'blur' }
          ],
          address2: [
            { required: true, message: '请填写详细地址', trigger: 'blur' }
          ]
        },
        cityData,
        progressDialogVisible: false,
        progressInfo: ''
      }
    },
    created () {
      this.getOrderList()
    },
    methods: {
      getOrderList () {
        this.axios.get(
          'orders', { params: this.queryInfo }).then(
          res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error('获取订单列表失败!')
            }
            // console.log(res.data)
            this.total = res.data.data.total
            this.oderList = res.data.data.goods
            // console.log(this.oderList)
          }
        )
      },
      handleSizeChange (newSize) {
        this.queryInfo.pagesize = newSize
        this.getOrderList()
      },
      handleCurrentChange (newPage) {
        this.queryInfo.pagenum = newPage
        this.getOrderList()
      },
      // 展示修改地址对话框
      showBox () {
        this.addressVisible = true
      },
      addressDialogClosed () {
        this.$refs.addressFormRef.resetFields()
      },
      showProgressBox () {
        this.axios.get('/kuaidi/1106975712662').then(
          res => {
            if (res.data.meta.status !== 200) {
              console.log(res)
              return this.$message.error('获取物流进度失败!')
            }
            this.progressInfo = res.data.data
            this.progressDialogVisible = true
            console.log(this.progressInfo)
          }
        )
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-cascader {
    width: 100%;
  }

  .el-dialog__body{
    width: 100%;
  }

  .el-timeline {
    margin: 0;
    font-size: 14px;
    list-style: none
  }

  .el-timeline .el-timeline-item:last-child .el-timeline-item__tail {
    display: none
  }

  .el-timeline-item {
    position: relative;
    padding-bottom: 20px
  }

  .el-timeline-item__wrapper {
    position: relative;
    padding-left: 28px;
    top: -3px
  }

  .el-timeline-item__tail {
    position: absolute;
    left: 4px;
    height: 100%;
    border-left: 2px solid #E4E7ED
  }

  .el-timeline-item__icon {
    color: #FFF;
    font-size: 13px
  }

  .el-timeline-item__node {
    position: absolute;
    background-color: #E4E7ED;
    border-radius: 50%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center
  }

  .el-timeline-item__node--normal {
    left: -1px;
    width: 12px;
    height: 12px
  }

  .el-timeline-item__node--large {
    left: -2px;
    width: 14px;
    height: 14px
  }

  .el-timeline-item__node--primary {
    background-color: #409EFF
  }

  .el-timeline-item__node--success {
    background-color: #67C23A
  }

  .el-timeline-item__node--warning {
    background-color: #E6A23C
  }

  .el-timeline-item__node--danger {
    background-color: #F56C6C
  }

  .el-timeline-item__node--info {
    background-color: #909399
  }

  .el-timeline-item__dot {
    position: absolute;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center
  }

  .el-timeline-item__content {
    color: #303133
  }

  .el-timeline-item__timestamp {
    color: #909399;
    line-height: 1;
    font-size: 13px
  }

  .el-timeline-item__timestamp.is-top {
    margin-bottom: 8px;
    padding-top: 4px
  }

  .el-timeline-item__timestamp.is-bottom {
    margin-top: 8px
  }
</style>
