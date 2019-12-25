<template>
    <div style="width:100%; height:100%">
        <div class="login-box">
            <div class="login-item"><el-input v-model="username" placeholder="请输入用户名"></el-input></div>
            <div class="login-item"><el-input placeholder="请输入密码" v-model="password" show-password></el-input></div>
            <div class="login-item"><el-button type="primary" style="width:200px" @click="login">登&nbsp;陆</el-button></div>
            <div class="login-item error-message" v-text="errorMsg"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                username:"",
                password:"",
                errorMsg:""
            }
        },
        methods:{
            login() {
                this.errorMsg = "";
                if (this.username == null || this.username == "") {
                    this.errorMsg = "请输入用户名。";
                    return;
                }

                if (this.password == null || this.password == "") {
                    this.errorMsg = "请输入密码。";
                    return;
                }

                this.axios
                    .post("/service-oauth2/oauth2/login",{username:this.username, password:this.password})
                    .then(resp => {
                        if (resp.data && resp.data.data && resp.data.success) {
                            this.axios.defaults.headers.common["accessToken"] = resp.data.data.accessToken;
                            sessionStorage.accessToken = resp.data.data.accessToken;
                            sessionStorage.userData = JSON.stringify(resp.data.data);
                            this.$router.push("/home");
                        } else {
                            this.errorMsg = resp.data.message;
                        }
                    });
            }
        }
    }
</script>

<style scoped>
.login-box {
    width:200px;
    margin:0 auto;
    position:relative;
    top:40%;
    transform: translateY(-50%);
}

.login-box .login-item {
    height:50px;
}
.login-box .error-message {
    color:red;
}
</style>
