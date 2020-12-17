<template>
  <div class="login-container">
    <!--登录面板内容部分-->
    <div class="login-inner">
      <!--面板头部-->
      <div class="login-header">
        <div class="login-logo">
          <img src="./images/logo-round.png" alt="" width="150">
        </div>
        <!--面板标题-->
        <div class="login-header-title">
          <a href="javascript:;" :class="{current: !loginMode}" @click="dealLoginMode(false)">密码登录</a>
          <a href="javascript:;" :class="{current: loginMode}" @click="dealLoginMode(true)">用户注册</a>

        </div>
      </div>
      <!--面板表单部分-->
      <div class="login-content">
        <form>
          <!--账号登录部分-->
          <div :class="{current: !loginMode}">
            <section>
              <section class="login-message">
                <input type="text" maxlength="11" placeholder="账号" v-model="user_name">
              </section>
              <section class="login-verification">
                <input type="password" maxlength="18" placeholder="密码" v-if="pwdMode" v-model="pwd">
                <input type="text" maxlength="18" placeholder="密码" v-else v-model="pwd">
                <div class="switch-show">
                  <img @click.prevent="dealPwdMode(false)" :class="{on: pwdMode}" src="./images/hide_pwd.png" alt=""
                       width="20">
                  <img @click.prevent="dealPwdMode(true)" :class="{on: !pwdMode}" src="./images/show_pwd.png" alt=""
                       width="20">
                </div>
              </section>

              <section class="login-hint">
                温馨提示：未注册帐号的用户账号，登录时将自动注册，且代表已同意
                <a href="javascript:;">服务协议与隐私政策</a>
              </section>
            </section>
          </div>
          <!--用户注册-->
          <div :class="{current: loginMode}">
            <section class="login-message">
              <input type="tel" maxlength="11" placeholder="用户名" v-model="name">
            </section>
            <section class="login-message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
            </section>
            <section class="login-message">
              <input type="text" maxlength="20" placeholder="邮箱" v-model="email">
            </section>
            <section class="login-verification">
              <input type="password" maxlength="18" placeholder="密码" v-if="pwdMode" v-model="pwd">
              <input type="text" maxlength="18" placeholder="密码" v-else v-model="pwd">
              <div class="switch-show">
                <img @click.prevent="dealPwdMode(false)" :class="{on: pwdMode}" src="./images/hide_pwd.png" alt=""
                     width="20">
                <img @click.prevent="dealPwdMode(true)" :class="{on: !pwdMode}" src="./images/show_pwd.png" alt=""
                     width="20">
              </div>
            </section>
            <section class="login-hint">
              温馨提示：未注册帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">服务协议与隐私政策</a>
            </section>
          </div>

          <button class="login-submit" @click.prevent="login()">登录</button>
        </form>
        <button class="login-back" @click="$router.back()">返回</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {getPhoneCode, phoneCodeLogin, pwdLogin, addUser} from './../../api/index';
  import { MessageBox } from 'element-ui';
  import {mapActions} from 'vuex'

  export default {
    name: "Login",
    data() {
      return {
        loginMode: false, // 登录方式, true 验证码登录 false 账号登录
        phone: '', // 手机号码
        name: '', // 用户名
        countDown: 0, // 倒计时
        pwdMode: true, // 密码的显示方式 true 密文 false 明文
        email: '', // 邮箱
        pwd: '', // 密码登录成功
        code: '', // 验证码
        userInfo: {}, // 用户的信息
        user_name: '', // 用户名
        user_登录成功mail: '', // 邮箱
      }
    },
    computed: {
      // 验证手机号是否合理
      phoneRight() {
        return /^[1][3,4,5,7,8][0-9]{9}$/.test(this.phone)
      }
    },
    methods: {
      ...mapActions(['syncUserInfo']),
      // 1. 登录的模式
      dealLoginMode(flag) {
        this.loginMode = flag;
      },

      // 2.验证码不要 已删除
      // 3. 密码的显示方式
      dealPwdMode(flag) {
        this.pwdMode = flag;
      },
      // 4. 获取图形验证码不要，已删除

      // 5. 登录
      async login() {
        // 5.1 登录模式
        if (this.loginMode) { // 注册
          // 5.2 前台校验
          if (!this.phone) {
		        MessageBox({
              type: 'info',
              message: "请输入手机号码!",
			        showClose: true,
            });
            return;
          } else if (!this.phoneRight) {
		        MessageBox({
              type: 'info',
              message: "请输入正确手机号码!",
			        showClose: true,
            });
            return;
          }


          // 5.3 注册
          const result = await addUser(this.phone, this.name, this.pwd, this.email );
          if (result.success_code === 200) {
            this.userInfo = result.message;
			      this.phone = ''; // 手机号码
            this.countDown = 0; // 倒计时
			      clearInterval(this.intervalId);
            this.code = ''; // 验证码
			      this.pwd = ''; // 密码
            this.user_name = ''; // 用户名

          } else {
            this.userInfo = {
              message: '用户名已存在 !'
            };
          }
        } else { // 账号和密码登录
          // 5.4 前端校验
          if (!this.user_name) {
            this.$message.warning('请输入账号!')
            return;
          } else if (!this.pwd) {
            this.$message.warning('请输入密码!')

            return;
          }
          // 5.5 用户名和密码的登录
          const result = await pwdLogin(this.user_name, this.pwd);
          if (result.success_code === 200) {
            this.userInfo = result.message;
			      this.phone = ''; // 手机号码
            this.countDown = 0; // 倒计时
			      clearInterval(this.intervalId);
            this.code = ''; // 验证码
			      this.pwd = ''; // 密码
            this.user_name = ''; // 账号
          } else {
            this.$message.warning('登录失败, 账号或密码不正确!')
            return;
          }
        }

        // 6. 后续处理
        if (!this.userInfo.id) { // 失败
          this.$message.warning(this.userInfo.message)

        } else { // 成功
          // 6.1 同步用户数据
          this.syncUserInfo(this.userInfo);
          // 6.2 跳转首页
          this.$message.success(this.loginMode? '注册成功': '登录成功')
          this.$router.back();
          window.localStorage.setItem("userInfo",JSON.stringify(this.userInfo));
          window.localStorage.removeItem("adminInfo");
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .login-container
    width 100%
    height 100%
    background #fff
    .login-inner
      padding-top 60px
      width 25%
      margin 0 auto
      .login-header
        .login-logo
          font-size 20px
          font-weight bold
          color mediumpurple
          text-align center
        .login-header-title
          padding-top 40px
          padding-bottom 10px
          text-align center
          > a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.current
              color mediumpurple
              font-weight 700
              border-bottom 2px solid mediumpurple
      .login-content
        > form
          > div
            display none
            &.current
              display block
            input
              width 100%
              height 100%
              padding-left 8px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid mediumpurple
            .login-message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get-verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.phone_right
                  color purple
            .login-verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch-show
                position absolute
                right 10px
                top 12px
                img
                  display none
                img.on
                  display block
            .login-hint
              margin-top 12px
              color #999
              font-size 12px
              line-height 20px
              > a
                color mediumpurple
          .login-submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background mediumpurple
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .login-back
          display block
          width 100%
          height 42px
          margin-top 15px
          border-radius 4px
          background transparent
          border: 1px solid mediumpurple
          color mediumpurple
          text-align center
          font-size 16px
          line-height 42px
</style>
