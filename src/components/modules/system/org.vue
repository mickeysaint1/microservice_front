<template>

    <div v-bind:style="{ height:height+'px' }" id="topContainer">

        <div style="height:100%; width:300px; float:left; border-right:1px solid #dddddd">
            <el-tree :data="orgTreeData" node-key="id"
                     :props="orgTreeProps"
                     :default-expanded-keys="[0]"
                     @node-click="handleNodeClick"></el-tree>
        </div>

        <div style="height:100%; width:10px; float:left; " ></div>

        <div style="height:100%; float:left; " ref="orgTableContainer" v-bind:style="{ width:orgTableWidth+'px' }">
            <div style="text-align:left">
                <el-button size="mini" type="primary" @click="addOrg">添加</el-button>
                <el-button size="mini" type="primary" @click="editOrg">修改</el-button>
                <el-button size="mini" type="warning" @click="deleteOrg">删除</el-button>
            </div>
            <div style="height:5px"></div>
            <el-table ref="orgTable" :data="orgTableData"
                      :height="orgTableHeight"
                      v-bind:style="{ width:orgTableWidth+'px' }" border stripe highlight-current-row @row-click="clickRow">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="orgCode"
                        label="组织编码"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="orgName"
                        label="组织名称">
                </el-table-column>
            </el-table>

        </div>

        <el-dialog
                :title="orgDialogTitle"
                :visible.sync="orgDialogVisible"
                width="30%">
            <el-form :model="orgDialogFormData" :rules="orgDialogRules" ref="orgDialogForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="组织名称" prop="orgName">
                    <el-input v-model="orgDialogFormData.orgName"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="orgDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveOrgData()">确 定</el-button>
            </span>
        </el-dialog>

    </div>


</template>

<script>

    export default {
        name: "org",
        data:function() {
            return {
                height:200,
                orgTableWidth:500,
                orgTableHeight:200,
                parentOrgId:0,
                orgDialogVisible:false,
                orgDialogTitle:"新增组织",
                orgTreeProps:{
                    label:"orgName"
                },
                orgTreeData:[],
                orgTableData:[],
                orgDialogFormData:{
                    id:null,
                    orgName:''
                },
                orgDialogRules:{
                    orgName: [
                        { required: true, message: '请输入组织名称', trigger: 'blur' }
                    ]
                }
            }
        },
        created: function () {
            this.height = window.innerHeight-145;
            this.orgTableWidth = window.innerWidth-200-300-110;
            this.orgTableHeight = this.height-40;
        },
        mounted: function() {
            console.log(this.$refs.orgTableContainer.clientWidth);
            this.getOrgListData(this.parentOrgId);
            this.getOrgTreeData();
        },
        methods: {
            handleNodeClick(data) {
                this.parentOrgId = data.id;
                this.getOrgListData(this.parentOrgId);
            },
            getOrgTreeData() {
                this.orgTreeData = [];

                this.axios
                    .post("/service-user/org/findTreeById?id=0",{})
                    .then(resp => {
                        if (resp.data && resp.data.data && resp.data.success) {
                            if (resp.data.data.length > 0) {
                                for (let i=0; i<resp.data.data.length; i++) {
                                    this.orgTreeData.push(resp.data.data[i]);
                                }
                            }
                        }
                    });
            },
            getOrgListData(parentOrgId) {
                this.orgTableData = [];

                this.axios
                    .post("/service-user/org/getListDataByParentId?parentId=" + parentOrgId,{})
                    .then(resp => {
                        if (resp.data && resp.data.data && resp.data.success) {
                            if (resp.data.data.length > 0) {
                                for (let i=0; i<resp.data.data.length; i++) {
                                    this.orgTableData.push(resp.data.data[i]);
                                }
                            }
                        }
                    });
            },
            addOrg() {
                this.orgDialogTitle = "新增组织";
                this.orgDialogFormData.orgName = "";
                this.orgDialogFormData.id = null;
                this.orgDialogVisible = true;
            },
            editOrg() {
                this.orgDialogTitle = "修改组织";
                if (this.$refs.orgTable.selection && this.$refs.orgTable.selection.length == 0) {
                    this.$message({
                        message: "请选择要修改的数据",
                        type: 'info'
                    });
                    return;
                }

                if (this.$refs.orgTable.selection && this.$refs.orgTable.selection.length > 1) {
                    this.$message({
                        message: "只能选择一条数据",
                        type: 'info'
                    });
                    return;
                }
                this.orgDialogFormData.orgName = this.$refs.orgTable.selection[0]["orgName"];
                this.orgDialogFormData.id = this.$refs.orgTable.selection[0]["id"];
                this.orgDialogVisible = true;
            },
            deleteOrg() {
                if (this.$refs.orgTable.selection && this.$refs.orgTable.selection.length == 0) {
                    this.$message({
                        message: "请选择要删除的数据",
                        type: 'info'
                    });
                    return;
                }

                let ids = [];
                for (let i=0; i<this.$refs.orgTable.selection.length; i++) {
                    ids.push(this.$refs.orgTable.selection[i]["id"]);
                }

                this.$confirm('此操作将删除选定的组织结构, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios
                        .post("/service-user/org/delete",ids)
                        .then(resp => {
                            if (resp.data && resp.data.success) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getOrgListData(this.parentOrgId);
                                this.getOrgTreeData();
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
            saveOrgData() {
                this.$refs["orgDialogForm"].validate((valid) => {
                    if (valid) {
                        this.axios
                            .post("/service-user/org/save",{id:this.orgDialogFormData.id, parentId:this.parentOrgId, orgName:this.orgDialogFormData.orgName})
                            .then(resp => {
                                if (resp.data && resp.data.success) {
                                    this.getOrgListData(this.parentOrgId);
                                    this.getOrgTreeData();
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
                        this.orgDialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            clickRow(row) {
                this.$refs.orgTable.toggleRowSelection(row);
            }
        }
    }
</script>

<style scoped>

</style>
