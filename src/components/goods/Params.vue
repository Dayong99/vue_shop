<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

<!--    卡片视图区域-->
    <el-card>
<!--      头部警告区域-->
      <el-alert
        show-icon
        title="注意:只允许为第三级分类设置相关参数!"
        type="warning"
        :closable="false">
      </el-alert>

<!--      选择商品分类 区域-->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类: </span>
<!--          选择商品分类的级联选择框-->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cartList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children' }"
            @change="handleChange"></el-cascader>
        </el-col>
      </el-row>

<!--      Tab 页签区域-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
<!--        添加动态参数面板-->
        <el-tab-pane label="动态参数" name="many">
<!--          添加参数 按钮-->
          <el-button type="primary"
                     size="mini"
                     :disabled="isBtnDisabled"
                     @click="addDialogVisible = true">添加参数</el-button>
<!--          动态参数 表格-->
          <el-table :data="manyTableData" border stripe>
<!--            竖列展开-->
            <el-table-column type="expand">
              <template v-slot="scope">
<!--                以 Tag 标签的形式循环渲染,展示所有属性-->
                <el-tag v-for="(item, i) in scope.row.attr_vals"
                        :key="i"
                        closable
                        @close="handleClose(i, scope.row)">{{item}}
                </el-tag>
<!--                属性添加组件-->
<!--                属性添加组件的输入文本框状态-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
<!--               属性添加组件的按钮状态-->
                <el-button v-else class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
<!--            索引 竖列-->
            <el-table-column type="index"></el-table-column>
<!--            参数名称 竖列-->
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
<!--            操作 竖列-->
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button size="mini"
                           type="primary"
                           icon="el-icon-edit"
                           @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini"
                           type="danger"
                           icon="el-icon-delete"
                           @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

<!--        添加静态属性面板-->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary"
                     size="mini"
                     :disabled="isBtnDisabled"
                     @click="addDialogVisible = true">添加属性</el-button>
<!--          静态属性表格-->
          <el-table :data="onlyTableData" border stripe>
            <!--            竖列展开-->
            <el-table-column type="expand">
              <template v-slot="scope">
                <!--                以 Tag 标签的形式循环渲染,展示所有属性-->
                <el-tag v-for="(item, i) in scope.row.attr_vals"
                        :key="i"
                        closable
                        @close="handleClose(i, scope.row)">{{item}}
                </el-tag>
                <!--                属性添加组件-->
                <!--                属性添加组件的输入文本框状态-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!--               属性添加组件的按钮状态-->
                <el-button v-else class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!--            索引竖列-->
            <el-table-column type="index"></el-table-column>
            <!--            属性名称竖列-->
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <!--            操作竖列-->
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button size="mini"
                           type="primary"
                           icon="el-icon-edit"
                           @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini"
                           type="danger"
                           icon="el-icon-delete"
                           @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

<!--    添加参数 对话框-->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
<!--      添加参数 对话框-->
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
    </el-dialog>

<!--    修改参数 对话框-->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <!--      修改参数 对话框-->
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editFormRef"
               label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Params',
    data() {
      return {
        cartList: [],
        // 级联选择框双向绑定到的被选中项目的数组
        selectedCateKeys: [],
        // 绑定到 el-tab 上的被激活的页签名称,默认为 first
        activeName: 'many',
        // 动态参数的数据
        manyTableData: [],
        // 静态属性的数据
        onlyTableData: [],
        // 控制添加对话框的显示与隐藏
        addDialogVisible: false,
        // 添加参数 的表单数据对象
        addForm: {
          attr_name: ''
        },
        // 添加表单的验证规则对象
        addFormRules: {
          attr_name: [
            { required: true, message: '请输入参数名称', trigger: 'blur' },
          ]
        },
        // 控制 修改参数 对话框的显示与隐藏
        editDialogVisible: false,
        // 参数修改 的表单数据对象
        editForm: {
          attr_name: ''
        },
        // 修改参数 表单的验证规则
        editFormRules: {
          attr_name: [
            { required: true, message: '请输入参数名称', trigger: 'blur' },
          ]
        },
      }
    },
    created () {
      this.getCateList()
    },
    methods: {
      // 获取所有的商品分类列表
      getCateList() {
        this.axios.get('categories').then(res => {
          if(res.status !==200) {
            this.$message.error('获取商品分类失败!')
          }
          this.cartList = res.data.data
          // console.log(this.cartList)
        })
      },
      // 级联选择框选中项及下面的详情介绍发生变化,会触发函数getParamsData()
      handleChange() {
        this.getParamsData()
      },
      // el-tab 页签点击事件的处理函数 @tab-click
      // 监听的是 el-tab-pane 中的 name 属性
      // 当级联选择框选中项下面的详情介绍发生变化,会触发函数getParamsData()
      handleTabClick() {
        // console.log(this.activeName)
        this.getParamsData()
      },
      // 获取参数的列表数据
      getParamsData() {
        // 如果选中的不是三级分类,则清空选择框
        if(this.selectedCateKeys.length !== 3) {
          this.selectedCateKeys = []
          this.manyTableData = []
          this.onlyTableData = []
          return this.$message.info('注意:只允许为第三级分类设置相关参数!')
        }
        // 若选中的是三级分类,则不会发生变化
        // console.log(this.selectedCateKeys)
        // 根据所选分类 id,和当前所处理的面板(动态参数/静态属性),获取对应的参数
        this.axios.get(`categories/${this.cateId}/attributes`,
          {params: {sel: this.activeName}}).then(res => {
          if(res.status !==200) {
            return this.$message.error('获取参数列表失败!')
          }
          // 用split() 方法和 for循环 把字符串 attr_vals 分割成字符串数组
          res.data.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            // 为属性添加组件的 输入文本框状态 单独设置文本框的显示与隐藏
            item.inputVisible = false
            // 属性添加组件的 输入文本框状态 中文本框输入的值
            item.inputValue = ''
          })
          console.log(res.data.data)
          if(this.activeName === 'many') {
            this.manyTableData = res.data.data
          }else this.onlyTableData = res.data.data
        })
      },
      // 监听 添加参数 对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields()
      },
      // 点击按钮,先利用 validate 进行校验,再添加参数
      addParams() {
        this.$refs.addFormRef.validate(valid => {
          if(!valid) return
          this.axios.post(`categories/${this.cateId}/attributes`,
            {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeName
            }).then(res => {
              // console.log(res)
            if(res.data.meta.status !==201) {
              return this.$message.error('添加参数失败!')
            }
            this.$message.success('添加参数成功!')
            this.addDialogVisible = false
            this.getParamsData()
          })
        })
      },
      // 点击按钮,展示修改的对话框
      showEditDialog(attr_id) {
        // 查询当前参数的信息
        this.axios.get(`categories/${this.cateId}/attributes/${attr_id}`,
          {params: {attr_sel: this.activeName}}).then(res => {
            if(res.status !==200) {
              return this.$message.error('获取参数信息失败!')
            }
            this.editForm = res.data.data
        })
        this.editDialogVisible = true
      },
      // 参数修改 对话框关闭后重置表单
      editDialogClosed() {
        this.$refs.editFormRef.resetFields()
      },
      // 点击 修改参数 对话框的 确定 按钮,
      // 先利用 validate 进行校验,再添加参数,再修改参数信息
      editParams() {
        this.$refs.editFormRef.validate(valid => {
          if(!valid) return
        })
        this.axios.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }).then(res =>{
            if(res.data.meta.status !==200) {
              return this.$message.error('修改参数失败!')
          }
          this.$message.success('修改参数成功!')
          this.editDialogVisible = false
          this.getParamsData()
        })
      },
      // 根据 id 删除对应的参数项
      removeParams(attr_id) {
        this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          this.axios.delete(
            `categories/${this.cateId}/attributes/${attr_id}`).then(res => {
            console.log(res)
            if(res.data.meta.status !==200) {
                return this.$message.error('删除参数失败！')
              }
            this.$message.success('删除参数成功!')
            this.getParamsData()
          })
        }).catch(err => {
          return this.$message.info('已取消了删除')
        })
      },
      // 在属性添加组件的输入文本框状态下,
      // 当文本框失去焦点或按下了 enter 键时都会触发
      handleInputConfirm(row) {
        // trim: 除掉字符串两端的空格
        if(row.inputValue.trim().length === 0) {
          row.inputValue = ''
          row.inputVisible = false
          return
        }
        // 如果没有return出去,则需要做后续处理
        // join: 将数组中的所有元素放入一个字符串
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        // 需要发起请求,保存这次操作
        this.saveAttrVals(row)
      },
      // 在属性添加组件的按钮状态下,点击则进入文本输入框状态
      showInput(row) {
        row.inputVisible = true
        // 在属性添加组件的按钮状态下,点击则进入文本输入框状态后,文本框自动获得焦点
        // 使用$nextTick 方法的原因,就是防止当 scope.row.inputVisible = true 时,
        // 页面上还未渲染出 属性添加组件 的 文本框输状态
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        });
      },
      // 删除对应的参数和选项
      handleClose(i, row) {
        row.attr_vals.splice(i, 1)
        this.saveAttrVals(row)
      },
      // 将对 attr_vals 的操作保存到数据库
      saveAttrVals(row) {
        this.axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
          {
            attr_name: row.attr_name,
            attr_sel: row.attr_sel,
            attr_vals: row.attr_vals.join(' ')
          }).then(res => {
          console.log(res)
          if(res.data.meta.status !==200) {
            return this.$message.error('修改参数项失败!')
          }
          this.$message.success('修改参数项成功!')
        })
      }
    },
    computed: {
      // 如果按钮需要被禁用,则返回 true,否则返回 false.
      isBtnDisabled() {
        if(this.selectedCateKeys.length !==3) {
          return true
        }
        return false
      },
      // 当前选中的三级分类的 id
      cateId() {
        if(this.selectedCateKeys.length ==3) {
          return this.selectedCateKeys[2]
        }
        return null
      },
      // 动态计算添加参数对话框的标题文本
      titleText() {
        if(this.activeName === 'many') {
          return '动态参数'
        }
        return '静态属性'
      }
    }
  }
</script>

<style lang="less" scoped>
  .cat_opt {
  margin: 15px 0;
  }
  .el-tag {
    margin: 10px;
  }
  .input-new-tag {
    width: 120px;
  }
</style>
