<!--<qs module="m1" src="./qs/getHeader.qs"></qs>-->

<scroll-view scroll-y style="height:{{height}}px;" class="item-wrapper">
  <view class="search">
    <view class="head_search">
      <input class="text_search colorGray" type='text' confirm-type="search" placeholder="请输入关键词" bindinput="bindInput" bindconfirm="bindGoSearch" value="{{inputVal}}"></input>
    </view>
  </view>

  <view class="item-list" qq:for="{{itemData}}" qq:for-item="item" qq:for-index="index" qq:key="that">
    <view class="item-info" style="left:{{item.left + 'rpx'}}">
      <checkbox class="info-img" bindtap="tapview" data-content="{{item}}" checked="{{item.Checked}}" ></checkbox> 
      <!-- <image class="info-img" src="{{m1.getHeadImagePath(item.SmallImgPath)}}" ></image> -->
      <view class="info-wrapper">
        <view class="info-desc">
          <view class="name">{{item.Name}}</view>
          <!-- <view class="time">{{item.time}}</view> -->
        </view>
        <!-- <view class="info-content">{{item.info}}</view> -->
        <view class="info-content">{{item.FiveEle}}</view>
      </view>
    </view>
  </view>
</scroll-view>