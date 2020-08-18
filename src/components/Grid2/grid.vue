<template>
  <div class="grid" v-click-outside="handleClickOutside">
    <header>
      <slot name="header"></slot>
    </header>
    <content ref="content">
      <v-row
        v-for="(item, index) in datagrid"
        :key="index"
        :idx="index"
        @click="handleEdit"
        @contextmenu="handleContextMenu(index, $event)"
      >
        <slot
          name="content"
          :edit="handleEdit"
          :item="item"
          :index="index"
        ></slot>
      </v-row>
      <v-row ref="insertRow" :key="renderInsertRow" class="insertRow">
        <slot name="insert" :item="selectedItem"></slot>
      </v-row>
    </content>
    <footer>
      <slot name="footer">
        <v-row>
          <v-btn text dense class="small-note" @click="handleAddRow"
            >Tambah Baru</v-btn
          >
        </v-row>
      </slot>
    </footer>
    <v-menu
      class="contextmenu"
      v-model="contextMenu.show"
      :position-x="contextMenu.x"
      :position-y="contextMenu.y"
      absolute
      offset-y
    >
      <v-list class="contextmenu">
        <v-list-item
          v-for="item in contextMenu.items"
          :key="item.text"
          @click="handleContextMenuClick(item.text)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
//import Vue from "vue";
//import row from "./row";
export default {
  name: "Grid",
  components: {
    //row
  },
  data: () => {
    return {
      keyInsertRow: 1,
      contextMenu: {
        show: false,
        x: 0,
        y: 0,
        selectedRow: null,
        items: [
          { icon: "edit", text: "Edit" },
          { icon: "close", text: "Remove" }
        ]
      },
      selectedItem: {}
    };
  },
  props: {
    datagrid: {
      type: Array,
      default: () => []
    },
    dbref: String,
    dbparams: Object,
    height: String
  },
  computed: {
    renderInsertRow() {
      return "ir-" + this.keyInsertRow;
    },
    gridStyle() {
      if (!this.height) return "";
      else return `height: ${this.height}`;
    }
  },
  watch: {
    dbparams() {
      this.dbRebind();
    }
  },
  mounted() {
    this.$refs.insertRow.style.display = "none";
    this.$on("sort", this.handleSort);
    this.dbRebind();
  },
  methods: {
    handleAddRow() {
      this.removeEdit();
      this.datagrid.push({});
      this.$nextTick(() => {
        this.contextMenu.selectedRow = this.$refs.content.lastChild.previousSibling;
        this.handleEdit();
      });
    },
    handleEdit(event) {
      if (this.$refs.selectedRow) {
        var idx = parseInt(this.$refs.selectedRow.getAttribute("idx"));
        this.$emit("dataUpdate", idx, this.selectedItem);
        // this.datagrid[idx] = this.selectedItem;
        this.$refs.selectedRow.style.display = "flex";
      }
      if (event) this.$refs.selectedRow = event.target.closest("div.row");
      else this.$refs.selectedRow = this.contextMenu.selectedRow;
      this.$refs.content.insertBefore(
        this.$refs.insertRow,
        this.$refs.selectedRow
      );
      this.$refs.selectedRow.style.display = "none";
      this.$refs.insertRow.style.display = "flex";
      this.selectedRowIndex = parseInt(
        this.$refs.selectedRow.getAttribute("idx")
      );
      this.selectedItem = this.datagrid[this.selectedRowIndex];
      this.keyInsertRow++;
    },
    removeEdit() {
      if (this.$refs.selectedRow) {
        var idx = parseInt(this.$refs.selectedRow.getAttribute("idx"));
        this.$emit("dataUpdate", idx, this.selectedItem);
        // this.datagrid[idx] = this.selectedItem;
        this.$refs.selectedRow.style.display = "flex";
        this.$refs.selectedRow = null;
      }
      this.selectedItem = {};
      this.$refs.content.appendChild(this.$refs.insertRow);
      this.keyInsertRow++;
      this.$nextTick(() => {
        this.$refs.insertRow.style.display = "none";
      });
    },
    handleDelete(idx) {
      // this.datagrid.splice(idx, 1);
      this.$emit("dataDelete", idx, this.datagrid[idx]);
    },
    async dbRebind() {
      if (!this.dbref) return;
      // let sp = this.dbref.substr(4).toLowerCase();
      let sp = this.dbref.replace(/\./, "_Sel");
      let { data } = await this.$api.call(sp, this.dbparams);
      this.$emit("update:datagrid", data);
    },
    async dbSave(idx, data) {
      if (!this.dbref) return;
      let sp = this.dbref.replace(/\./, "_Sav");
      let ret = await this.$api.call(sp, data);
      if (!ret.success) this.dbRebind();
    },
    async dbDelete(idx, data) {
      if (!this.dbref) return;
      let sp = this.dbref.replace(/\./, "_Del");
      let ret = await this.$api.call(sp, data);
      // if (!ret.success) this.dbRebind();
      if (ret.success) this.datagrid.splice(idx, 1);
    },
    handleContextMenu(idx, evt) {
      this.contextMenu.selectedRow = evt.target.parentNode;
      evt.preventDefault();
      this.contextMenu.show = false;
      this.contextMenu.x = evt.clientX;
      this.contextMenu.y = evt.clientY;
      this.$nextTick(() => {
        this.contextMenu.show = true;
      });
    },
    handleContextMenuClick(text) {
      if (text === "Edit") {
        this.handleEdit();
      } else if (text == "Remove") {
        var idx = parseInt(this.contextMenu.selectedRow.getAttribute("idx"));
        this.handleDelete(idx);
      }
    },
    handleClickOutside(evt) {
      let pos = this.$refs.content.getBoundingClientRect();
      if (
        evt.clientX < pos.x ||
        evt.clientX > pos.x + pos.width ||
        evt.clientY < pos.y ||
        evt.clientY > pos.y + pos.height
      ) {
        this.removeEdit();
      }
    },
    handleSort() {
      alert("Sort");
    }
  }
};
</script>
<style lang="scss">
.grid {
  font-size: 14px;
  padding-left: 12px;
  padding-right: 12px;
  display: inline-block;
  overflow: auto;

  header {
    position: sticky;
    top: 0;

    div.row {
      div.col {
        background-color: #333;
        color: white;
        & > span {
          cursor: pointer;
        }
      }
    }
  }
  content {
    display: block !important;
  }
  footer {
    .small-note {
      font-size: small;
      letter-spacing: normal;
      color: gray;
    }
  }
  div.row {
    display: flex;
    border-bottom: 1px solid silver;

    div.col[xs] {
      width: 60px;
    }
    div.col[sm] {
      width: 120px;
    }
    div.col[med],
    div.col.col-md {
      width: 200px;
    }
    div.col[lg] {
      width: 300px;
    }
    div.col[center] {
      text-align: center;
    }

    div.col {
      padding: 5px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      line-height: 31px;
      width: 120px;
      flex-basis: auto;

      &:first-child {
        padding-left: 20px;
      }

      .v-text-field {
        padding-top: 0;
        margin-top: 0;
        &:hover,
        &:focus {
          background-color: #f3f3f3;
        }
        input {
          font-size: 14px;
        }
      }
      .v-input {
        font-size: 14px;
      }
      .v-input--selection-controls {
        padding-top: 4px;
        margin-top: 0;
        &.no-label {
          width: 24px;
          display: inline-block;
        }
        .v-messages {
          display: none;
        }
      }
      .v-input__slot {
        margin-bottom: 0;
      }
      .v-text-field__details {
        display: none;
      }
    }

    &.insertRow {
      .col {
        padding-bottom: 1px !important;
      }
    }
  }
}
</style>
