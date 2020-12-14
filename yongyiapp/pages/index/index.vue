<template>
    <view class="container">
        <view class="wrapper">
            <view class="input-content">
                <view class="cu-form-group"
                      style="border: 2upx solid whitesmoke;margin-bottom: 20px;border-radius: 30px">
                    <view class="title">手机号</view>
                    <input
                            type="number"
                            :value="mobile"
                            placeholder="请输入手机号"
                            maxlength="11"
                            data-key="mobile"
                            @input="inputChange"
                    />
                </view>
                <view class="cu-form-group" style="border: 2upx solid whitesmoke;border-radius: 30px">
                    <view class="title">密码</view>
                    <input
                            :type="!showPassword?'password':'text'"
                            placeholder="请输入密码"
                            maxlength="20"
                            :value="code"
                            data-key="code"
							
                            @input="inputChange"
                            @confirm="toLogin"
                    />
					<image
						style="width: 32upx;height: 32upx;font-size: 32upx;"
						class="img cuIcon"
						:class="showPassword?'cuIcon-attention':'cuIcon-attentionforbid'"
						@tap="showPass"
					></image>
                    <text class="send-msg" @click="forget" style="margin-left: 16upx;">忘记密码</text>
                </view>
            </view>
            <button class="confirm-btn" @click="toLogin">登录</button>
            <view style="margin-top: 32px;text-align: center">
                <view>没有账号？
                    <text style="color: #e10a07" @click="register()">立即注册</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>

    export default {
        data() {
            return {
                mobile: '',
                code: '',
				
				showPassword: false, //是否显示明文
                sending: false,
                sendTime: '获取验证码',
                count: 60,
            }
        },
        methods: {
			showPass(){
				//是否显示密码
				this.showPassword = !this.showPassword
			},
            forget() {
                uni.navigateTo({
                    url: '/pages/public/pwd'
                });
            },
            register() {
                uni.navigateTo({
                    url: '/pages/public/register'
                });
            },
            inputChange(e) {
                const key = e.currentTarget.dataset.key;
                this[key] = e.detail.value;
            },
            navBack() {
                uni.navigateBack();
            },

            toLogin() {
                this.$queue.loginClear();
                let openid = this.$queue.getData("openid");
                const {mobile, code} = this;
				if (!mobile) {
				    this.$queue.showToast("请输入手机号");
				} else if (mobile.length!=11) {
				    this.$queue.showToast("请输入手机号");
				} else if (!code) {
				    this.$queue.showToast("请输入密码");
				}else{
					this.$queue.showLoading("正在登录中...");
					this.$Request.postJson("/user/login", {
					    pwd: code,
					    phone: mobile,
					    openid: openid
					}).then(res => {
					    if (res.status === 0) {
					        this.$queue.setData("token", res.data.uuid);
					        this.$queue.setData("userId", res.data.userId);
					        this.$queue.setData("mobile", mobile);
					        this.getUserInfo(res.data.userId, res.data.uuid);
					    } else {
					        uni.hideLoading();
							this.$queue.showToast(res.msg);
					    }
					});
				}
                
                
            },
            getUserInfo(userId, token) {
                this.$Request.getT("/user/" + userId).then(res => {
                    if (res.status === 0) {
                        this.$queue.setData("image_url", res.data.image_url ? res.data.image_url : '/static/img/common/logo.jpg');
                        this.$queue.setData("relation_id", res.data.relationId);
                        this.$queue.setData("relation", res.data.invitation);
                        this.$queue.setData("grade", res.data.grade);
                        this.$queue.setData("isInvitation", res.data.isInvitation);
                        this.$queue.setData("nickName", res.data.nickName ? res.data.nickName : res.data.phone);
                        this.$queue.setData("gender", parseInt(res.data.gender));
                        let href = this.$queue.getData("href");
                        if (href) {
                            if (href==='/pages/member/publisher') {
                                this.$queue.remove("href");
                                uni.redirectTo({
                                    url: '/pages/member/publisher?uid=' + userId + '&token=' + token
                                });
                            } else if (href==='/pages/member/user') {
                                this.$queue.remove("href");
                                uni.switchTab({
                                    url: '/pages/member/user'
                                });
                            } else {
                                this.$queue.remove("href");
                                uni.redirectTo({
                                    url: href
                                });
                            }
                        } else {
                            uni.switchTab({url: '/pages/index/index'});
                        }
                    } else {
                        uni.showModal({
                            showCancel: false,
                            title: '登录失败',
                            content: res.msg,
                        });
                        this.$queue.logout();
                    }
                    uni.hideLoading();
                });
            }
        },

    }
</script>

<style lang='scss'>
    page {
        background: #fff;
    }

    .send-msg {
        border-radius: 30px;
        color: black;
        background: white;
        height: 30px;
        font-size: 14px;
        line-height: 30px;
    }

    .container {
        top: 0;
        padding-top: 32upx;
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #fff;
    }

    .wrapper {
        position: relative;
        z-index: 90;
        background: #fff;
        padding-bottom: 20px;
    }

    }
</style>
