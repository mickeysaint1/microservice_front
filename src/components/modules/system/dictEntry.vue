<template>
    <div v-bind:style="{ height:height+'px' }">
        <el-form :inline="true" :model="dictEntrySearchForm" class="demo-form-inline">

            <el-form-item label="字典类型">
                <el-input v-model="dictEntrySearchForm.typeCode" placeholder="字典类型代码"></el-input>
            </el-form-item>
            <el-form-item label="字典项代码">
                <el-input v-model="dictEntrySearchForm.entryCode" placeholder="字典项代码"></el-input>
            </el-form-item>
            <el-form-item label="字典项名称">
                <el-input v-model="dictEntrySearchForm.entryName" placeholder="字典项名称"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="getDictEntryList(1)">查询</el-button>
            </el-form-item>
        </el-form>

        <div style="text-align:left">
            <el-button size="mini" type="primary" @click="addDictEntry">添加</el-button>
            <el-button size="mini" type="primary" @click="editDictEntry">修改</el-button>
            <el-button size="mini" type="warning" @click="deleteDictEntry">删除</el-button>
        </div>

        <div style="height:5px"></div>

        <div>
            <el-table ref="dictEntryTable" :data="dictEntryTableData"
                      :height="dictEntryTableHeight" border stripe highlight-current-row @row-click="clickRow">
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
                <el-table-column
                        prop="entryCode"
                        label="字典项代码" width="300">
                </el-table-column>
                <el-table-column
                        prop="entryName"
                        label="字典项名称">
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="changePage"
                    :total="dictEntryTableDataTotal">
            </el-pagination>
        </div>

        <el-dialog
                :title="dictEntryDialogTitle"
                :visible.sync="dictEntryDialogVisible"
                width="30%">
            <el-form :model="dictEntryDialogFormData" :rules="dictEntryDialogRules" ref="dictEntryDialogForm" label-width="150px" class="demo-ruleForm">
                <el-form-item label="字典类型" prop="typeCode">
                    <el-input v-model="dictEntryDialogFormData.typeCode" :disabled="dictEntryDialogFormData.typeCode_disabled"></el-input>
                </el-form-item>
                <el-form-item label="字典项代码" prop="entryCode">
                    <el-input v-model="dictEntryDialogFormData.entryCode" :disabled="dictEntryDialogFormData.entryCode_disabled"></el-input>
                </el-form-item>
                <el-form-item label="字典项名称" prop="entryCode">
                    <el-input v-model="dictEntryDialogFormData.entryName"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dictEntryDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveDictEntryData()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name:"dictEntry",
        data:function() {
            return {
                height:200,
                dictEntryTableHeight:200,
                dictEntrySearchForm:{
                    typeCode:"",
                    entryCode:"",
                    entryName:""
                },
                dictEntryTableData:[],
                dictEntryTableDataTotal:0,
                dictEntryDialogFormData:{
                    typeCode:"",
                    typeCode_disabled:false,
                    entryCode:"",
                    entryCode_disabled:false,
                    entryName:""
                },
                dictEntryDialogVisible:false,
                dictEntryDialogTitle:"新增字典项",
                dictEntryDialogRules:{
                    typeCode: [
                        { required: true, message: '请输入字典类型', trigger: 'blur' }
                    ],
                    entryCode: [
                        { required: true, message: '请输入字典项代码', trigger: 'blur' }
                    ],
                    entryName: [
                        { required: true, message: '请输入字典项名称', trigger: 'blur' }
                    ]
                }
            }
        },
        created: function () {
            this.height = window.innerHeight-145;
            this.dictEntryTableHeight = this.height-80-50;
        },
        mounted: function() {
            this.getDictEntryList(1);
        },
        methods: {
            getDictEntryList(pageIndex) {
                this.dictEntryTableData = [];

                this.axios
                    .post("/service-base/dictEntry/getListData", {
                        typeCode: this.dictEntrySearchForm.typeCode,
                        entryCode: this.dictEntrySearchForm.entryCode,
                        entryName: this.dictEntrySearchForm.entryName,
                        pageIndex: pageIndex
                    })
                    .then(resp => {
                        if (resp.data && resp.data.data && resp.data.success) {
                            if (resp.data.data.dataList.length > 0) {
                                for (let i = 0; i < resp.data.data.dataList.length; i++) {
                                    this.dictEntryTableData.push(resp.data.data.dataList[i]);
                                }
                            }
                            this.dictEntryTableDataTotal = resp.data.data.count;
                        }
                    });
            },
            clickRow(row) {
                this.$refs.dictEntryTable.toggleRowSelection(row);
            },
            addDictEntry() {
                this.dictEntryDialogTitle = "新增字典项";
                this.dictEntryDialogFormData.id = null;
                this.dictEntryDialogFormData.typeCode = "";
                this.dictEntryDialogFormData.typeCode_disabled = false;
                this.dictEntryDialogFormData.entryCode = "";
                this.dictEntryDialogFormData.entryCode_disabled = false;
                this.dictEntryDialogFormData.entryName = "";
                this.dictEntryDialogVisible = true;
            },
            editDictEntry() {
                this.dictEntryDialogTitle = "修改字典项";
                if (this.$refs.dictEntryTable.selection && this.$refs.dictEntryTable.selection.length == 0) {
                    this.$message({
                        message: "请选择要修改的数据",
                        type: 'info'
                    });
                    return;
                }

                if (this.$refs.dictEntryTable.selection && this.$refs.dictEntryTable.selection.length > 1) {
                    this.$message({
                        message: "只能选择一条数据",
                        type: 'info'
                    });
                    return;
                }

                this.dictEntryDialogFormData.id = this.$refs.dictEntryTable.selection[0]["id"];
                this.dictEntryDialogFormData.typeCode = this.$refs.dictEntryTable.selection[0]["typeCode"];
                this.dictEntryDialogFormData.typeCode_disabled = true;
                this.dictEntryDialogFormData.entryCode = this.$refs.dictEntryTable.selection[0]["entryCode"];
                this.dictEntryDialogFormData.entryCode_disabled = true;
                this.dictEntryDialogFormData.entryName = this.$refs.dictEntryTable.selection[0]["entryName"];

                this.dictEntryDialogVisible = true;
            },
            deleteDictEntry() {
                if (this.$refs.dictEntryTable.selection && this.$refs.dictEntryTable.selection.length == 0) {
                    this.$message({
                        message: "请选择要删除的数据",
                        type: 'info'
                    });
                    return;
                }

                let ids = [];
                for (let i=0; i<this.$refs.dictEntryTable.selection.length; i++) {
                    ids.push(this.$refs.dictEntryTable.selection[i]["id"]);
                }

                this.$confirm('此操作将删除选定的字典项, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios
                        .post("/service-base/dictEntry/delete",ids)
                        .then(resp => {
                            if (resp.data && resp.data.success) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getDictEntryList(1);
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
            saveDictEntryData() {
                this.$refs["dictEntryDialogForm"].validate((valid) => {
                    if (valid) {
                        this.axios
                            .post("/service-base/dictEntry/save",{
                                id:this.dictEntryDialogFormData.id,
                                typeCode:this.dictEntryDialogFormData.typeCode,
                                entryCode:this.dictEntryDialogFormData.entryCode,
                                entryName:this.dictEntryDialogFormData.entryName
                            })
                            .then(resp => {
                                if (resp.data && resp.data.success) {
                                    this.getDictEntryList(1);
                                    this.$message({
                                        message: "保存成功",
                                        type: 'info'
                                    });
                                    this.dictEntryDialogVisible = false;
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
                this.getDictEntryList(pageIndex);
            }
        }
    }
</script>

<style scoped>

</style>
