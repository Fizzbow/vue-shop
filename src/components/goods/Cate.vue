<template>
<div>
  <!-- 面包屑导航区域 -->
  <el-breadcrumb separator-class = "el-icon-arrow-right">
    <el-breadcrumb-item :to = "{ path: '/home' }" >首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>
<!--  卡片视图区域-->
  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary" @click="showCateDialog">添加分类</el-button>
      </el-col>
    </el-row>

<!--  表格-->
  <tree-table :data = "cateList"
  :columns = "columns" :selection-type = 'false'
              :expand-type = "false"
              show-index index-text = "#" border
              :show-row-hover = "false"
  >
<!--    是否有效列-->
  <template slot="isok" slot-scope="scope">
    <i class="el-icon-success"
    v-if="scope.row.cat_deleted === false"
       style="color: #55a532"
    ></i>
    <i class="el-icon-error"
    v-else style="color: #bd2c00"
    >
    </i>
  </template>
<!--    排序列-->
    <template slot="order" slot-scope="scope">
      <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
      <el-tag style="color: #55a532 " size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
      <el-tag type="warning" v-else size="mini">三级</el-tag>
    </template>
    <!--操作列-->
    <template slot="opt" slot-scope="scope">
      <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
    </template>
  </tree-table>
<!--  分页区域-->
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page = "querInfo.pagenum"
      :page-sizes="[3,5,10,15]"
      :page-size = "querInfo.pagesize"
      layout="total, sizes,prev, pager, next,jumper"
      :total="total">
  </el-pagination>
  </el-card>

  <!--    添加分类对话框-->
  <el-dialog
      title="添加分类"
      :visible.sync="addCatDialogVisible"
      @close=" addCatDialogClose"
      width="30%">
    <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
       >
      <el-form-item
          label="分类名称"
          prop="cat_name"
          ref = "addCateFormRef"
      >
        <el-input v-model="addCateForm.cat_name"></el-input>
      </el-form-item>

      <el-form-item label="父级分类">
<!--   options用来指定数据源     props用来指定配置对象-->
        <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            change-on-select
        ></el-cascader>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="addCatDialogClose">取 消</el-button>
    <el-button type="primary"
               @click="addCate">确 定</el-button>
  </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      querInfo: {
        type:3,
        pagenum:3,
        pagesize:5
      },
      cateList: [],
      total:0,
      columns: [
        {
          label:'分类名称',
          prop:'cat_name'
        },
        {
          label: '是否有效',
          //表示将当前列定义为模板列
          type:'template',
          //表示当前这一系列使用模板名称
          template:'isok'
        },
        {
          label: '排序',
          //表示将当前列定义为模板列
          type:'template',
          //表示当前这一系列使用模板名称
          template:'order'
        },
        {
          label: '操作',
          //表示将当前列定义为模板列
          type:'template',
          //表示当前这一系列使用模板名称
          template:'opt'
        }
      ],
      addCatDialogVisible:false,
      addCateForm:{
        //将要添加的分类名称
        cat_name :'',
        //父级分类的Id
        cat_pid : 0,
        //分类的等级，默认添加的是一级分类
        cat_level : 0
      },
      addCateFormRules:{
        cat_name: [
          { required: true, message: '请输入分类名称',trigger:'blur'}
        ]
      },
      //父级分类的列表
      parentCateList : [],
      cascaderProps : {
        expandTrigger: 'hover',
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      selectedKeys:[]
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
        const {data:res} = await this.$http.get('categories',{ params : this.querInfo});
        if (res.meta.status !== 200) {
          return this.message.error('获取商品分类失败')
        }
        console.log(res.data)
      //数据列表赋值给cateList
        this.cateList = res.data.result
      //为总数据条数赋值
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    showCateDialog() {
      this.getParentCateList()
      this.addCatDialogVisible = true
    },
    //获取前两级的菜单
    async getParentCateList() {
      const { data:res } = await this.$http.get(
          'categories',
          {params: {type: 2}}
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      console.log(res.data)
      this.parentCateList = res.data
    },
    parentCateChanged() {
      console.log(this.selectedKeys)
      //非一级菜单
      if (this.selectedKeys.length > 0) {
        //取最后一级的值作为父级分类
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length -1]
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    addCate() {
      console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid => {
            if (!valid) return
        const {data:res} = await this.$http.post(
                'categories',
                this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCatDialogVisible = false
      })
    },
    addCatDialogClose() {
      //清空名称
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>