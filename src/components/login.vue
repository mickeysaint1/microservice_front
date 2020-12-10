<template>
    <div style="width:100%; height:100%; overflow:hidden">
        <div class="login-box">
            <div class="sys-logo"></div><div class="sys-title">小星星管理平台</div>
            <div class="login-item"><el-input v-model="username" placeholder="请输入用户名"></el-input></div>
            <div class="login-item"><el-input placeholder="请输入密码" v-model="password" show-password></el-input></div>
            <div class="login-item"><el-button type="primary" style="width:300px" @click="login">登&nbsp;录</el-button></div>
            <div class="login-item error-message" v-text="errorMsg"></div>
        </div>
        <div class="loginBg"></div>
    </div>
</template>

<script>

    import * as userApi from "@/js/api/user.js";
    import * as cookieApi from "@/js/utils/cookie.js";

    const loginBgSrc = require('../assets/login_bg.jpg')
    export default {
        name: "login",
        data: function() {
            return {
                username:"",
                password:"",
                errorMsg:"",
                loginBgSrc:loginBgSrc
            }
        },
        mounted: function() {
            this.drawBg();
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

                userApi.getUserInfoByUserNamePassword({username:this.username, password:this.password})
                        .then(resp => {
                            console.log(resp);

                            if (resp.success) {
                                localStorage.setItem("accessToken", resp.data.accessToken);
                                localStorage.setItem("userData", JSON.stringify(resp.data));
                                sessionStorage.setItem("accessToken", resp.data.accessToken);
                                sessionStorage.setItem("userData", JSON.stringify(resp.data));
                                this.axios.headers.accessToken = resp.data.accessToken;
                                cookieApi.delCookie("accessToken");
                                setTimeout(function(){
                                    cookieApi.setCookie("accessToken", resp.data.accessToken);
                                }, 500);
                                this.$router.push("/home");
                            } else {
                                this.errorMsg = resp.message;
                            }
                        });
            },
            drawBg() {

            }
        }
    }
</script>

<style scoped>
.login-box {
    width:300px;
    margin:0 auto;
    position:relative;
    top:40%;
    transform: translateY(-50%);
    z-index:200;
}

.login-box .sys-logo{
    height:48px;
    width:48px;
    float:left;
    background-image: url(../assets/logo.png);

}

.login-box .sys-title{
    font-size:32px;
    color:#ffffff;
    height:48px;
    line-height:48px;
    vertical-align:middle;
}

.login-box .login-item {
    height:48px;
}
.login-box .error-message {
    color:red;
}
.loginBg {
    padding:0;
    margin:0;
    width:100%;
    height:100%;
    position:absolute;
    left:0px;
    top:0px;
    z-index:0;
    background-image: url(../assets/login_bg.jpg);
    background-size: cover;
}
</style>
