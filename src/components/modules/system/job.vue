<template>
    <div v-bind:style="{ height:height+'px' }">
        <el-form :inline="true" :model="jobSearchForm" class="demo-form-inline">

            <el-form-item label="定时任务类型">
                <el-input v-model="jobSearchForm.jobGroup" placeholder="定时任务类型"></el-input>
            </el-form-item>
            <el-form-item label="定时任务名称">
                <el-input v-model="jobSearchForm.jobName" placeholder="定时任务名称"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="getJobList()">查询</el-button>
            </el-form-item>
        </el-form>

        <div style="text-align:left">
            <el-button size="mini" type="primary" @click="addJob">添加</el-button>
            <el-button size="mini" type="primary" @click="editJob">修改</el-button>

            <el-button size="mini" type="primary" @click="disableJob">禁用</el-button>
            <el-button size="mini" type="primary" @click="enableJob">启用</el-button>
            <el-button size="mini" type="primary" @click="runJob">立即执行</el-button>
        </div>

        <div style="height:5px"></div>

        <div>
            <el-table ref="jobTable" :data="jobTableData"
                      :height="jobTableHeight" border stripe highlight-current-row @row-click="clickRow">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="jobGroup"
                        label="定时任务类型">
                </el-table-column>
                <el-table-column
                        prop="jobName"
                        label="定时任务名称">
                </el-table-column>
                <el-table-column
                        prop="cron"
                        label="cron表达式">
                </el-table-column>
                <el-table-column
                        prop="runtimeLast"
                        label="上次运行时间">
                </el-table-column>
                <el-table-column
                        prop="runtimeNext"
                        label="下次运行时间">
                </el-table-column>
                <el-table-column
                        prop="jobStatus"
                        label="任务状态">
                </el-table-column>
                <el-table-column
                        prop="enabled"
                        label="是否启用">
                </el-table-column>
                <el-table-column
                        prop="runTimes"
                        label="运行次数">
                </el-table-column>
                <el-table-column
                        prop="runDuration"
                        label="总运行时间">
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="changePage"
                    :total="jobTableDataTotal">
            </el-pagination>
        </div>

        <el-dialog
                :title="jobDialogTitle"
                :visible.sync="jobDialogVisible"
                width="30%">
            <el-form :model="jobDialogFormData" :rules="jobDialogRules" ref="jobDialogForm" label-width="150px" class="demo-ruleForm">
                <el-form-item label="定时任务类型" prop="jobGroup">
                    <el-input v-model="jobDialogFormData.jobGroup" :disabled="jobDialogFormData.jobGroup_disabled"></el-input>
                </el-form-item>
                <el-form-item label="定时任务名称" prop="jobName">
                    <el-input v-model="jobDialogFormData.jobName" :disabled="jobDialogFormData.jobName_disabled"></el-input>
                </el-form-item>
                <el-form-item label="类名" prop="jobClassName">
                    <el-input v-model="jobDialogFormData.jobClassName"></el-input>
                </el-form-item>
                <el-form-item label="方法名" prop="jobMethod">
                    <el-input v-model="jobDialogFormData.jobMethod"></el-input>
                </el-form-item>
                <el-form-item label="cron表达式" prop="cron">
                    <el-input v-model="jobDialogFormData.cron"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="jobDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveJobData()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "job",
        data:function() {
            return {
                height:200,
                jobTableHeight:200,
                jobSearchForm:{
                    jobGroup:"",
                    jobName:""
                },
                jobTableData:[],
                jobTableDataTotal:0,
                jobDialogFormData:{
                    jobGroup:"",
                    jobGroup_disabled:false,
                    jobName:"",
                    jobName_disabled:false,
                    jobClassName:"",
                    jobMethod:"",
                    cron:""
                },
                jobDialogVisible:false,
                jobDialogTitle:"新增定时任务",
                jobDialogRules:{
                    jobGroup: [
                        { required: true, message: '请输入定时任务类型', trigger: 'blur' }
                    ],
                    jobName: [
                        { required: true, message: '请输入定时任务名称', trigger: 'blur' }
                    ]
                }
            }
        },
        created: function () {
            this.height = window.innerHeight-145;
            this.jobTableHeight = this.height-80-50;
        },
        mounted: function() {
            this.getJobList(1);
        },
        methods: {
            getJobList(pageIndex) {
                this.jobTableData = [];

                this.axios
                    .post("/service-quartz/job/getListData", {
                        jobGroup: this.jobSearchForm.jobGroup,
                        jobName: this.jobSearchForm.jobName,
                        pageIndex: pageIndex
                    })
                    .then(resp => {
                        if (resp.data && resp.data.data && resp.data.success) {
                            if (resp.data.data.dataList.length > 0) {
                                for (let i = 0; i < resp.data.data.dataList.length; i++) {
                                    this.jobTableData.push(resp.data.data.dataList[i]);
                                }
                            }
                            this.jobTableDataTotal = resp.data.data.count;
                        }
                    });
            },
            clickRow(row) {
                this.$refs.jobTable.toggleRowSelection(row);
            },
            addJob() {
                this.jobDialogTitle = "新增定时任务";
                this.jobDialogFormData.id = null;
                this.jobDialogFormData.jobGroup = "";
                this.jobDialogFormData.jobGroup_disabled = false;
                this.jobDialogFormData.jobName = "";
                this.jobDialogFormData.jobName_disabled = false;
                this.jobDialogFormData.jobClassName = "";
                this.jobDialogFormData.jobMethod = "";
                this.jobDialogFormData.cron = "";
                this.jobDialogVisible = true;
            },
            editJob() {
                this.jobDialogTitle = "修改定时任务";
                if (this.$refs.jobTable.selection && this.$refs.jobTable.selection.length == 0) {
                    this.$message({
                        message: "请选择要修改的数据",
                        type: 'info'
                    });
                    return;
                }

                if (this.$refs.jobTable.selection && this.$refs.jobTable.selection.length > 1) {
                    this.$message({
                        message: "只能选择一条数据",
                        type: 'info'
                    });
                    return;
                }

                let row = this.$refs.jobTable.selection[0];
                this.jobDialogFormData.id = row["id"];
                this.jobDialogFormData.jobGroup = row["jobGroup"];
                this.jobDialogFormData.jobGroup_disabled = true;
                this.jobDialogFormData.jobName = row["jobName"];
                this.jobDialogFormData.jobName_disabled = true;
                this.jobDialogFormData.jobClassName = row["jobClassName"];
                this.jobDialogFormData.jobMethod = row["jobMethod"];
                this.jobDialogFormData.cron = row["cron"];

                this.jobDialogVisible = true;
            },
            saveJobData() {
                this.$refs["jobDialogForm"].validate((valid) => {
                    if (valid) {
                        this.axios
                            .post("/service-quartz/job/save",{
                                id:this.jobDialogFormData.id,
                                jobGroup:this.jobDialogFormData.jobGroup,
                                jobName:this.jobDialogFormData.jobName,
                                jobClassName:this.jobDialogFormData.jobClassName,
                                jobMethod:this.jobDialogFormData.jobMethod,
                                cron:this.jobDialogFormData.cron
                            })
                            .then(resp => {
                                if (resp.data && resp.data.success) {
                                    this.getJobList(1);
                                    this.$message({
                                        message: "保存成功",
                                        type: 'info'
                                    });
                                    this.jobDialogVisible = false;
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
                this.getJobList(pageIndex);
            },
            disableJob() {
                if (this.$refs.jobTable.selection && this.$refs.jobTable.selection.length == 0) {
                    this.$message({
                        message: "请选择一条数据",
                        type: 'info'
                    });
                    return;
                }

                if (this.$refs.jobTable.selection && this.$refs.jobTable.selection.length > 1) {
                    this.$message({
                        message: "只能选择一条数据",
                        type: 'info'
                    });
                    return;
                }

                const id = this.$refs.jobTable.selection[0]["id"];
                this.axios
                    .post("/service-quartz/job/disabled?id=" + id, {
                    })
                    .then(resp => {
                        if (resp.data && resp.data.success) {
                            this.getJobList(1);
                            this.$message({
                                message: "操作成功",
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
            },
            enableJob() {
                if (this.$refs.jobTable.selection && this.$refs.jobTable.selection.length == 0) {
                    this.$message({
                        message: "请选择一条数据",
                        type: 'info'
                    });
                    return;
                }

                if (this.$refs.jobTable.selection && this.$refs.jobTable.selection.length > 1) {
                    this.$message({
                        message: "只能选择一条数据",
                        type: 'info'
                    });
                    return;
                }

                const id = this.$refs.jobTable.selection[0]["id"];
                this.axios
                    .post("/service-quartz/job/enabled?id=" + id, {
                    })
                    .then(resp => {
                        if (resp.data && resp.data.success) {
                            this.getJobList(1);
                            this.$message({
                                message: "操作成功",
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
            },
            runJob() {
                if (this.$refs.jobTable.selection && this.$refs.jobTable.selection.length == 0) {
                    this.$message({
                        message: "请选择一条数据",
                        type: 'info'
                    });
                    return;
                }

                if (this.$refs.jobTable.selection && this.$refs.jobTable.selection.length > 1) {
                    this.$message({
                        message: "只能选择一条数据",
                        type: 'info'
                    });
                    return;
                }

                const id = this.$refs.jobTable.selection[0]["id"];
                this.axios
                    .post("/service-quartz/job/run?id=" + id, {
                    })
                    .then(resp => {
                        if (resp.data && resp.data.success) {
                            this.getJobList(1);
                            this.$message({
                                message: "操作成功",
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
            }
        }
    }
</script>

<style scoped>

</style>
