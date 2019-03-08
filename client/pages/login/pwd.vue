<template>
    <div class="pwd">
        <el-form-item
            class="form-input"
            prop="userName"
            :rules="[{ required: true, message: '账号不能为空' }]"
        >
            <el-input
                type="text"
                class="login-input"
                prefix-icon="icon iconfont icon-wode input-icon"
                v-model="user.userName"
                placeholder="请输入您的账号"
                autofocus
            ></el-input>
        </el-form-item>
        <el-form-item
            class="form-input"
            prop="password"
            :rules="[{ required: true, message: '密码不能为空' }]"
        >
            <el-input
                type="password"
                class="login-input"
                prefix-icon="icon iconfont icon-mima input-icon"
                v-model="user.password"
                placeholder="请输入您的密码"
            ></el-input>
        </el-form-item>

        <p class="login-f-r-p">
            <el-checkbox
                label="记住密码"
                name="type"
                class="remember_password"
                size="mini"
            ></el-checkbox>
            <router-link class="forget_password" to="/repassword"
                >忘记密码</router-link
            >
        </p>
        <el-button type="primary" class="login-btn" @click="submitFn()"
            >登录</el-button
        >
    </div>
</template>
<script>
import Component from 'class-component'
@Component
export default class Pwd {
  asyncData () {
    return {
      user: {
        userName: '',
        password: '',
        captcha: ''
      }
    }
  }
  async submitFn () {
    if (this.user.userName !== '' && this.user.password !== '') {
      this.$message({
        message: this.user.userName + '登录成功',
        type: 'success'
      })
    } else {
      this.$message({
        message: '信息输入有误!',
        type: 'warning'
      })
    }
  }
}
</script>
<style lang="scss">
.pwd {
    .form-input {
        width: 90%;
        .login-input {
            height: 54px;
            .el-input__inner {
                text-indent: 54px;
                height: 54px;
            }
            .el-input__prefix {
                width: 54px;
                height: 36px;
                text-align: center;
                vertical-align: middle;
                border-right: 1px solid #cecece;
                margin: 9px 0;
                color: #333;
                .input-icon {
                    font-size: 24px;
                }
            }
        }
    }
    .login-btn {
        width: 90%;
        border-radius: 8px;
        font-size: 18px;
        padding: 16px 0;
    }
    .login-f-r-p {
        width: 90%;
        font-size: 12px;
        .remember_password {
            text-align: left;
            font-size: 12px !important;
            .el-checkbox__inner {
                color: #666;
                border-radius: 4px;
                width: 16px;
                height: 16px;
            }
            .el-checkbox__inner::after {
                top: 0px;
                width: 5px;
                height: 9px;
            }
        }
        .forget_password {
            float: right;
            color: #409eff;
            font-size: 12px;
            cursor: pointer;
        }
    }
}
</style>
