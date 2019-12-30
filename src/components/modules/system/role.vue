<template>
    <div v-bind:style="{ height:height+'px' }">
        <el-form :inline="true" :model="roleSearchForm" class="demo-form-inline">

            <el-form-item label="角色代码">
                <el-input v-model="roleSearchForm.roleCode" placeholder="角色代码"></el-input>
            </el-form-item>
            <el-form-item label="角色名称">
                <el-input v-model="roleSearchForm.roleName" placeholder="角色代码"></el-input>
            </el-form-item>

            <el-form-item label="所属组织">
                <el-cascader :options="roleSearchForm.orgOptions" v-model="roleSearchForm.orgId"
                             :props="{ checkStrictly: true, value:'id', label:'orgName' }" clearable></el-cascader>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="getRoleList(1)">查询</el-button>
            </el-form-item>
        </el-form>

        <div style="text-align:left">
            <el-button size="mini" type="primary" @click="addRole">添加</el-button>
            <el-button size="mini" type="primary" @click="editRole">修改</el-button>
            <el-button size="mini" type="warning" @click="deleteRole">删除</el-button>
        </div>

        <div style="height:5px"></div>

        <div style="float:left" v-bind:style="{ width:roleTableWidth+'px' }">
            <el-table ref="roleTable" :data="roleTableData"
                      :height="roleTableHeight" border stripe highlight-current-row @row-click="clickRow">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="roleCode"
                        label="角色代码" width="100">
                </el-table-column>
                <el-table-column
                        prop="roleName"
                        label="角色名称" width="100">
                </el-table-column>
                <el-table-column
                        prop="orgName"
                        label="所属组织">
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="changePage"
                    :total="roleTableDataTotal">
            </el-pagination>
        </div>

        <div style="margin-left:10px; width:300px; float:left; border:1px solid #dddddd" v-bind:style="{ height:menuTreeHeight+'px' }">
            <el-tree :data="menuTreeDataByRole" node-key="id"
                     :props="menuTreePropsByRole"
                     :default-expanded-keys="menuTreeDefaultExpandKeys"></el-tree>
        </div>

        <el-dialog
                :title="roleDialogTitle"
                :visible.sync="roleDialogVisible"
                width="30%">
            <el-form :model="roleDialogFormData" :rules="roleDialogRules" ref="roleDialogForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色代码" prop="ruleCode">
                    <el-input v-model="roleDialogFormData.roleCode"></el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="orgName">
                    <el-input v-model="roleDialogFormData.roleName"></el-input>
                </el-form-item>
                <el-form-item label="所属组织">
                    <el-cascader :options="roleSearchForm.orgOptions" v-model="roleDialogFormData.orgId"
                                 :props="{ checkStrictly: true, value:'id', label:'orgName' }" clearable></el-cascader>
                </el-form-item>
                <el-form-item label="关联菜单">
                    <el-cascader :options="roleDialogFormData.menuOptions" v-model="roleDialogFormData.menuIds" :key="roleDialogFormData.menuSelectKey"
                                 :props="{value:'id', label:'menuName', multiple:true }" collapse-tags clearable></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleData()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "role",
        data:function() {
            const userData = JSON.parse(sessionStorage.userData);
            return {
                height:200,
                roleTableHeight:200,
                roleTableWidth:600,
                menuTreeHeight:200,
                roleSearchForm:{
                    roleCode:"",
                    roleName:"",
                    orgId:[],
                    orgOptions:userData.orgList
                },
                roleTableData:[],
                roleTableDataTotal:0,
                roleDialogTitle:"新增角色",
                roleDialogVisible:false,
                roleDialogFormData:{
                    id:null,
                    roleCode:'',
                    roleName:'',
                    orgId:[],
                    menuOptions:[],
                    menuIds:[],
                    menuSelectKey:0
                },
                roleDialogRules:{
                    roleCode: [
                        { required: true, message: '请输入角色代码', trigger: 'blur' }
                    ],
                    roleName: [
                        { required: true, message: '请输入角色名称', trigger: 'blur' }
                    ]
                },
                menuTreeDataByRole:[],
                menuTreeDefaultExpandKeys:[],
                menuTreePropsByRole:{
                    label:"menuName"
                }
            }
        },
        created: function () {
            this.height = window.innerHeight-145;
            this.roleTableHeight = this.height-80-50;
            this.roleTableWidth = window.innerWidth-300-300-20;
            this.menuTreeHeight = this.height-80-50-2;
            this.getMenuTreeData();
            console.log(this.roleTableHeight);
        },
        mounted: function() {
            this.getRoleList(1);
        },
        methods: {
            getRoleList(pageIndex) {
                this.roleTableData = [];

                this.axios
                    .post("/service-user/role/getListData",{
                        roleCode:this.roleSearchForm.roleCode,
                        roleName:this.roleSearchForm.roleName,
                        orgId:JSON.stringify(this.roleSearchForm.orgId),
                        pageIndex:pageIndex
                    })
                    .then(resp => {
                        if (resp.data && resp.data.data && resp.data.success) {
                            if (resp.data.data.dataList.length > 0) {
                                for (let i=0; i<resp.data.data.dataList.length; i++) {
                                    this.roleTableData.push(resp.data.data.dataList[i]);
                                }
                            }
                            this.roleTableDataTotal = resp.data.data.count;
                        }
                    });
            },
            getMenuTreeData() {
                this.roleDialogFormData.menuOptions = [];

                this.axios
                    .post("/service-user/menu/findTreeById?id=0",{})
                    .then(resp => {
                        if (resp.data && resp.data.data && resp.data.success) {
                            if (resp.data.data.length > 0) {
                                for (let i=0; i<resp.data.data.length; i++) {
                                    this.roleDialogFormData.menuOptions.push(resp.data.data[i]);
                                }
                            }
                        }
                    });
            },
            changePage(pageIndex) {
                this.getRoleList(pageIndex);
            },
            addRole() {
                this.roleDialogFormData.menuSelectKey++;
                this.roleDialogTitle = "新增角色";
                this.roleDialogFormData.id = null;
                this.roleDialogFormData.roleCode = "";
                this.roleDialogFormData.roleName = "";
                this.roleDialogFormData.orgId = [];
                this.roleDialogFormData.menuIds = [];
                this.roleDialogVisible = true;
            },
            editRole() {
                this.roleDialogTitle = "修改角色";
                if (this.$refs.roleTable.selection && this.$refs.roleTable.selection.length == 0) {
                    this.$message({
                        message: "请选择要修改的数据",
                        type: 'info'
                    });
                    return;
                }

                if (this.$refs.roleTable.selection && this.$refs.roleTable.selection.length > 1) {
                    this.$message({
                        message: "只能选择一条数据",
                        type: 'info'
                    });
                    return;
                }

                this.roleDialogFormData.menuSelectKey++;
                this.roleDialogFormData.id = this.$refs.roleTable.selection[0]["id"];
                this.roleDialogFormData.roleCode = this.$refs.roleTable.selection[0]["roleCode"];
                this.roleDialogFormData.roleName = this.$refs.roleTable.selection[0]["roleName"];
                this.roleDialogFormData.orgId = JSON.parse(this.$refs.roleTable.selection[0]["orgIdFull"]);
                this.roleDialogFormData.menuIds = JSON.parse(this.$refs.roleTable.selection[0]["menuIdFulls"]);

                this.roleDialogVisible = true;
            },
            deleteRole() {
                if (this.$refs.roleTable.selection && this.$refs.roleTable.selection.length == 0) {
                    this.$message({
                        message: "请选择要删除的数据",
                        type: 'info'
                    });
                    return;
                }

                let ids = [];
                for (let i=0; i<this.$refs.roleTable.selection.length; i++) {
                    ids.push(this.$refs.roleTable.selection[i]["id"]);
                }

                this.$confirm('此操作将删除选定的角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios
                        .post("/service-user/role/delete",ids)
                        .then(resp => {
                            if (resp.data && resp.data.success) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getRoleList(1);
                            } else {
                                this.$message({
                                    showClose: true,
                                    message: resp.data.message,
                                    type: 'error'
                                });
                            }
                        });

                }).catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '已取消删除'
                    // });
                });
            },
            saveRoleData() {
                this.$refs["roleDialogForm"].validate((valid) => {
                    if (valid) {
                        console.log(this.roleDialogFormData.orgId);
                        this.axios
                            .post("/service-user/role/save",{id:this.roleDialogFormData.id, roleCode:this.roleDialogFormData.roleCode,
                                roleName:this.roleDialogFormData.roleName,
                                orgIdFull:JSON.stringify(this.roleDialogFormData.orgId),
                                menuIdFulls:JSON.stringify(this.roleDialogFormData.menuIds)
                            })
                            .then(resp => {
                                if (resp.data && resp.data.success) {
                                    this.getRoleList(1);
                                    this.$message({
                                        message: "保存成功",
                                        type: 'info'
                                    });
                                } else {
                                    this.$message({
                                        showClose: true,
                                        message: resp.data.message,
                                        type: 'error'
                                    });
                                }
                            });
                        this.roleDialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            clickRow(row) {
                this.$refs.roleTable.toggleRowSelection(row);
                this.getMenuTreeByRole(row["id"]);
            },
            getMenuTreeByRole(roleId) {
                this.menuTreeDataByRole = [];
                this.menuTreeDefaultExpandKeys = [];
                this.axios
                    .post("/service-user/role/getMenuTreeByRole?roleId=" + roleId,{})
                    .then(resp => {
                        if (resp.data && resp.data.data && resp.data.success) {
                            this.menuTreeDataByRole = [];
                            this.menuTreeDefaultExpandKeys = [];
                            if (resp.data.data.length > 0) {
                                for (let i=0; i<resp.data.data.length; i++) {
                                    this.menuTreeDataByRole.push(resp.data.data[i]);
                                    this.menuTreeDefaultExpandKeys.push(resp.data.data[i]["id"]);
                                }
                            }
                        }
                    });
            }
        }
    }
</script>

<style scoped>

</style>
