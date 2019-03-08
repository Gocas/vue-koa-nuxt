<template>
    <div>
        <el-container class="login-main">
            <el-header class="login-main_header">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <div class="qrcode-title">二维码登录</div>
                    </el-col>
                </el-row>
            </el-header>
            <div class="qrcode-content" v-if="!loginQRcodeSuccess">
                <div class="qrcode-img">
                    <!-- <vue-qr :text="qrcode.value" :size="152" :auto-color="true" :margin="0"></vue-qr> -->
                    <img src="~/assets/img/login/qrcode_url.png" alt />
                </div>
                <div class="qr-info">
                    <i class="icon iconfont icon-saoyisao qr-icon_span"></i>
                    <dl>
                        <dt>
                            <span>
                                打开
                                <span class="qr-app">手机APP</span>
                            </span>
                        </dt>
                        <dd>
                            <span>扫一扫登录</span>
                        </dd>
                    </dl>
                </div>
            </div>
            <div class="qrcode-content" v-else-if="loginQRcodeSuccess">
                <div class="qrcode-img">
                    <i class="icon iconfont icon-wancheng qr-icon_wancheng"></i>
                </div>
                <div class="qr-wancheng_info">
                    <p class="f-18_333">扫描成功</p>
                    <p class="f-12_999">请勿刷新本页面，按手机提示操作!</p>
                </div>
            </div>
            <p class="qr-delete_p">
                <i
                    class="icon iconfont icon-guanbi qr-icon_delete"
                    @click="qrHideFn()"
                ></i>
            </p>
        </el-container>
    </div>
</template>
<script>
import Component from 'class-component'
@Component
export default class Qr {
  asyncData () {
    return {
      loginQRcodeSuccess: false,
      qrcode: {
        value: ''
      }
    }
  }
  mounted () { }
  /* 切换登陆方式 */
  qrHideFn () {
    let lc = this.$route.query.lc
    this.$router.push({ path: '/login/ipw', query: { lc: lc } })
  }
}
</script>
<style lang="scss" scoped>
.login-main {
    border-radius: 8px;
    padding: 0 20px;
    background: rgba(255, 255, 255, 0.9);
    .login-main_header {
        cursor: pointer;
        text-align: center;
        .login-method {
            display: inline-block;
            text-align: center;
            color: #aeaeae;
            font-size: 18px;
            padding: 31px 10px 13px 10px;
            // width: 80%;
        }
        .active {
            color: #0087d0;
            border-bottom: 2px solid #409eff;
        }
        .qrcode-title {
            font-size: 24px;
            color: #333;
            margin-top: 29px;
        }
    }
    .qrcode-content {
        text-align: center;
        margin: 43px 0 0px;
        img {
            width: 152px;
            height: 152px;
        }
        .login-qrcode {
            width: 152px;
            height: 152px;
        }
        .qr-info,
        .qr-wancheng_info {
            .qr-icon_span {
                color: #0087d0;
                font-size: 32px;
                display: inline-block;
            }
            dl {
                color: #999999;
                display: inline-block;
                font-size: 12px;
                dt {
                    line-height: 16px;
                    .qr-app {
                        color: #0087d0;
                    }
                }
                dd {
                    margin: 0;
                    text-align: left;
                    line-height: 16px;
                }
            }
            .qr-delete_p {
                color: #cecece;
                text-align: right;
                .qr-icon_delete {
                    font-size: 24px;
                    cursor: pointer;
                }
            }
            .f-18_333 {
                font-size: 18px;
                color: #333;
            }
            .f-12_999 {
                font-size: 12px;
                color: #999;
            }
        }
        .qr-icon_wancheng {
            font-size: 96px;
            color: #5a99e4;
        }
    }
}
.qr-delete_p {
    color: #cecece;
    text-align: right;
    .qr-icon_delete {
        font-size: 24px;
        cursor: pointer;
    }
}
</style>

