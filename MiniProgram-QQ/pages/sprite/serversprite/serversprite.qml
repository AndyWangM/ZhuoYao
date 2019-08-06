<view scroll-y style="height:{{height}}px;" class="item-wrapper">
  <view class="search">
    <view class="colorGray">
      <picker class="colorGray" bindchange="bindPickerChange" value="{{spriteTypeIndex}}" range="{{spriteType}}" range-key="{{'displayName'}}">
        <view class="picker">点此选择类型：{{spriteType[spriteTypeIndex].displayName}}</view>
      </picker>
      <picker class="colorGray" bindchange="bindPickerChange" value="{{spriteTypeIndex}}" range="{{spriteType}}" range-key="{{'displayName'}}">
      </picker>
      <input class="text_search" type='text' placeholder="按省/市全名过滤(如浙江省或南昌市，默认全国)" bindinput="bindProvinceInput" value="{{province}}"></input>
      <view class="head_search">
        <input class="text_search" type='text' confirm-type="search" placeholder="搜索单个妖灵全名(如银角小妖，默认全部)" bindinput="bindInput" bindconfirm="bindGoSearch" value="{{inputVal}}"></input>
        <button class="icon_search" bindtap='getLatestSprite'>搜索</button>
      </view>
    </view>
  </view>
</view>
  <view qq:if="{{result.length}}">
    <map id="map" scale="5" markers="{{result}}" bindmarkertap="markertap" show-location style="width: 100%; height: 200px;"></map>
    <button qq:if="{{currentPage}}" class="icon_search" bindtap='frontPage'>上一页</button>
    <button qq:if="{{hasNextPage}}" class="icon_search" bindtap='nextPage'>下一页</button>
  </view>
<scroll-view scroll-y class="item-wrapper">
  <view class="item-list" qq:for="{{result}}" qq:for-item="item" qq:for-index="index" qq:key="that">
    <view class="item-info" style="{{clickedObj[item.hashid]?'background:#BBFFFF':''}}" bindtap="tapview" data-content="{{item}}">
      <view class="info-wrapper">
        <view class="info-desc">
          <view class="name">{{item.name}}</view>
          <view class="time">{{item.lefttime}}</view>
        </view>
        <!-- <view class="info-content">{{item.info}}</view> -->
        <view class="info-content">{{item.rlatitude + ", " + item.rlongitude}}</view>
      </view>
    </view>
  </view>
</scroll-view>