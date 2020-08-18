<template>
  <div class="form-coms ui-dropdown">
    <div class="form-label" v-if="$attrs.label">{{ $attrs.label }}</div>
    <div
      class="ui-dropdown--button"
      :class="{
        '--empty': value === null || value === undefined
      }"
      :style="{
        width: width
      }"
    >
      <div class="--wraper">
        <button :id="id">{{ text }}</button>
        <v-icon class="ui-arrow-icon" :class="{ '--open': isOpen }">
          expand_more
        </v-icon>
      </div>
      <Popover
        :targetId="id"
        on="click"
        @onShow="handlePopoverShow"
        @onHide="handlePopoverHide"
      >
        <template>
          <div
            v-for="(item, idx) in opts"
            :key="idx"
            class="ui-dropdown--item popover-close"
            @click="handleItemClick(item)"
          >
            <div class="ui-dropdown--item-inner">
              {{ item[_textKey] }}
            </div>
          </div>
        </template>
      </Popover>
    </div>
  </div>
</template>

<script>
import Popover from "@/components/Forms/Popover";

export default {
  name: "Select",
  components: {
    Popover
  },
  data: () => ({
    options: [],
    text: "-",
    isOpen: false,
    id: "ddl",
    selectedData: null,
    oldDbparams: null
  }),
  props: {
    value: [String, Number, Object],
    dbref: String,
    dbparams: {
      type: Object,
      default: () => ({})
    },
    items: Array,
    placeholder: Array,
    valueKey: String,
    textKey: String,
    width: {
      type: String,
      default: "180px"
    },
    valueAsObject: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    opts() {
      return this.items || this.options;
    },
    _valueKey() {
      return this.valueKey || Object.keys(this.opts[0])[0];
    },
    _textKey() {
      return this.textKey || Object.keys(this.opts[0])[1];
    }
  },
  watch: {
    value(val) {
      this.setText(val);
    },
    dbparams(val) {
      if (this.oldDbparams != JSON.stringify(val)) this.populate();
      this.oldDbparams = JSON.stringify(val);
    }
  },
  async created() {
    if (!window.uuid) window.uuid = 0;
    this.id = "ddl-" + window.uuid++;
    if (this.dbref) {
      this.populate();
    } else {
      this.setText(this.value);
    }
  },
  methods: {
    async populate() {
      let opts = await this.$api.call(this.dbref, this.dbparams);
      if (opts.data.length) {
        this.options = opts.data;
        if (opts.data.length == 1) {
          // autoselect
          this.$emit("update:value", opts.data[0][this._valueKey]);
        }
        let val = this.value;
        this.setText(val);
      }
    },
    setText(val) {
      if (val !== null && val !== undefined) {
        let v = null;
        let k = "_";
        if (typeof val == "string" || typeof val == "number") v = val;
        else if (typeof val == "object" && Object.keys(val).length == 1) {
          k = Object.keys(val)[0];
          v = val[k];
        } else {
          return;
        }

        this.opts.some(e => {
          if (e[this._valueKey] == v || e[k] == v) {
            this.text = e[this._textKey];
            this.$emit("update:text", this.text);
            if (this.valueAsObject) this.$emit("update:value", e);
            return true;
          }
          return false;
        });
      } else {
        this.text = this.placeholder || "-";
      }
    },
    handleItemClick(item) {
      this.text = item[this._textKey];
      if (this.valueAsObject) this.$emit("update:value", item);
      else this.$emit("update:value", item[this._valueKey]);
      this.$emit("change", item[this._valueKey], this.text);
    },
    handlePopoverShow($popover) {
      this.isOpen = true;
      let $this = document.getElementById(this.id);
      $popover.style.minWidth = $this.offsetWidth + "px";
    },
    handlePopoverHide() {
      this.isOpen = false;
    }
  }
};
</script>
<style lang="scss">
.ui-dropdown {
  margin-bottom: 8px;
  color: #333;

  &--button {
    /*position: relative;*/
    height: 27px;

    &.--empty {
      button {
        color: gray;
      }
    }

    .--wraper {
      position: relative;
      button {
        padding: 4px 5px;
        border: 0;
        background: rgba(200, 200, 200, 0.2);
        border-bottom: 1px solid silver;
        font-size: 14px;
        border-radius: 0;
        text-align: left;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        padding-right: 20px;

        &:hover,
        &:focus {
          border: 0;
          background: rgba(200, 200, 200, 0.4);
          border-bottom: 1px solid gray;
        }
      }
      .ui-arrow-icon {
        position: absolute;
        right: 0px;
        top: calc(7% + 0.5px);
        &.--open {
          transform: rotate(180deg);
        }
      }
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

.dense {
  .ui-dropdown {
    .ui-dropdown--button button {
      font-size: 14px;
    }
    .ui-popover {
      .ui-dropdown--item {
        &-inner {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
