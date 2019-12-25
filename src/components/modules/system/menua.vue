<template>
    <div v-bind:style="{ height:height+'px' }" id="topContainer">
        <div style="height:100%; width:300px; float:left; border-right:1px solid #dddddd">
            <el-tree :data="menuTreeData" node-key="id"
                     :props="menuTreeProps"
                     :default-expanded-keys="[0]"
                     @node-click="handleNodeClick"></el-tree>
        </div>

        <div style="height:100%; width:10px; float:left; " ></div>

        <div style="height:100%; float:left; " ref="menuTableContainer" v-bind:style="{ width:menuTableWidth+'px' }">
            <div style="text-align:left">
                <el-button size="mini" type="primary" @click="addMenu">添加</el-button>
                <el-button size="mini" type="primary" @click="editMenu">修改</el-button>
                <el-button size="mini" type="warning" @click="deleteMenu">删除</el-button>
            </div>
            <div style="height:5px"></div>
            <el-table ref="menuTable" :data="menuTableData"
                      :height="menuTableHeight"
                      v-bind:style="{ width:menuTableWidth+'px' }" border stripe highlight-current-row @row-click="clickRow">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="menuCode"
                        label="菜单编码"
                        width="180">
                </el-table-column>
                <el-table-column
                    prop="menuName"
                    label="菜单名称">
                </el-table-column>
                <el-table-column
                        prop="menuShowName"
                        label="菜单名称(显示)">
                </el-table-column>
                <el-table-column
                        prop="menuComponent"
                        label="菜单组件">
                </el-table-column>
            </el-table>

        </div>

        <el-dialog
                :title="menuDialogTitle"
                :visible.sync="menuDialogVisible"
                width="500">
            <el-form :model="menuDialogFormData" :rules="menuDialogRules" ref="menuDialogForm" label-width="150px" class="demo-ruleForm">
                <el-form-item label="菜单名称" prop="menuName">
                    <el-input v-model="menuDialogFormData.menuName"></el-input>
                </el-form-item>
                <el-form-item label="菜单名称(显示)" prop="menuShowName">
                    <el-input v-model="menuDialogFormData.menuShowName"></el-input>
                </el-form-item>
                <el-form-item label="菜单组件" prop="menuComponent">
                    <el-input v-model="menuDialogFormData.menuComponent"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="menuDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveMenuData()">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "menua",
        data:function() {
            return {
                height:200,
                menuTableWidth:500,
                menuTableHeight:200,
                parentMenuId:0,
                menuDialogVisible:false,
                menuDialogTitle:"新增菜单",
                menuTreeProps:{
                    label:"menuName"
                },
                menuTreeData:[],
                menuTableData:[],
                menuDialogFormData:{
                    id:null,
                    menuName:'',
                    menuShowName:'',
                    menuComponent:''
                },
                menuDialogRules:{
                    menuName: [
                        { required: true, message: '请输入菜单名称', trigger: 'blur' }
                    ],
                    menuShowName: [
                        { required: true, message: '请输入菜单名称(显示)', trigger: 'blur' }
                    ]
                }
            }
        },
        created: function () {
            this.height = window.innerHeight-145;
            this.menuTableWidth = window.innerWidth-200-300-110;
            this.menuTableHeight = this.height-40;
        },
        mounted: function() {
            this.getMenuListData(this.parentMenuId);
            this.getMenuTreeData();
        },
        methods:{
            handleNodeClick(data) {
                this.parentMenuId = data.id;
                this.getMenuListData(this.parentMenuId);
            },
            getMenuTreeData() {
                this.menuTreeData = [];

                this.axios
                    .post("/service-user/menu/findTreeById?id=0",{})
                    .then(resp => {
                        if (resp.data && resp.data.data && resp.data.success) {
                            if (resp.data.data.length > 0) {
                                for (let i=0; i<resp.data.data.length; i++) {
                                    this.menuTreeData.push(resp.data.data[i]);
                                }
                            }
                        }
                    });
            },
            getMenuListData(parentMenuId) {
                this.menuTableData = [];

                this.axios
                    .post("/service-user/menu/getListDataByParentId?parentId=" + parentMenuId,{})
                    .then(resp => {
                        if (resp.data && resp.data.data && resp.data.success) {
                            if (resp.data.data.length > 0) {
                                for (let i=0; i<resp.data.data.length; i++) {
                                    this.menuTableData.push(resp.data.data[i]);
                                }
                            }
                        }
                    });
            },
            addMenu() {
                if (this.$refs.menuDialogForm) {
                    this.$refs.menuDialogForm.resetFields();
                }
                this.menuDialogTitle = "新增菜单";
                this.menuDialogFormData.menuName = "";
                this.menuDialogFormData.menuShowName = "";
                this.menuDialogFormData.menuComponent = "";
                this.menuDialogFormData.id = null;
                this.menuDialogVisible = true;
            },
            editMenu() {
                if (this.$refs.menuDialogForm) {
                    this.$refs.menuDialogForm.resetFields();
                }
                this.menuDialogTitle = "修改菜单";
                if (this.$refs.menuTable.selection && this.$refs.menuTable.selection.length == 0) {
                    this.$message({
                        message: "请选择要修改的数据",
                        type: 'info'
                    });
                    return;
                }

                if (this.$refs.menuTable.selection && this.$refs.menuTable.selection.length > 1) {
                    this.$message({
                        message: "只能选择一条数据",
                        type: 'info'
                    });
                    return;
                }
                this.menuDialogFormData.menuName = this.$refs.menuTable.selection[0]["menuName"];
                this.menuDialogFormData.menuShowName = this.$refs.menuTable.selection[0]["menuShowName"];
                this.menuDialogFormData.menuComponent = this.$refs.menuTable.selection[0]["menuComponent"];
                this.menuDialogFormData.id = this.$refs.menuTable.selection[0]["id"];
                this.menuDialogVisible = true;
            },
            deleteMenu() {
                if (this.$refs.menuTable.selection && this.$refs.menuTable.selection.length == 0) {
                    this.$message({
                        message: "请选择要删除的数据",
                        type: 'info'
                    });
                    return;
                }

                let ids = [];
                for (let i=0; i<this.$refs.menuTable.selection.length; i++) {
                    ids.push(this.$refs.menuTable.selection[i]["id"]);
                }

                this.$confirm('此操作将删除选定的菜单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios
                        .post("/service-user/menu/delete",ids)
                        .then(resp => {
                            if (resp.data && resp.data.success) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getMenuListData(this.parentMenuId);
                                this.getMenuTreeData();
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
            saveMenuData() {
                this.$refs["menuDialogForm"].validate((valid) => {
                    if (valid) {
                        this.axios
                            .post("/service-user/menu/save",{
                                id:this.menuDialogFormData.id,
                                parentId:this.parentMenuId,
                                menuName:this.menuDialogFormData.menuName,
                                menuShowName:this.menuDialogFormData.menuShowName,
                                menuComponent:this.menuDialogFormData.menuComponent
                            })
                            .then(resp => {
                                if (resp.data && resp.data.success) {
                                    this.getMenuListData(this.parentMenuId);
                                    this.getMenuTreeData();
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
                        this.menuDialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            clickRow(row) {
                this.$refs.menuTable.toggleRowSelection(row);
            }
        }
    }
</script>

<style scoped>

</style>
