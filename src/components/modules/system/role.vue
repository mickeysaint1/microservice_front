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
                <el-button type="primary" @click="getRoleList">查询</el-button>
            </el-form-item>
        </el-form>

        <div style="text-align:left">
            <el-button size="mini" type="primary" @click="addRole">添加</el-button>
            <el-button size="mini" type="primary" @click="editRole">修改</el-button>
            <el-button size="mini" type="warning" @click="deleteRole">删除</el-button>
        </div>

        <div style="height:5px"></div>

        <el-table ref="roleTable" :data="roleTableData"
                  :height="roleTableHeight" border stripe highlight-current-row @row-click="clickRow">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="roleCode"
                    label="角色代码"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="roleName"
                    label="角色名称"
                    width="250">
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
</template>

<script>
    export default {
        name: "role",
        data:function() {
            const userData = JSON.parse(sessionStorage.userData);
            console.log(userData.orgList);
            return {
                height:200,
                roleTableHeight:200,
                roleSearchForm:{
                    roleCode:"",
                    roleName:"",
                    orgId:"",
                    orgOptions:userData.orgList
                },
                roleTableData:[],
                roleTableDataTotal:0
            }
        },
        created: function () {
            this.height = window.innerHeight-145;
            this.roleTableHeight = this.height-80;
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
                        orgId:this.roleSearchForm.orgId,
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
            changePage(pageIndex) {
                this.getRoleList(pageIndex);
            },
            addRole() {

            },
            editRole() {

            },
            deleteRole() {

            },
            clickRow(row) {
                this.$refs.roleTable.toggleRowSelection(row);
            }
        }
    }
</script>

<style scoped>

</style>
