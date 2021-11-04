<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary">添加角色</el-button>
      </el-col>
    </el-row>
    <el-table :data="roleList" border stripe>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row :class="['bdbottom',i1 === 0 ? 'bdtop' :'' , 'vcenter' ]"
                  v-for="(item1,i1) in scope.row.children"
                  :key="item1.id" >
<!--            渲染一级权限-->
            <el-col :span="5">
              <el-tag closable
                      @close="removeRightById(scope.row, item1.id)">
                {{ item1.authName }}
              </el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
<!--            渲染二三级权限-->
            <el-col :span="19">
              <!-- 通过 for 循环 嵌套渲染二级权限 -->
              <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                      v-for="(item2, i2) in item1.children"
                      :key="item2.id">
                <el-col :span="6">
                  <el-tag type="success"
                          closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini"  type="danger" icon="el-icon-delete">删除</el-button>
          <el-button
              size="mini"
              type="warning"
              @click="showSetRightDialog(scope.row)"
              icon="el-icon-setting">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
<!--    分配权限对话框-->
    <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="30%"
        @close="setRightDialogClosed"
    >
      <el-tree :data="rightList"
               :props="treeProps"
               show-checkbox node-key="id"
               default-expand-all
               :default-checked-keys = "defKeys"
               ref="treeRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary"
               @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>
  </el-card>
</div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      //所有角色列表数据
      roleList: [],
      setRightDialogVisible :false,
      rightList:[],
      //树形控件的属性绑定对象
      treeProps: {
            label: 'authName',
            children: 'children'
        },
      defKeys:[],
      //准备分配权限的id
      roleId:''
    }
  },
  created() {
    this.getRoesList()
  },
  methods: {
    async getRoesList() {
      const {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
      console.log(this.roleList)
    },
    //删除对应的权限
    async removeRightById(role,rightId) {
      //弹框
      const confirmResult = await this.$confirm(
          '此操作将永久删除该文件, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err)

      if (confirmResult !== "confirm") {
        return this.$message.info('取消了删除')
      }
      const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      //this.getRoesList()
      role.children=res.data;
    },
    //分配权限对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      //获取所有权限的树形数据
      const {data:res} =
          await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限失败')
      }
      this.rightList = res.data
      console.log(this.rightList)
      this.getLeafKeys(role,this.defKeys)
      this.setRightDialogVisible = true
      },
    //每次点击都要重置权限对话框
      setRightDialogClosed (){
        this.defKeys = []
      },
    //通过递归的形式获得角色下所有三级角色的id，保存到defKeys数组中
    getLeafKeys(node,arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item =>
        this.getLeafKeys(item,arr)
      )
    },
    async allotRights() {
      const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data:res } = await
          this.$http.post(
          `roles/${this.roleId}/rights`,
          {rids:idStr})

      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRoesList();
      this.setRightDialogVisible = false;
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eeeeee;
}
.bdbotton{
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>