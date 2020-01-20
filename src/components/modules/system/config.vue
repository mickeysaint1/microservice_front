<template>
    <div v-bind:style="{ height:height+'px' }">
        <el-form :inline="true" :model="sysconfigSearchForm" class="demo-form-inline">

            <el-form-item label="配置项代码">
                <el-input v-model="sysconfigSearchForm.configKey" placeholder="配置项代码"></el-input>
            </el-form-item>
            <el-form-item label="配置项名称">
                <el-input v-model="sysconfigSearchForm.configName" placeholder="配置项名称"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="getSysconfigList(1)">查询</el-button>
            </el-form-item>
        </el-form>

        <div style="text-align:left">
            <el-button size="mini" type="primary" @click="addSysconfig">添加</el-button>
            <el-button size="mini" type="primary" @click="editSysconfig">修改</el-button>
            <el-button size="mini" type="warning" @click="deleteSysconfig">删除</el-button>
        </div>

        <div style="height:5px"></div>

        <div>
            <el-table ref="sysconfigTable" :data="sysconfigTableData"
                      :height="sysconfigTableHeight" border stripe highlight-current-row @row-click="clickRow">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="configKey"
                        label="配置项代码" width="200">
                </el-table-column>
                <el-table-column
                        prop="configName"
                        label="配置项名称" width="200">
                </el-table-column>
                <el-table-column
                        prop="configValue"
                        label="配置项值" width="100">
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="备注">
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="changePage"
                    :total="sysconfigTableDataTotal">
            </el-pagination>
        </div>

        <el-dialog
                :title="sysconfigDialogTitle"
                :visible.sync="sysconfigDialogVisible"
                width="30%">
            <el-form :model="sysconfigDialogFormData" :rules="sysconfigDialogRules" ref="sysconfigDialogForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="配置项代码" prop="configKey">
                    <el-input v-model="sysconfigDialogFormData.configKey" :disabled="sysconfigDialogFormData.configKey_disabled"></el-input>
                </el-form-item>
                <el-form-item label="配置项名称" prop="configName">
                    <el-input v-model="sysconfigDialogFormData.configName" show-password></el-input>
                </el-form-item>
                <el-form-item label="配置项值" prop="configValue">
                    <el-input v-model="sysconfigDialogFormData.configValue"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="sysconfigDialogFormData.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="sysconfigDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveSysconfigData()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name:"sysconfig",
        data:function() {
            return {
                height:200,
                sysconfigTableHeight:200,
                sysconfigSearchForm:{
                    configKey:"",
                    configName:""
                },
                sysconfigTableData:[],
                sysconfigTableDataTotal:0,
                sysconfigDialogFormData:{
                    configKey:"",
                    configKey_disabled:false,
                    configName:"",
                    configValue:"",
                    remark:""
                },
                sysconfigDialogVisible:false,
                sysconfigDialogTitle:"新增配置",
                sysconfigDialogRules:{
                    configKey: [
                        { required: true, message: '请输入配置项代码', trigger: 'blur' }
                    ],
                    configName: [
                        { required: true, message: '请输入配置项名称', trigger: 'blur' }
                    ],
                    configValue: [
                        { required: true, message: '请输入配置项值', trigger: 'blur' }
                    ]
                }
            }
        },
        created: function () {
            this.height = window.innerHeight-145;
            this.sysconfigTableHeight = this.height-80-50;
        },
        mounted: function() {
            this.getSysconfigList(1);
        },
        methods: {
            getSysconfigList(pageIndex) {
                this.sysconfigTableData = [];

                this.axios
                    .post("/service-base/sysconfig/getListData", {
                        configKey: this.sysconfigSearchForm.configKey,
                        configName: this.sysconfigSearchForm.configName,
                        pageIndex: pageIndex
                    })
                    .then(resp => {
                        if (resp.data && resp.data.data && resp.data.success) {
                            if (resp.data.data.dataList.length > 0) {
                                for (let i = 0; i < resp.data.data.dataList.length; i++) {
                                    this.sysconfigTableData.push(resp.data.data.dataList[i]);
                                }
                            }
                            this.sysconfigTableDataTotal = resp.data.data.count;
                        }
                    });
            },
            clickRow(row) {
                this.$refs.sysconfigTable.toggleRowSelection(row);
            },
            addSysconfig() {
                this.sysconfigDialogTitle = "新增配置";
                this.sysconfigDialogFormData.id = null;
                this.sysconfigDialogFormData.configKey = "";
                this.sysconfigDialogFormData.configKey_disabled = false;
                this.sysconfigDialogFormData.configName = "";
                this.sysconfigDialogFormData.remark = "";
                this.sysconfigDialogVisible = true;
            },
            editSysconfig() {
                this.sysconfigDialogTitle = "修改配置";
                if (this.$refs.sysconfigTable.selection && this.$refs.sysconfigTable.selection.length == 0) {
                    this.$message({
                        message: "请选择要修改的数据",
                        type: 'info'
                    });
                    return;
                }

                if (this.$refs.sysconfigTable.selection && this.$refs.sysconfigTable.selection.length > 1) {
                    this.$message({
                        message: "只能选择一条数据",
                        type: 'info'
                    });
                    return;
                }

                this.sysconfigDialogFormData.id = this.$refs.sysconfigTable.selection[0]["id"];
                this.sysconfigDialogFormData.configKey = this.$refs.sysconfigTable.selection[0]["configKey"];
                this.sysconfigDialogFormData.configKey_disabled = true;
                this.sysconfigDialogFormData.configName = this.$refs.sysconfigTable.selection[0]["configName"];
                this.sysconfigDialogFormData.remark = JSON.parse(this.$refs.sysconfigTable.selection[0]["remark"]);

                this.sysconfigDialogVisible = true;
            },
            deleteSysconfig() {
                if (this.$refs.sysconfigTable.selection && this.$refs.sysconfigTable.selection.length == 0) {
                    this.$message({
                        message: "请选择要删除的数据",
                        type: 'info'
                    });
                    return;
                }

                let ids = [];
                for (let i=0; i<this.$refs.sysconfigTable.selection.length; i++) {
                    ids.push(this.$refs.sysconfigTable.selection[i]["id"]);
                }

                this.$confirm('此操作将删除选定的配置, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios
                        .post("/service-base/sysconfig/delete",ids)
                        .then(resp => {
                            if (resp.data && resp.data.success) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getSysconfigList(1);
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
            saveSysconfigData() {
                this.$refs["sysconfigDialogForm"].validate((valid) => {
                    if (valid) {
                        this.axios
                            .post("/service-base/sysconfig/save",{
                                id:this.sysconfigDialogFormData.id,
                                configKey:this.sysconfigDialogFormData.configKey,
                                configName:this.sysconfigDialogFormData.configName,
                                configValue:this.sysconfigDialogFormData.configValue,
                                remark:this.sysconfigDialogFormData.remark
                            })
                            .then(resp => {
                                if (resp.data && resp.data.success) {
                                    this.getSysconfigList(1);
                                    this.$message({
                                        message: "保存成功",
                                        type: 'info'
                                    });
                                    this.sysconfigDialogVisible = false;
                                } else {
                                    this.$message({
                                        showClose: true,
                                        message: resp.data.message,
                                        type: 'error'
                                    });
                                }
                            });
                    } else {
                        return false;
                    }
                });
            },
            changePage(pageIndex) {
                this.getSysconfigList(pageIndex);
            }
        }
    }
</script>

<style scoped>

</style>
