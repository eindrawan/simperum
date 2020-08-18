<template>
  <div id="page-db-map">
    <Map
      width="100vw"
      height="calc(100vh - 110px)"
      :lat="detail.GeoLat"
      :lon="detail.GeoLng"
      :searchbox="false"
      :markers="markers"
      @ready="MapReady"
      @change="MapChange"
    />
    <div class="detail-panel">
      <div class="padding">
        <Checkbox
          v-for="(layer, idx) in layers"
          :key="idx"
          :text="layer.name"
          :value="layer.visible"
          @onClick="LayerClick(layer, ...arguments)"
        />
      </div>
    </div>
    <div class="detail-panel hide">
      <div class="padding">
        <div>
          {{ detail.KRT_Nama }}
        </div>
        <div style="font-size:12px;">
          {{ detail.NIK }}
        </div>
        <div style="font-size:12px; color:gray;">
          {{ detail.Alamat }}
        </div>
        <div style="font-size:12px; color:gray;">
          {{ detail.Kabupaten }}, {{ detail.Kecamatan }}, {{ detail.Kelurahan }}
        </div>
      </div>
      <div
        style="display: flex;
          width: 310px;
          max-height: 300px;
          flex-wrap: wrap;
          overflow: auto;"
      >
        <div
          style="width:150px;"
          v-for="(item, idx) in photos"
          :key="idx"
          v-show="detail[item.key]"
        >
          <div style="padding:5px 8px; font-size:12px; background:#f3f3f3;">
            {{ item.text }}
          </div>
          <div
            class="imgbox"
            :style="{
              'background-image': `url(${detail[item.key]})`
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    markers: [],
    layers: [],
    detail: {},
    photos: [
      { key: "Profile", text: "Profile" },
      { key: "RumahDepan", text: "RUMAH DEPAN" },
      { key: "RumahSamping", text: "RUMAH SAMPING" },
      { key: "Atap0", text: "ATAP 0%" },
      { key: "Atap50", text: "ATAP 50%" },
      { key: "Atap100", text: "ATAP 100%" },
      { key: "Lantai0", text: "LANTAI 0%" },
      { key: "Lantai50", text: "LANTAI 50%" },
      { key: "Lantai100", text: "LANTAI 100%" },
      { key: "Dinding0", text: "DINDING 0%" },
      { key: "Dinding50", text: "DINDING 50%" },
      { key: "Dinding100", text: "DINDING 100%" }
    ]
  }),
  props: {
    dbref: String,
    dbparams: Object,
    noRef: Number
  },
  watch: {
    noRef(val) {
      this.Populate(val);
    }
  },
  methods: {
    async MapReady() {
      let ret = await this.$api.call(this.dbref, this.dbparams);
      this.markers = ret.data;
      // this.markers = [
      //   {
      //     title: "WONOSOBOWONOSOBOWONOSOBOTIMUR",
      //     lat: -7.3573378,
      //     lon: 109.9035395,
      //     icon: "rgba(0,255,0,0.5)",
      //     layer: "Intervensi Baik"
      //   }
      // ];
    },
    MapChange(map) {
      map.getLayers().forEach(layer => {
        if (layer.values_.name) {
          this.layers.push({
            instance: layer,
            name: layer.values_.name.replace("marker-", ""),
            visible: layer.values_.visible
          });
        }
      });
    },
    LayerClick(layer, visible) {
      layer.visible = visible;
      layer.instance.setVisible(visible);
    },
    async Populate(val) {
      let ret = await this.$api.call("PRM.SelPersonSummary", { NoUrutRT: val });
      this.detail = ret.data[0];
    }
  }
};
</script>
<style lang="scss">
#page-db-map {
  position: relative;
  .detail-panel {
    width: 310px;
    background: white;
    position: absolute;
    right: 10px;
    top: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
    border-radius: 5px;
    overflow: hidden;
    max-height: 600px;
  }
  .imgbox {
    background: #ddd;
    width: 150px;
    height: 150px;
  }
}
</style>
