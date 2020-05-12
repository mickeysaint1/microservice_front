<template>
    <div v-bind:style="{ height:height+'px' }">
        <el-form :inline="true" :model="dictTypeSearchForm" class="demo-form-inline">

            <el-form-item label="字典类型代码">
                <el-input v-model="dictTypeSearchForm.typeCode" placeholder="字典类型代码"></el-input>
            </el-form-item>
            <el-form-item label="字典类型名称">
                <el-input v-model="dictTypeSearchForm.typeName" placeholder="字典类型名称"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="getDictTypeList(1)">查询</el-button>
            </el-form-item>
        </el-form>

        <div style="text-align:left">
            <el-button size="mini" type="primary" @click="addDictType">添加</el-button>
            <el-button size="mini" type="primary" @click="editDictType">修改</el-button>
            <el-button size="mini" type="warning" @click="deleteDictType">删除</el-button>
        </div>

        <div style="height:5px"></div>

        <div>
            <el-table ref="dictTypeTable" :data="dictTypeTableData"
                      :height="dictTypeTableHeight" border stripe highlight-current-row @row-click="clickRow">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="typeCode"
                        label="字典类型代码" width="300">
                </el-table-column>
                <el-table-column
                        prop="typeName"
                        label="字典类型名称">
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="changePage"
                    :total="dictTypeTableDataTotal">
            </el-pagination>
        </div>

        <el-dialog
                :title="dictTypeDialogTitle"
                :visible.sync="dictTypeDialogVisible"
                width="30%">
            <el-form :model="dictTypeDialogFormData" :rules="dictTypeDialogRules" ref="dictTypeDialogForm" label-width="150px" class="demo-ruleForm">
                <el-form-item label="字典类型代码" prop="typeCode">
                    <el-input v-model="dictTypeDialogFormData.typeCode" :disabled="dictTypeDialogFormData.typeCode_disabled"></el-input>
                </el-form-item>
                <el-form-item label="字典类型名称" prop="typeName">
                    <el-input v-model="dictTypeDialogFormData.typeName"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dictTypeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveDictTypeData()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name:"dictType",
        data:function() {
            return {
                height:200,
                dictTypeTableHeight:200,
                dictTypeSearchForm:{
                    typeCode:"",
                    typeName:""
                },
                dictTypeTableData:[],
                dictTypeTableDataTotal:0,
                dictTypeDialogFormData:{
                    typeCode:"",
                    typeCode_disabled:false,
                    typeName:""
                },
                dictTypeDialogVisible:false,
                dictTypeDialogTitle:"新增字典类型",
                dictTypeDialogRules:{
                    typeCode: [
                        { required: true, message: '请输入字典类型代码', trigger: 'blur' }
                    ],
                    typeName: [
                        { required: true, message: '请输入字典类型名称', trigger: 'blur' }
                    ]
                }
            }
        },
        created: function () {
            this.height = window.innerHeight-145;
            this.dictTypeTableHeight = this.height-80-50;
        },
        mounted: function() {
            this.getDictTypeList(1);
        },
        methods: {
            getDictTypeList(pageIndex) {
                this.dictTypeTableData = [];

                this.axios
                    .post("/service-base/dictType/getListData", {
                        typeCode: this.dictTypeSearchForm.typeCode,
                        typeName: this.dictTypeSearchForm.typeName,
                        pageIndex: pageIndex
                    })
                    .then(resp => {
                        if (resp.data && resp.data.data && resp.data.success) {
                            if (resp.data.data.dataList.length > 0) {
                                for (let i = 0; i < resp.data.data.dataList.length; i++) {
                                    this.dictTypeTableData.push(resp.data.data.dataList[i]);
                                }
                            }
                            this.dictTypeTableDataTotal = resp.data.data.count;
                        }
                    });
            },
            clickRow(row) {
                this.$refs.dictTypeTable.toggleRowSelection(row);
            },
            addDictType() {
                this.dictTypeDialogTitle = "新增字典类型";
                this.dictTypeDialogFormData.id = null;
                this.dictTypeDialogFormData.typeCode = "";
                this.dictTypeDialogFormData.typeCode_disabled = false;
                this.dictTypeDialogFormData.typeName = "";
                this.dictTypeDialogVisible = true;
            },
            editDictType() {
                this.dictTypeDialogTitle = "修改字典类型";
                if (this.$refs.dictTypeTable.selection && this.$refs.dictTypeTable.selection.length == 0) {
                    this.$message({
                        message: "请选择要修改的数据",
                        type: 'info'
                    });
                    return;
                }

                if (this.$refs.dictTypeTable.selection && this.$refs.dictTypeTable.selection.length > 1) {
                    this.$message({
                        message: "只能选择一条数据",
                        type: 'info'
                    });
                    return;
                }

                this.dictTypeDialogFormData.id = this.$refs.dictTypeTable.selection[0]["id"];
                this.dictTypeDialogFormData.typeCode = this.$refs.dictTypeTable.selection[0]["typeCode"];
                this.dictTypeDialogFormData.typeCode_disabled = true;
                this.dictTypeDialogFormData.typeName = this.$refs.dictTypeTable.selection[0]["typeName"];

                this.dictTypeDialogVisible = true;
            },
            deleteDictType() {
                if (this.$refs.dictTypeTable.selection && this.$refs.dictTypeTable.selection.length == 0) {
                    this.$message({
                        message: "请选择要删除的数据",
                        type: 'info'
                    });
                    return;
                }

                let ids = [];
                for (let i=0; i<this.$refs.dictTypeTable.selection.length; i++) {
                    ids.push(this.$refs.dictTypeTable.selection[i]["id"]);
                }

                this.$confirm('此操作将删除选定的字典类型, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios
                        .post("/service-base/dictType/delete",ids)
                        .then(resp => {
                            if (resp.data && resp.data.success) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getDictTypeList(1);
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
            saveDictTypeData() {
                this.$refs["dictTypeDialogForm"].validate((valid) => {
                    if (valid) {
                        this.axios
                            .post("/service-base/dictType/save",{
                                id:this.dictTypeDialogFormData.id,
                                typeCode:this.dictTypeDialogFormData.typeCode,
                                typeName:this.dictTypeDialogFormData.typeName
                            })
                            .then(resp => {
                                if (resp.data && resp.data.success) {
                                    this.getDictTypeList(1);
                                    this.$message({
                                        message: "保存成功",
                                        type: 'info'
                                    });
                                    this.dictTypeDialogVisible = false;
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
                this.getDictTypeList(pageIndex);
            }
        }
    }
</script>

<style scoped>

</style>
