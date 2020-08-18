<template>
  <div class="form-coms ui-search">
    <div class="form-label" v-if="$attrs.label">{{ $attrs.label }}</div>
    <div :id="id" class="--search">
      <input
        type="text"
        v-bind="$attrs"
        v-model="text"
        :style="{ width: width }"
        @keyup="Search"
      />
      <v-icon class="ui-search-icon" v-show="!text">search</v-icon>
      <v-icon class="ui-clear-icon" v-show="text" @click="text = ''"
        >clear</v-icon
      >
      <Popover :targetId="id" :show="showPopover">
        <template>
          <div
            v-for="(item, idx) in options"
            :key="idx"
            class="ui-search--item popover-close"
            @click="handleItemClick(item)"
          >
            <slot>
              <div class="ui-search--item-inner">
                {{ item[_textKey] }}
              </div>
            </slot>
          </div>
        </template>
      </Popover>
    </div>
  </div>
</template>

<script>
import Popover from "./Popover";
export default {
  components: {
    Popover
  },
  name: "Input",
  data: () => ({
    options: [],
    id: null,
    val: "",
    text: "",
    timeRef: null,
    showPopover: false
  }),
  props: {
    value: [String, Number, Object],
    width: String,
    valueKey: String,
    textKey: String,
    dataKey: String,
    dbref: [String, Object],
    valueAsObject: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    _valueKey() {
      return this.valueKey || Object.keys(this.options[0])[0];
    },
    _textKey() {
      return this.textKey || Object.keys(this.options[0])[1];
    }
  },
  watch: {
    value(val) {
      this.val = val;
    }
  },
  async created() {
    if (!window.uuid) window.uuid = 0;
    this.id = "search-" + window.uuid++;
    // if (this.dbref) {
    //   let opts = await this.$api.call(this.dbref, {});
    //   if (opts.data.length) {
    //     this.options = opts.data;
    //   }
    // }
  },
  methods: {
    Search() {
      if (this.timeRef) clearTimeout(this.timeRef);
      this.timeRef = setTimeout(
        async function() {
          let ret = [];
          if (typeof this.dbref == "object") {
            var opts = { ...this.dbref };
            if (typeof opts.url == "function") opts.url = opts.url(this.text);
            ret = await this.$api.fromOutside(opts);
            this.options = opts.parseData(ret);
            this.showPopover = true;
          }
        }.bind(this),
        800
      );
    },
    handleItemClick(item) {
      this.text = item[this._textKey];
      if (this.valueAsObject) this.$emit("update:value", item);
      else this.$emit("update:value", item[this._valueKey]);
      this.showPopover = false;
    }
  }
};
</script>
<style lang="scss">
.ui-search {
  margin-bottom: 8px;

  .form-label {
    text-align: left;
    font-size: 14px;
  }
  .--search {
    input {
      padding: 3px 5px;
      background: rgba(200, 200, 200, 0.2);
      font-size: 14px;
      border-radius: 2px;
      width: 180px;
      border-bottom: 1px solid silver;
      padding-right: 35px;

      &:hover,
      &:focus {
        border: 0;
        background: rgba(200, 200, 200, 0.4);
        border-bottom: 1px solid gray;
      }
    }
    .ui-search-icon,
    .ui-clear-icon {
      position: relative;
      left: -30px;
    }
    .ui-clear-icon {
      color: silver;
    }
    .ui-popover {
      border: 1px solid silver;
      max-height: 200px;
      overflow: auto;
      .ui-search--item {
        padding: 0 8px;
        cursor: pointer;
        &-inner {
          padding: 5px 0;
          border-bottom: 1px solid #ddd;
          text-align: left;
          font-size: 12px;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 350px;
          overflow: hidden;
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
}
</style>
