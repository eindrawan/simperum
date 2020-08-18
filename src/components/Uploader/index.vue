<template>
  <div class="ui-upload" style="position:relative" :id="id">
    <input
      type="file"
      ref="uploader"
      multiple
      @change="previewFiles"
      v-show="false"
    />
    <slot :opener="handleOpen" :uploadedFile="value">
      <div
        @click="handleOpen"
        class="imgbox opener dropbox"
        :style="imgboxStyle"
      ></div>
    </slot>
    <VueQrcode
      :id="id + `_qrcode`"
      :value="qrcode"
      v-if="showQRCode"
      :style="{
        width: '150px',
        height: '150px',
        position: 'absolute',
        top: '0px',
        left: '0px'
      }"
    />
    <Popover :targetId="id" on="contextmenu">
      <template>
        <div
          v-for="(item, idx) in opts"
          :key="idx"
          class="ui-dropdown--item popover-close"
          @click="handleItemClick(item)"
        >
          <div class="ui-dropdown--item-inner">
            {{ item.text }}
          </div>
        </div>
      </template>
    </Popover>
  </div>
</template>

<script>
import Popover from "@/components/Forms/Popover";
import VueQrcode from "vue-qrcode";

//import Vue from "vue";

export default {
  components: {
    Popover,
    VueQrcode
  },
  data: () => ({
    files: [],
    id: "upload",
    uploadedFile: null,
    showQRCode: false
  }),
  props: {
    value: String
  },
  computed: {
    qrcode() {
      return (
        window.location.protocol +
        "//" +
        window.location.host.replace(":8000", ":8001") +
        "/Main/App/Extender?clientKey=" +
        window.ClientKey +
        "&cmd=upload"
      );
    },
    opts() {
      if (this.showQRCode) return [{ text: "Cancel" }];
      else if (this.value)
        return [{ text: "Mobile Upload" }, { text: "View" }, { text: "Clear" }];
      else return [{ text: "Mobile Upload" }];
    },
    imgboxStyle() {
      if (!this.value) {
        return {
          "background-image": "url(/img/icons/camera.png)"
        };
      } else {
        let ext = this.value.substr(-3);
        if (
          ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext)
        ) {
          return {
            "background-image": "url(/img/icons/" + ext + "-icon.png)"
          };
        }
        return {
          "background-image": "url(" + this.$api.url + this.value + ")",
          "background-size": "cover"
        };
      }
    }
  },
  created() {
    if (!window.uuid) window.uuid = 0;
    this.id = "upload-" + window.uuid++;
  },
  methods: {
    handleOpen() {
      this.$refs.uploader.click();
    },
    async previewFiles(event) {
      var form = new FormData();
      form.append("file", event.target.files[0]);
      let res = await this.$api.upload(form);
      if (res.success) {
        this.uploadedFile = res.data;
        this.$emit("update:value", res.data);
      }
    },
    handleItemClick(item) {
      if (item.text == "Mobile Upload") {
        this.showQRCode = true;
        if (this.$options.sockets.onmessage)
          delete this.$options.sockets.onmessage;
        this.$options.sockets.onmessage = evt => {
          let d = JSON.parse(evt.data);
          if (d.clientKey == window.ClientKey) {
            this.$emit("update:value", d.value);
            this.showQRCode = false;
          }
        };
      } else if (item.text == "View") {
        window.open(this.value, "_blank");
      } else if (item.text == "Cancel") {
        if (this.$options.sockets.onmessage)
          delete this.$options.sockets.onmessage;
        this.showQRCode = false;
      } else if (item.text == "Clear") {
        this.$emit("update:value", "");
      }
    }
  }
};
</script>
<style lang="scss">
.ui-upload {
  .upload-image {
    width: 200px;
    height: 200px;
    background-color: #f3f3f3;
    background-position: center;
    background-repeat: no-repeat;
  }
  .opener.dropbox {
    background-position: 50%;
  }
  .imgbox {
    width: 150px;
    height: 150px;
    background: silver;
    border-right: 1px solid white;
    box-sizing: border-box;
    background-repeat: no-repeat;
    background-position: center;

    &.empty {
      background-image: url("/img/icons/camera.png");
      background-size: initial;
    }
  }
  .ui-popover {
    border: 1px solid silver;
    max-height: 200px;
    overflow: auto;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.3);
    .ui-dropdown--item {
      padding: 0 8px;
      cursor: pointer;
      &-inner {
        padding: 5px 0;
        border-bottom: 1px solid #ddd;
        text-align: left;
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &:last-child {
        .ui-dropdown--item-inner {
          border-bottom-color: transparent;
        }
      }
      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
