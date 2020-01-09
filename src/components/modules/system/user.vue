<template>
    <div v-bind:style="{ height:height+'px' }">
        <el-form :inline="true" :model="userSearchForm" class="demo-form-inline">

            <el-form-item label="用户账号">
                <el-input v-model="userSearchForm.username" placeholder="用户账号"></el-input>
            </el-form-item>
            <el-form-item label="用户姓名">
                <el-input v-model="userSearchForm.userFullName" placeholder="用户姓名"></el-input>
            </el-form-item>

            <el-form-item label="所属组织">
                <el-cascader :options="userSearchForm.orgOptions" v-model="userSearchForm.orgId"
                             :props="{ checkStrictly: true, value:'id', label:'orgName' }" clearable></el-cascader>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="getUserList(1)">查询</el-button>
            </el-form-item>
        </el-form>

        <div style="text-align:left">
            <el-button size="mini" type="primary" @click="addUser">添加</el-button>
            <el-button size="mini" type="primary" @click="editUser">修改</el-button>
            <el-button size="mini" type="warning" @click="deleteUser">删除</el-button>
        </div>

        <div style="height:5px"></div>

        <div>
            <el-table ref="userTable" :data="userTableData"
                      :height="userTableHeight" border stripe highlight-current-row @row-click="clickRow">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="用户账号" width="100">
                </el-table-column>
                <el-table-column
                        prop="userFullName"
                        label="用户姓名" width="100">
                </el-table-column>
                <el-table-column width="200"
                        prop="roleNames"
                        label="用户角色">
                </el-table-column>
                <el-table-column
                        prop="orgNames"
                        label="所属组织">
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="changePage"
                    :total="userTableDataTotal">
            </el-pagination>
        </div>

        <el-dialog
                :title="userDialogTitle"
                :visible.sync="userDialogVisible"
                width="30%">
            <el-form :model="userDialogFormData" :rules="userDialogRules" ref="userDialogForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户账号" prop="username">
                    <el-input v-model="userDialogFormData.username" :disabled="userDialogFormData.username_disabled"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="userDialogFormData.password" show-password  :disabled="userDialogFormData.password_disabled"></el-input>
                </el-form-item>
                <el-form-item label="用户姓名" prop="userFullName">
                    <el-input v-model="userDialogFormData.userFullName"></el-input>
                </el-form-item>
                <el-form-item label="所属组织">
                    <el-cascader :options="userSearchForm.orgOptions" v-model="userDialogFormData.orgIds"
                                 :props="{ checkStrictly: true, value:'id', label:'orgName' }" clearable
                                 @change="changeOrg"></el-cascader>
                </el-form-item>
                <el-form-item label="所属角色">
                    <el-select v-model="userDialogFormData.roleIds" multiple collapse-tags placeholder="请选择">
                        <el-option
                                v-for="item in userDialogFormData.roleOptions"
                                :key="item.id"
                                :label="item.roleName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="userDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveUserData()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "user",
        data:function() {
            const userData = JSON.parse(sessionStorage.userData);
            return {
                height:200,
                userTableHeight:200,
                userSearchForm:{
                    username:"",
                    userFullName:"",
                    orgId:[],
                    orgOptions:userData.orgList
                },
                userTableData:[],
                userTableDataTotal:0,
                userDialogFormData:{
                    username:"",
                    username_disabled:false,
                    password:"",
                    password_disabled:false,
                    userFullName:"",
                    orgIds:[],
                    roleIds:[],
                    roleOptions:[]
                },
                userDialogVisible:false,
                userDialogTitle:"新增用户",
                userDialogRules:{
                    username: [
                        { required: true, message: '请输入用户账号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    userFullName: [
                        { required: true, message: '请输入用户姓名', trigger: 'blur' }
                    ],
                    orgId: [
                        { required: true, message: '请输入所属组织', trigger: 'blur' }
                    ]
                }
            }
        },
        created: function () {
            this.height = window.innerHeight-145;
            this.userTableHeight = this.height-80-50;
        },
        mounted: function() {
            this.getUserList(1);
        },
        methods: {
            getUserList(pageIndex) {
                this.userTableData = [];

                this.axios
                    .post("/service-user/user/getListData", {
                        username: this.userSearchForm.username,
                        userFullName: this.userSearchForm.userFullName,
                        orgId: JSON.stringify(this.userSearchForm.orgId),
                        pageIndex: pageIndex
                    })
                    .then(resp => {
                        if (resp.data && resp.data.data && resp.data.success) {
                            if (resp.data.data.dataList.length > 0) {
                                for (let i = 0; i < resp.data.data.dataList.length; i++) {
                                    this.userTableData.push(resp.data.data.dataList[i]);
                                }
                            }
                            this.userTableDataTotal = resp.data.data.count;
                        }
                    });
            },
            clickRow(row) {
                this.$refs.userTable.toggleRowSelection(row);
            },
            addUser() {
                this.userDialogTitle = "新增用户";
                this.userDialogFormData.id = null;
                this.userDialogFormData.username = "";
                this.userDialogFormData.username_disabled = false;
                this.userDialogFormData.userFullName = "";
                this.userDialogFormData.password = "";
                this.userDialogFormData.password_disabled = false;
                this.userDialogFormData.orgIds = [];
                this.userDialogFormData.roleIds = [];
                this.userDialogVisible = true;
            },
            editUser() {
                this.userDialogTitle = "修改用户";
                if (this.$refs.userTable.selection && this.$refs.userTable.selection.length == 0) {
                    this.$message({
                        message: "请选择要修改的数据",
                        type: 'info'
                    });
                    return;
                }

                if (this.$refs.userTable.selection && this.$refs.userTable.selection.length > 1) {
                    this.$message({
                        message: "只能选择一条数据",
                        type: 'info'
                    });
                    return;
                }

                console.log(this.$refs.userTable.selection[0]);
                this.userDialogFormData.id = this.$refs.userTable.selection[0]["id"];
                this.userDialogFormData.username = this.$refs.userTable.selection[0]["username"];
                this.userDialogFormData.username_disabled = true;
                this.userDialogFormData.password_disabled = true;
                this.userDialogFormData.password = "123456";
                this.userDialogFormData.userFullName = this.$refs.userTable.selection[0]["userFullName"];
                this.userDialogFormData.orgIds = JSON.parse(this.$refs.userTable.selection[0]["orgIds"]);
                let me = this;
                this.changeOrg(null, function() {
                    me.userDialogFormData.roleIds = JSON.parse(me.$refs.userTable.selection[0]["roleIds"]);
                });

                this.userDialogVisible = true;
            },
            deleteUser() {
                if (this.$refs.userTable.selection && this.$refs.userTable.selection.length == 0) {
                    this.$message({
                        message: "请选择要删除的数据",
                        type: 'info'
                    });
                    return;
                }

                let ids = [];
                for (let i=0; i<this.$refs.userTable.selection.length; i++) {
                    ids.push(this.$refs.userTable.selection[i]["id"]);
                }

                this.$confirm('此操作将删除选定的用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios
                        .post("/service-user/user/delete",ids)
                        .then(resp => {
                            if (resp.data && resp.data.success) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getUserList(1);
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
            saveUserData() {
                this.$refs["userDialogForm"].validate((valid) => {
                    if (valid) {
                        this.axios
                            .post("/service-user/user/save",{
                                id:this.userDialogFormData.id,
                                username:this.userDialogFormData.username,
                                password:this.userDialogFormData.password,
                                userFullName:this.userDialogFormData.userFullName,
                                orgIds:JSON.stringify(this.userDialogFormData.orgIds),
                                roleIds:JSON.stringify(this.userDialogFormData.roleIds)
                            })
                            .then(resp => {
                                if (resp.data && resp.data.success) {
                                    this.getUserList(1);
                                    this.$message({
                                        message: "保存成功",
                                        type: 'info'
                                    });
                                    this.userDialogVisible = false;
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
                this.getUserList(pageIndex);
            },
            changeOrg(paramFirst, callback) {
                this.userDialogFormData.roleOptions = [];
                this.userDialogFormData.roleIds = [];
                this.axios
                    .post("/service-user/role/getListData",{
                        orgId:JSON.stringify(this.userDialogFormData.orgIds),
                        pageIndex:1,
                        pageSize:1000
                    })
                    .then(resp => {
                        if (resp.data && resp.data.success) {
                            this.userDialogFormData.roleOptions = [];
                            if (resp.data.data && resp.data.data.dataList && resp.data.data.dataList.length > 0) {
                                for (let i=0; i<resp.data.data.dataList.length; i++) {
                                    this.userDialogFormData.roleOptions.push(resp.data.data.dataList[i]);
                                }
                            }

                            if (callback) {
                                callback();
                            }
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
