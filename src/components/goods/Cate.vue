<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

<!--    卡片视图区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary"
                     @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

<!--      表格-->
      <tree-table class="treeTable"
                  :data="cateList"
                  :columns="columns"
                  :selection-type="false"
                  :expand-type="false"
                  show-index
                  index-text="#"
                  border
                  :show-row-hover="false">
<!--        是否有效竖列模板-->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success"
             v-if="scope.row.cat_deleted === false"
             style="color: lightgreen"></i>
          <i class="el-icon-error"
             v-else
             style="color: red"></i>
        </template>
<!--        排序竖列模板-->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag size="mini" v-else type="warning">三级</el-tag>
        </template>
<!--      操作竖列模板-->
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>

<!--      分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

<!--    添加分类 对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%" @close="addCateDialogClosed">
<!--      添加分类 对话框内的表单-->
      <el-form :model="addCateForm"
               :rules="addCateFormRules"
               ref="addCateFormRef"
               label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类父级:">
<!--          options 用来指定 el-cascader 组件中的数据源-->
<!--          props 用来指定配置对象-->
          <el-cascader
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              checkStrictly: true,
              value:'cat_id',
              label:'cat_name',
              children: 'children'}"
            v-model="selectedKeys"
            @change="parentCateChanged"
            clearable
            ></el-cascader>
<!--          expand-trigger="hover"-->
<!--          :options="parentCateList"-->
<!--          :props= "cascaderProps"-->
<!--          change-on-select-->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Cate',
    data() {
      return {
        // 查询条件设定
        querInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        // 商品分类列表数据
        cateList: [],
        // 总数据条数
        total: 0,
        // 为 tree-table 表格的指定列定义
        columns: [
          {
            label: '分类名称',
            prop: 'cat_name',
          },
          {
            label: '是否有效',
            // 将当前竖列定义为模板列
            type: 'template',
            // 表示当前这一列使用模板名称
            template: 'isok'
          },
          {
            label: '排序',
            // 将当前竖列定义为模板列
            type: 'template',
            // 表示当前这一列使用模板名称
            template: 'order'
          },
          {
            label: '操作',
            // 将当前竖列定义为模板列
            type: 'template',
            // 表示当前这一列使用模板名称
            template: 'opt'
          }
        ],
        // 控制添加分类对话框的显示与隐藏
        addCateDialogVisible: false,
        // 添加分类 的表单数据对象
        addCateForm: {
          // 将要添加的分类名称
          cat_name: '',
          // 父级分类的 id
          cat_pid: 0,
          // 分类的等级默认要添加的是一级分类
          cat_level: 0
        },
        // 添加分类 表单的验证规则对象
        addCateFormRules: {
          // 将要添加的分类名称
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
          ]
        },
        // 父级分类的列表
        parentCateList: [],
        // // 指定级联选择器的配置对象
        // cascaderProps: {
        //   value: 'cat_id',
        //   label: 'cat_name',
        //   children: 'children'
        // },
        // 选中的父级分类的 id 数组
        selectedKeys: []
      }
    },
    created () {
      this.getCateList()
    },
    methods: {
      // 获取商品分类数据
      getCateList() {
        this.axios.get('categories', {params: this.querInfo}).then(res => {
          // console.log(res.data)
          if(res.status !==200) {
            return this.$message.error('获取商品分类失败!')
          }
          // 将商品分类数据列表传到数组 cateList 中去
          this.cateList = res.data.data.result
          // 将商品分类数据中的总数据条数传到 dada 中的 total 中
          this.total = res.data.data.total
          // console.log(this.cateList)
          // console.log(this.total)
        })
      },
      // 监听 pagesize 改变
      handleSizeChange(newSize) {
        this.querInfo.pagesize = newSize
        this.getCateList()
      },
      // 监听 pagenum 改变
      handleCurrentChange(newPage) {
        this.querInfo.pagenum = newPage
        this.getCateList()
      },
      // 点击按钮，展示添加分类的对话框
      showAddCateDialog() {
        // 先获取父级分类的数据列表
        this.getParentCateList()
        // 再展示出对话框
        this.addCateDialogVisible = true
      },
      // 获取父级分类的数据列表
      getParentCateList() {
        this.axios.get('categories', {params: {type: 2}}).then(res => {
          console.log(res.data)
          if(res.status !==200) {
            return this.$message.error('获取父级分类失败!')
          }
          this.parentCateList = res.data.data
        })
      },
      // 父级分类的选择项发生变化时触发该函数
      parentCateChanged() {
        console.log(this.selectedKeys)
        // 如果 selectedKeys 中的 length 大于0.证明选中了分类,
        // 反之,说明没有选中任何父分类
        if(this.selectedKeys.length > 0) {
          // 为分类父级的 cat_pid 和 cat_level 赋值
          this.addCateForm.cat_pid =
            this.selectedKeys[this.selectedKeys.length -1]
          this.addCateForm.cat_level = this.selectedKeys.length
          return
        }else {
          this.addCateForm.cat_pid = 0
          this.addCateForm.cat_level = 0
        }
      },
      // 点击按钮,添加新的分类
      addCate() {
        this.$refs.addCateFormRef.validate(valid => {
          if(!valid) return
          this.axios.post('categories', this.addCateForm).then(res => {
            console.log(res)
            if(res.data.meta.status !==201) {
              return this.$message.error('添加分类失败!')
            }
          this.$message.success('添加分类成功!')
            this.getCateList()
            this.addCateDialogVisible = false
          })
        })
      },
      // 监听对话框的关闭,与此同时重置表单数据
      addCateDialogClosed() {
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys = []
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      }
    }
  }
</script>

<style lang="less" scoped>
  .treeTable {
    margin-top: 15px;
  }

  .el-cascader {
    width: 100%;
    height: 20px;
  }
</style>
