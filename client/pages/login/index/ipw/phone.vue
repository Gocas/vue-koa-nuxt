<template>
    <div class="phone">
        <el-form-item
            class="form-input"
            prop="userName"
            :rules="[{ required: true, message: '手机号码不能为空' }]"
        >
            <el-input
                type="text"
                class="login-input"
                prefix-icon="icon iconfont icon-shoujihao input-icon"
                v-model="user.phone"
                placeholder="请输入您的手机号码"
                autofocus
            ></el-input>
        </el-form-item>
        <el-form-item
            class="form-input"
            prop="password"
            :rules="[{ required: true, message: '验证码不能为空' }]"
        >
            <el-input
                type="text"
                class="login-input"
                prefix-icon="icon iconfont icon-tupianyanzhengma input-icon"
                v-model="user.code"
                placeholder="请输入验证码"
            ></el-input>
        </el-form-item>

        <el-button type="primary" class="login-btn" @click="submitFn()"
            >登录</el-button
        >
        <p class="login-f-r-p">
            未收到验证码，
            <a href="#">联系管理员</a>
        </p>
    </div>
</template>
<script>
import Component from 'class-component'
@Component
export default class Pwd {
  asyncData () {
    return {
      user: {
        phone: '',
        code: '',
        captcha: ''
      }
    }
  }
  async submitFn () {
    if (this.user.phone !== '' && this.user.code !== '') {
      this.$message({
        message: this.user.phone + '登录成功',
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
.phone {
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
        text-align: center;
        margin: 18.8px auto 0;
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

