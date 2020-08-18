<template>
  <div
    class="ui-table"
    v-click-outside="handleClickOutside"
    :style="{
      height: height
    }"
  >
    <slot name="pre-head" :allfilters="allfilters"></slot>
    <table :id="id">
      <colgroup>
        <col v-for="(item, idx) in columns" :key="idx" :width="item.width" />
      </colgroup>
      <thead>
        <tr class="--header">
          <th v-for="(item, idx) in columns" :key="idx">
            <div style="display:flex;">
              <div style="flex:1">{{ item.name }}</div>
              <v-icon
                :id="`icon_col_${item.value}`"
                right
                v-if="item.filter && item.filter.type == 'search'"
                v-tooltip="
                  `Filter: ${filters[item.filter.value || item.value] || '-'}`
                "
                :color="
                  filters[item.filter.value || item.value] ? 'warning' : '#ccc'
                "
                >search</v-icon
              >
              <v-icon
                :id="`icon_col_${item.value}`"
                right
                v-if="item.filter && item.filter.type == 'select'"
                v-tooltip="
                  `Filter: ${filters[item.filter.text] ||
                    filters[item.filter.value || item.value] ||
                    '-'}`
                "
                :color="
                  filters[item.filter.value || item.value] ? 'warning' : '#ccc'
                "
                >mdi-filter-menu</v-icon
              >
            </div>
            <Popover
              v-if="item.filter"
              :targetId="`icon_col_${item.value}`"
              on="click"
            >
              <Input
                v-if="item.filter.type == 'search'"
                icon-right="search"
                :placeholder="`Cari ${item.name} ..`"
                :value="filters[item.filter.value || item.value]"
                @change="filterSearch($event, item.filter.value || item.value)"
              />
              <Select
                v-if="item.filter.type == 'select'"
                :dbref="item.filter.dbref"
                :dbparams="
                  typeof item.filter.dbparams == 'function'
                    ? item.filter.dbparams(filters)
                    : item.filter.dbparams
                "
                :value="filters[item.filter.value || item.text]"
                :text="filters[item.filter.text || item.text]"
                @change="
                  filterSelect(
                    $event,
                    item.filter.value || item.value,
                    item.filter.text,
                    ...arguments
                  )
                "
              />
              <v-btn
                text
                dense
                color="primary"
                style="font-size: 10px;
                  height: 16px;
                  margin-top: -6px;
                  width: 100%;"
                @click="
                  filterClear(item.filter.value || item.value, item.filter.text)
                "
                >Hapus Filter</v-btn
              >
            </Popover>
          </th>
          <th v-if="!disabled"></th>
        </tr>
      </thead>
      <tbody v-show="!loading">
        <tr
          v-for="(row, idx) in datagrid"
          :key="idx"
          :idx="idx"
          v-show="!filter || filter(row) === true"
          @dblclick="handleRowDblClick($event)"
          @click="handleRowClick($event)"
        >
          <td v-for="(col, idxcol) in columns" :key="idxcol" :class="col.class">
            <slot :name="'row-' + col.value" :row="row">
              <div
                v-if="col.editable && col.editable.com.name == 'Checkbox'"
                style="text-align:center"
              >
                <v-icon>
                  {{
                    row[col.value] ? "mdi-check-box-outline" : "mdi-crop-square"
                  }}
                </v-icon>
              </div>
              <div
                v-if="
                  col.editable &&
                    col.editable.com == 'Input' &&
                    col.editable.type == 'password'
                "
              >
                * * * * *
              </div>
              <div
                v-else
                :class="col.class"
                :style="{
                  width: col.width
                }"
              >
                {{ row[col.value] }}
              </div>
            </slot>
          </td>
          <td v-if="!disabled">
            <v-icon color="red" @click="DeleteRow(idx)">mdi-trash-can</v-icon>
          </td>
        </tr>
        <tr class="edit-row hide" v-if="renderEditRow">
          <slot name="row-edit">
            <td v-for="(col, idxcol) in columns" :key="idxcol">
              <div style="text-align:center; width:100%;">
                <component
                  v-if="col.editable"
                  :is="col.editable.com"
                  v-bind="col.editable"
                  :dbparams="
                    typeof col.editable.dbparams == 'function'
                      ? col.editable.dbparams(editedData)
                      : col.editable.dbparams
                  "
                  :value.sync="editedData[col.editable.value || col.value]"
                  :text.sync="editedData[col.editable.text]"
                ></component>
              </div>
            </td>
            <td class="center">
              <v-icon color="primary" @click="SaveRow">mdi-content-save</v-icon>
            </td>
          </slot>
        </tr>
        <tr class="load-more" v-if="autopaging && showPaging">
          <td
            :colspan="columns.length"
            style="text-align:center"
            v-show="!loading && !loadingMore && datagrid.length >= 50"
          >
            <v-btn text small @click="handleLoadMore"
              >Load More <v-icon right>refresh</v-icon></v-btn
            >
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr v-show="loading || loadingMore">
          <td
            :colspan="columns.length"
            style="text-align:center; padding:13px;"
          >
            <v-icon right>access_time</v-icon> Loading ...
          </td>
        </tr>
        <tr class="load-again">
          <td
            :colspan="columns.length + (disabled ? 0 : 1)"
            style="text-align:center;"
            v-show="isError"
          >
            <div>
              Error while loading!
            </div>
            <v-btn text small @click="dbRebind"
              >Reload <v-icon right>refresh</v-icon></v-btn
            >
          </td>
        </tr>
        <tr class="add-new" v-if="editable">
          <td :colspan="columns.length + 1">
            <v-btn text small @click="handleAddNew" v-show="!edited"
              ><v-icon left>mdi-plus-circle</v-icon> Tambah Baru</v-btn
            >
            <v-btn text small @click="removeEdit" v-show="edited"
              ><v-icon left>mdi-undo-variant</v-icon> Batalkan</v-btn
            >
          </td>
        </tr>
        <slot name="footer" :columns="columns"> </slot>
      </tfoot>
    </table>
    <ReportViewer
      v-if="doPrint"
      filetype="xlsx"
      :options="reportOptions"
      :show.sync="showReport"
    />
  </div>
</template>
<script>
import Popover from "@/components/Forms/Popover";
import ReportViewer from "@/components/ReportViewer";
export default {
  components: {
    Popover,
    ReportViewer
  },
  data: () => ({
    id: null,
    $table: null,
    $selected: null,
    edited: null,
    $editRow: null,
    editedData: {},

    loading: false,
    loadingMore: false,
    isError: false,
    forceRender: 0,
    selectedIndex: null,
    filters: {},
    showReport: false,
    showPaging: true,
    reportOptions: {},

    pageRef: 0
  }),
  props: {
    datagrid: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    filter: Function,
    disabled: Boolean,
    dbref: String,
    dbparams: Object,
    height: String,
    autopaging: {
      type: Boolean,
      default: true
    },
    preHead: {
      type: Boolean,
      default: false
    },
    doPrint: {
      type: Number,
      default: 0
    }
  },
  computed: {
    editable() {
      return !this.disabled;
    },
    renderEditRow() {
      return "er-" + this.forceRender;
    },
    allfilters() {
      return { ...this.dbparams, ...this.filters };
    }
    // editedData() {
    //   this.$editData = this.datagrid[this.selectedIndex]
    //     ? { ...this.datagrid[this.selectedIndex] }
    //     : {};
    //   return this.$editData;
    // }
  },
  watch: {
    dbparams() {
      this.pageRef = 0;
      this.showPaging = true;
      this.dbRebind();
    },
    async doPrint() {
      let cols = this.columns.map(c => {
        return c.value;
      });
      // if has client side filter just print the grid
      if (this.filter) {
        let data = this.datagrid
          .filter(d => {
            return this.filter(d);
          })
          .map(d => {
            let r = [];
            for (let i = 0; i < cols.length; i++) {
              r.push(d[cols[i]]);
            }
            return r;
          });
        this.reportOptions = {
          headers: this.columns.map((h, idx) => {
            return { ...h, name: h.name ? h.name : "c" + idx };
          }),
          data: data
        };
        // else print all in the table
      } else {
        this.reportOptions = {
          sp: this.dbref.replace(/\./, "_Sel"),
          ...this.dbparams,
          ...this.filters,
          headers: this.columns.map((h, idx) => {
            return { ...h, name: h.name ? h.name : "c" + idx };
          }),
          cols: cols,
          PageRef: 0,
          CountRef: 50000000
        };
      }
      this.showReport = true;
    }
  },
  created() {
    if (!window.uuid) window.uuid = 0;
    this.id = "tbl-" + window.uuid++;
  },
  mounted() {
    // this.$refs.insertRow.style.display = "none";
    // this.$on("sort", this.handleSort);
    this.pageRef = 0;
    this.showPaging = true;
    this.dbRebind();
  },
  methods: {
    async dbRebind() {
      if (!this.dbref) return;
      let sp = this.dbref.replace(/\./, "_Sel");

      this.loading = true;
      this.isError = false;

      let { data } = await this.$api
        .call(sp, { ...this.dbparams, ...this.filters, PageRef: this.pageRef })
        .catch(err => {
          console.log(err);
          this.loading = false;
          this.isError = true;
        });

      setTimeout(
        function() {
          if (!this.$table && document.getElementById(this.id)) {
            this.$table = document.getElementById(this.id);
            let cols = this.$table.querySelectorAll("th");
            cols.forEach(c => {
              c.width = Math.ceil(c.getBoundingClientRect().width) + "px";
            });
          }
        }.bind(this),
        500
      );

      this.$emit("update:datagrid", data);
      this.loading = false;
    },
    handleRowDblClick(evt) {
      if (this.disabled) return;
      if (!this.$editRow)
        this.$editRow = evt.target.closest("table").querySelector(".edit-row");
      let $row = evt.target.closest("tr");
      $row.parentNode.insertBefore(this.$editRow, $row);
      $row.classList.add("hide");
      this.$editRow.classList.remove("hide");
      this.edited = $row;
      this.$selected = $row;

      this.selectedIndex = parseInt($row.getAttribute("idx"));
      this.editedData = this.datagrid[this.selectedIndex]
        ? { ...this.datagrid[this.selectedIndex] }
        : {};
      this.forceRender++;
    },
    handleRowClick(evt) {
      if (this.edited) this.removeEdit();
      this.$selected = evt.target.closest("tr");
    },
    async SaveRow() {
      let sp = this.dbref.replace(/\./, "_Sav");
      let ret = await this.$api.call(sp, this.editedData);
      if (ret.success) {
        for (let key in this.editedData) {
          this.datagrid[this.selectedIndex][key] = this.editedData[key];
        }
        this.removeEdit();
      }
    },
    async DeleteRow(idx) {
      let sp = this.dbref.replace(/\./, "_Del");
      let ret = await this.$api.call(sp, this.datagrid[idx]);
      if (ret.success) {
        this.datagrid.splice(idx, 1);
      }
    },
    removeEdit() {
      this.edited.classList.remove("hide");
      this.$editRow.classList.add("hide");
      this.edited = null;
    },
    handleAddNew(evt) {
      for (let key in this.editedData) {
        this.editedData[key] = null;
      }
      if (!this.$editRow)
        this.$editRow = evt.target.closest("table").querySelector(".edit-row");
      this.edited = this.$editRow;
      this.$table.querySelector("tbody").appendChild(this.$editRow);
      this.$editRow.classList.remove("hide");
    },
    async handleLoadMore() {
      this.loadingMore = true;
      this.pageRef++;
      let sp = this.dbref.replace(/\./, "_Sel");
      let { data } = await this.$api
        .call(sp, { ...this.dbparams, PageRef: this.pageRef })
        .catch(err => {
          console.log(err);
          this.loading = false;
          this.isError = true;
        });
      if (!data.length || data.length < 50) this.showPaging = false;
      this.$emit("update:datagrid", this.datagrid.concat(data));
      this.loadingMore = false;
    },
    handleClickOutside(evt) {
      if (!this.$table) return;

      let pos = this.$table.getBoundingClientRect();
      if (
        evt.clientX < pos.x ||
        evt.clientX > pos.x + pos.width ||
        evt.clientY < pos.y ||
        evt.clientY > pos.y + pos.height
      ) {
        this.removeEdit();
      }
    },
    filterSearch(evt, key) {
      this.filters[key] = evt.target.value;
      this.pageRef = 0;
      this.showPaging = true;
      this.$emit("filterChange", this.filters);
      this.dbRebind();
    },
    filterSelect(evt, key, textKey, value, text) {
      this.filters[key] = value;
      this.filters[textKey] = text;
      this.pageRef = 0;
      this.showPaging = true;

      this.$emit("filterChange", this.filters);
      this.dbRebind();
    },
    filterClear(key, textKey) {
      if (this.filters[key] || this.filters[textKey]) {
        if (this.filters[key]) {
          this.filters[key] = "";
        }
        if (this.filters[textKey]) {
          this.filters[textKey] = "";
        }
        this.pageRef = 0;
        this.showPaging = true;
        this.$emit("filterChange", this.filters);
        this.dbRebind();
      }
    }
  }
};
</script>
<style lang="scss">
.ui-table {
  display: inline-block;
  border-bottom: 1px solid silver;
  overflow-y: auto;
  overflow-x: hidden;

  .pre-head {
    font-size: 14px;
  }

  table {
    border-collapse: collapse;
    font-size: 14px;
    table-layout: fixed;
    background: white;

    thead {
      th {
        text-align: left;
        position: sticky;
        top: 0;
        z-index: 1;
        font-weight: normal;

        .ui-popover {
          left: 0px;
          margin-top: 10px;
          padding: 10px;
          background: #f3f3f3;
          padding-bottom: 2px;
          box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
          font-weight: normal;
        }
        .v-icon {
          cursor: pointer;
        }
      }
      .--header {
        th {
          background: #333;
          color: #ddd;
          font-weight: bold;
          padding: 8px 12px;
        }
      }
    }
    tbody {
      tr {
        border-bottom: 1px solid #ddd;
        td {
          padding: 8px 12px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          .form-coms {
            margin-bottom: 0;
            width: 100%;
          }

          .ui-checkbox {
            display: inline-block;
            width: auto;
            margin-top: 5px;
          }

          [center] .ui-checkbox .--base {
            display: inline-block;
          }

          &.plain {
            padding: 0;
          }
          &.center {
            text-align: center;
          }
          &.fix-width {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        &.edit-row {
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
          td {
            padding: 6px 6px;

            .--input,
            .ui-dropdown--button {
              width: 100% !important;
              font-size: 12px !important;

              button {
                font-size: 12px !important;
              }
            }
          }
        }
      }
    }
    tfoot {
      .add-new {
        td {
          padding: 4px 0;
          background: white;
          position: sticky;
          bottom: 0;
        }
      }
    }
  }
  .hide {
    display: none !important;
  }
}
.dense .ui-table,
.ui-table.dense {
  table {
    font-size: 12px;
    .v-icon {
      font-size: 18px;
    }
  }
}
</style>
