<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">数据统计</a></el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    卡片视图区域-->
    <el-card>
      <!-- 2. 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 750px; height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
  // 1.导入 echarts
  import echarts from 'echarts'
  import _ from 'lodash'

  export default {
    name: 'Report',
    data () {
      return {
        // options 需要合并的数据
        options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
      }
    },
    created () {

    },
    mounted () {
      // 3. 此时页面上的元素 DOM 已经渲染完毕,基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('main'))

      // 4. 指定图表的数据和配置项
      this.axios.get('reports/type/1').then(res => {
        console.log(res)
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取折线图数据失败！')
        }
        const result = _.merge(res.data.data, this.options)
        // 5. 使用刚指定的数据和配置项显示图表。
        myChart.setOption(result)
      })

    },
    methods: {}
  }
</script>

<style lang="less" scoped>

</style>
