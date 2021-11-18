<template>
  <view class="map-content">
    <map
      :scale="18"
      id="myMap"
      style="width: 100%; height: 100%"
      :longitude="locationInfo.longitude"
      :latitude="locationInfo.latitude"
    >
    </map>
  </view>
</template>

<script>
//:markers="locationInfo.markers"
import { mapState } from "vuex";
export default {
  data() {
    return {
      mapHeight: "",
      markers: [
        {
          id: 1,
          latitude: 26.0527,
          longitude: 119.3141,
          iconPath: "../../static/icon_address.png",
        },
      ],
      longitude: "",
      latitude: "",
      circles: [
        {
          latitude: 26.0527,
          longitude: 119.3141,
          fillColor: "#aabbcc", //填充颜色
          color: "#A7B6CB", //描边的颜色
          radius: 6, //半径
          strokeWidth: 2, //描边的宽度
        },
      ],
    };
  },

  onLoad(option) {
   console.log(this.locationInfo)
  },
  props: {
    locationInfo: {
      type: Object,
      default() {
        return { any };
      },
    },
  },

  methods: {
    // 获取地理位置
    getLocationInfo() {
      var that = this;
      uni.getLocation({
        type: "wgs84",
        // type: "gcj02",
        success: (res) => {
          console.log("位置信息: ", res);
          that.latitude = res.latitude;
          that.longitude = res.longitude;
          //标记点
          that.markers = [
            {
              id: 1,
              latitude: res.latitude,
              longitude: res.longitude,
              iconPath: "../../static/map/addr.png",
            },
          ];
          // that.circles = [{ //在地图上显示圆
          // 	latitude: res.latitude,
          // 	longitude: res.longitude,
          // 	fillColor: "#D9E6EF", //填充颜色
          // 	color: "#A7B6CB", //描边的颜色
          // 	radius: 50, //半径
          // 	strokeWidth: 2 //描边的宽度
          // }]
        },
      });
    },
  },
};
</script>

<style>
.map-content {
  box-sizing: border-box;
  height: 100%;
}
</style>
