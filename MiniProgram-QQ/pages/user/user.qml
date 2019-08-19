<template name="list">
  <button qq:if="{{isContact}}" class='hidden-btn' open-type='contact'>contact</button>
  <button qq:if="{{isFeedback}}" class='hidden-btn' open-type='feedback'>feedback</button>
  <view class="list" hover-class="none" data-tip="{{tip}}" data-url="{{url}}" data-type="{{type}}" catchtap='navigateTo'>
    <view class="list-icon-wrap">
      <image src="{{icon}}" class="list-icon"></image>
    </view>
    <view class="list-text">{{text}}</view>
    <view class="arrow-wrap">{{tip}}
      <image src="images/accessory.png" class="list-arrow"></image>
    </view>
  </view>
  <view style="height: 10rpx;"></view>
</template>

<scroll-view scroll-y="trues" class="user">
  <view class="info">
    <view class="info-wrap">
      <button class="info-icon" open-type="getUserInfo" bindgetuserinfo="getUserInfo" style ="background-image:url({{userInfo.avatarUrl}})">
      </button>
      <view class="info-name">{{userInfo.nickName}}</view>
    </view>
  </view>
  <template qq:for="{{list}}" is="list" data="{{...item}}"></template>
</scroll-view>