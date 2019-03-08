<template>
    <div class="login-container">
        <!-- 主体信息 -->
        <header class="header">
            <el-row>
                <el-col
                    :xs="23"
                    :sm="22"
                    :md="22"
                    :lg="22"
                    :xl="21"
                    :offset="2"
                >
                    <div class="grid-content header-title">
                        <img
                            src="~/assets/img/login/logo.png"
                            alt
                            class="logo"
                        />
                        <dl>
                            <dt>
                                <strong>北京联创高科信息技术有限公司</strong>
                            </dt>
                            <dd>
                                <span
                                    >Beijing Lantrack Info Technology
                                    Co.ltd</span
                                >
                            </dd>
                        </dl>
                    </div>
                </el-col>
            </el-row>
        </header>
        <!-- 中部主题及登陆 -->
        <main class="main">
            <el-row>
                <!-- 左侧图片 -->
                <el-col :xs="13" :sm="12" :md="12" :lg="11" :xl="11">
                    <img
                        src="~/assets/img/login/login_bg.png"
                        alt
                        class="login-bg"
                    />
                </el-col>
                <!-- 右侧登陆模块 -->
                <el-col :xs="8" :sm="7" :md="7" :lg="7" :xl="6" :push="1">
                    <!-- 路由内容 -->
                    <!-- <nuxt-child>标签在父页面组件中相当于是子页面组件的占位符,嵌套中这个不可少 -->
                    <nuxt-child keep-alive :foobar="1" />
                </el-col>
            </el-row>
        </main>
        <footer class="footer">
            <ul>
                <li>技术支持:</li>
                <li>北京联创高科信息技术有限公司</li>
                <li>服务热线:</li>
                <li>010-68963151</li>
            </ul>
        </footer>
    </div>
</template>

<script>
import Vue from 'vue'
// import debounce from '@/utils/debounce'
import Component from 'class-component'

@Component
export default class Login extends Vue {
  layout () {
    return 'empty'
  }
  mounted () {
    this.$router.push({ path: '/login/ipw' })
  }
}
</script>

<style lang="scss" scoped>
$ht-ft_bg: #eee;
$f-333: #333;
$c-fff: #fff;
$b-r_8: 8px;
$c-aeaeae: #aeaeae;
$c-0087d0: #0087d0;

body {
    background-color: $ht-ft_bg;
}
.login-container {
    color: $f-333;
    .grid-content {
        min-height: 40px;
    }
    @media only screen and (max-width: 1200px) {
        .header-title {
            padding-top: 44px;
        }
        .main {
            padding: 3% 0 4%;
        }
    }
    @media only screen and (min-width: 1200px) {
        .header-title {
            padding-top: 44px;
        }
        .main {
            padding: 3% 0 4%;
        }
    }
    @media only screen and (min-width: 1440px) {
        .header-title {
            padding-top: 44px;
        }
        .main {
            padding: 4% 0 5%;
        }
    }
    @media only screen and (min-width: 1920px) {
        .header-title {
            padding-top: 112px;
        }
        .main {
            padding: 4% 0 5%;
        }
    }
    .header {
        background-color: $ht-ft_bg;
        .header-title {
            overflow: hidden;
            padding-bottom: 20px;
            .logo {
                width: 40px;
                height: 40px;
                vertical-align: middle;
                float: left;
            }
            dl {
                float: left;
                margin: 0px;
                margin-left: 16px;
                dt {
                    line-height: 20px;
                    font-size: 20px;
                    font-family: MicrosoftYaHei-Bold;
                }
                dd {
                    margin: 0px;
                    line-height: 20px;
                    font-size: 10px;
                    font-family: MicrosoftYaHei;
                    text-align: left;
                }
            }
        }
    }
    .main {
        background-color: #53abda;
        .el-row {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .login-bg {
            width: 100%;
            height: 100%;
            margin-top: 34px;
        }
    }
    .footer {
        background-color: $ht-ft_bg;
        height: 60px;
        line-height: 60px;
        ul {
            padding: 0;
            margin: 0;
            text-align: center;
            overflow: hidden;
            display: flex;
            justify-content: center;
            font-size: 12px;
            color: #999;
            li {
                float: left;
                list-style: none;
            }
        }
    }
}
</style>
<style>
@import "~/assets/icon/login/iconfont.css";
</style>