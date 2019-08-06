<view>
  <!-- <button bindtap='getConfig'>获取配置</button> -->

  <button bindtap='selectLocation'>选择地理位置</button>
  <view qq:if="{{mapInfo.longitude}}">
    <text>{{mapInfo.address}}</text>
    <!-- <button bindtap='searchLeitai'>擂台搜索</button> -->
    <input type="number" bindinput='bindXInput' placeholder='经度范围(见全局设置使用说明)'></input>
    <input type="number" bindinput='bindYInput' placeholder='纬度范围(见全局设置使用说明)'></input>
    <!-- <input type="number" bindinput='bindSpeed' placeholder='单区域搜索时间(见全局设置使用说明)'></input> -->
    <map style="width: 100%; height: 200px;" longitude="{{mapInfo.longitude}}" scale="11" latitude="{{mapInfo.latitude}}" markers='{{result}}' bindmarkertap="markertap" polygons="{{polygons}}" enable-overlooking="true" enable-rotate="true" enable-zoom="true"
      enable-scroll="true" show-location></map>
    <button bindtap='searchYaojing'>妖灵搜索</button>

    <!-- <text qq:if="{{isSearching}}">搜索中</text> -->
  </view>

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
