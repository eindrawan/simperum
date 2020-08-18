<template>
  <div
    class="ui-map"
    :id="id"
    :style="{
      width: width,
      height: height
    }"
  >
    <div :id="`${id}--map`" style="width:100%; height:100%;"></div>
    <Search
      v-if="searchbox"
      class="map-search"
      width="300px"
      :value.sync="searchVal"
      placeholder="Cari..."
      :valueAsObject="true"
      textKey="display_name"
      :dbref="{ method: 'get', url: this.parseUrl, parseData: this.parseData }"
    />
  </div>
</template>
<script>
import "ol/ol.css";
import { Map, View, Feature } from "ol";
import { fromLonLat, toLonLat } from "ol/proj";
import { Icon as MapIcon, Style as MapStyle } from "ol/style";
import { Point as MapPoint } from "ol/geom";
import TileLayer from "ol/layer/Tile";
import MapVector from "ol/source/Vector";
import LayerVector from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import Search from "./Search";

export default {
  components: {
    Search
  },
  data: () => ({
    map: null,
    mapView: null,
    id: null,
    checker: null,
    searchVal: null,
    value: null,

    xMarkers: {}
  }),
  props: {
    width: {
      type: String,
      default: "250px"
    },
    height: {
      type: String,
      default: "250px"
    },
    lat: [String, Number],
    lon: [String, Number],
    searchbox: {
      type: Boolean,
      default: true
    },
    markers: Array,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    searchVal(val) {
      if (val) {
        this.mapView.setCenter(
          fromLonLat([parseFloat(val.lon), parseFloat(val.lat)])
        );
        this.mapView.setZoom(13);
        this.$emit("update:lat", val.lat);
        this.$emit("update:lon", val.lon);
      }
    },
    markers(val) {
      this.clearMarkers();
      val.forEach(m => {
        this.addMarker(m);
      });
      this.$emit("change", this.map);
    },
    value(val) {
      // var l = val.split("|");
      this.clearMarkers();
      if (val && val.lat && val.lon) {
        this.addMarker(val);
        let zoom = this.mapView.getZoom();
        this.mapView.animate({
          center: fromLonLat([parseFloat(val.lon), parseFloat(val.lat)]),
          zoom: zoom < 13 ? 13 : zoom,
          duration: 700
        });
        this.$emit("update:lat", val.lat);
        this.$emit("update:lon", val.lon);
      }
    },
    lat(val) {
      this.value = { lat: val, lon: this.lon };
    }
  },
  async created() {
    if (!window.uuid) window.uuid = 0;
    this.id = "map-" + window.uuid++;
  },
  mounted() {
    this.mapView = new View({
      center: [12185696.496001672, -808222.1359253724],
      zoom: 8
    });
    this.map = new Map({
      target: this.id + "--map",
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: this.mapView
    });
    this.map.on(
      "click",
      function(evt) {
        var feature = this.map.forEachFeatureAtPixel(evt.pixel, function(
          feature
        ) {
          return feature;
        });
        if (feature) {
          // var coordinates = feature.getGeometry().getCoordinates();
          // if (feature.N.onclick) feature.N.onclick(feature.N.tooltip_data);
        } else {
          if (this.disabled) return;
          var lonlat = toLonLat(evt.coordinate);
          // this.$emit("update:value", lonlat[1] + "|" + lonlat[0]);
          this.value = { lat: lonlat[1], lon: lonlat[0] };
        }
      }.bind(this)
    );

    this.checker = setInterval(this.refreshIfNotExist.bind(this), 1000);
  },
  methods: {
    refreshIfNotExist() {
      if (document.querySelector(`#${this.id}--map .ol-layers canvas`)) {
        clearInterval(this.checker);
        this.$emit("ready", this.map);
      } else {
        this.map.updateSize();
        this.value = {
          lat: this.lat,
          lon: this.lon
        };
      }
    },
    parseData(ret) {
      return ret.data;
    },
    parseUrl(keyword) {
      return `https://nominatim.openstreetmap.org/search?q=${keyword}&format=json&countrycodes=id`;
    },

    // MARKERS
    clearMarkers() {
      if (this.xMarkers["markers"]) {
        this.xMarkers["markers"].clear();
      }
    },
    addMarker(m) {
      var marker = new Feature({
        tooltip_data: m.title,
        onclick: m.onclick,
        geometry: new MapPoint(
          fromLonLat([parseFloat(m.lon), parseFloat(m.lat)])
        )
      });
      if (typeof m.icon == "object") {
        marker.setStyle(
          new MapStyle({
            image: new MapIcon(m.icon)
          })
        );
      } else {
        marker.setStyle(
          new MapStyle({
            image: new MapIcon({
              color: m.icon ? m.icon : "white",
              crossOrigin: "anonymous",
              src: "/img/icons/dot.png"
            })
          })
        );
      }

      let markerName = "markers" + (m.layer ? "-" + m.layer : "");
      var markers = this.xMarkers[markerName];
      if (!markers) {
        // if (this.attr("tooltip")) {
        //   $(this).UI("createTooltip");
        //   this.map.on("pointermove", $.UI.map.showTooltip.bind(this));
        // }

        var markerVectorLayer = new LayerVector({
          name: "marker-" + (m.layer ? m.layer : "default"),
          source: new MapVector({
            features: [marker]
          })
        });
        this.map.addLayer(markerVectorLayer);
        markers = markerVectorLayer.getSource();
      } else {
        markers.addFeature(marker);
      }
      this.xMarkers[markerName] = markers;
      // console.log(markerName, this.xMarkers);
      // this.data("markers" + (layerName ? "-" + layerName : ""), markers);
    }
  }
};
</script>
<style lang="scss">
.ui-map {
  position: relative;
  .map-search {
    position: absolute;
    right: 10px;
    top: 10px;

    input {
      background: white;
    }
  }
  .ol-attribution {
    display: none;
  }
}
</style>
