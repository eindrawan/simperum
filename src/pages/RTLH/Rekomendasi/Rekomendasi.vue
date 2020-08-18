<template>
  <Page title="Rekomendasi" :sidebar="true">
    <template v-slot:toolbar>
      <v-icon @click="doPrint++" v-tooltip="'Download Excel'"
        >mdi-microsoft-excel</v-icon
      >
    </template>
    <Sidebar :value.sync="area" :rebind="rebindSidebar" :hideTabs="true" />
    <div style="padding:10px; width:100%;" v-show="area.Kelurahan">
      <DesaGlance
        :dbparams="area"
        :jmlUsulan="jmlUsulan"
        @clickTambahBaru="ClickTambahBaru"
      />
      <Grid
        :datagrid.sync="datagrid"
        :dbref="dbref"
        :dbparams="area"
        :filter="filterGrid"
        :autopaging="false"
        :disabled="true"
        :doPrint="doPrint"
        height="calc(100vh - 260px)"
        :columns="[
          {
            name: '',
            value: 'IsChecked',
            class: 'plain center'
          },
          {
            name: 'NIK',
            value: 'NIK',
            class: 'plain'
          },
          {
            name: 'Nama',
            value: 'KRT_Nama',
            width: '200px',
            class: 'fix-width'
          },
          {
            name: 'Alamat',
            value: 'Alamat',
            width: '250px',
            class: 'fix-width'
          },
          {
            name: 'Skor',
            value: 'ScoreTag'
          },
          {
            name: 'Prior',
            value: 'Prioritas'
          },
          {
            name: 'DT',
            value: 'TipeData'
          },
          {
            name: '',
            value: 'Dokumen',
            class: 'plain center'
          },
          {
            name: '',
            value: 'Checklist',
            class: 'plain center'
          },
          {
            name: '',
            value: 'Approval',
            class: 'plain center'
          }
        ]"
      >
        <template v-slot:row-IsChecked="{ row }">
          <Checkbox
            :value.sync="row.CheckedValue"
            checkedIcon="check_box"
            disabledIcon="mdi-lock"
            :disabled="Boolean(row.IsLocked)"
            @onClick="SubmitProposal(row.NIK, ...arguments)"
          />
        </template>
        <template v-slot:row-NIK="{ row }">
          <v-btn text small color="primary" @click="OpenDetail(row.NoRef)">
            {{ row.NIK || "&lt; kosong &gt;" }}
          </v-btn>
        </template>
        <template v-slot:row-TipeData="{ row }">
          {{ parseInt((row.TipeData + "").substr(-2)) + 2000 }}
        </template>
        <template v-slot:row-Dokumen="{ row }">
          <v-icon
            v-if="row.IsComplete"
            color="success"
            @click="OpenProposal(row.NIK)"
            >mdi-file-check</v-icon
          >
          <v-icon v-if="!row.IsComplete" @click="OpenProposal(row.NIK)"
            >mdi-file-alert-outline</v-icon
          >
        </template>
        <template v-slot:row-Checklist="{ row }">
          <v-icon v-if="row.IsComplete" @click="OpenChecklist(row.NIK)"
            >mdi-clipboard-list</v-icon
          >
        </template>
        <template v-slot:footer="{ columns }">
          <tr>
            <td
              :colspan="columns.length"
              style="text-align: center; padding: 5px;"
            >
              <v-btn
                color="success"
                v-if="!IsRekom && NoRefs.length > 2"
                @click="Rekom(1)"
                >REKOMENDASIKAN</v-btn
              >
              <v-btn v-if="IsRekom && NoRefs.length > 2" @click="Rekom(0)"
                >BATALKAN REKOM</v-btn
              >
            </td>
          </tr>
        </template>
      </Grid>
      <ValidasiDetail
        :show.sync="showDetailModal"
        :noRef="selectedRef"
        :area="area"
      />
      <ProposalDetail :nik="selectedNIK" :show.sync="showProposalModal" />
      <ChecklistRekom :nik="selectedNIK" :show.sync="showChecklistModal" />
    </div>
  </Page>
</template>
<script>
import Sidebar from "../InputUsulan/SideBar";
import DesaGlance from "../DesaGlance";
import ValidasiDetail from "../InputUsulan/ValidasiDetail";
import ProposalDetail from "../InputUsulan/ProposalDetail";
import ChecklistRekom from "./Checklist";

export default {
  components: {
    Sidebar,
    DesaGlance,
    ValidasiDetail,
    ProposalDetail,
    ChecklistRekom
  },
  data: () => ({
    datagrid: [],
    area: {},
    showDetailModal: false,
    showProposalModal: false,
    showChecklistModal: false,
    selectedRef: null,
    selectedNIK: null,
    doPrint: 0,
    rebindSidebar: 0,

    IsRekom: false,
    NoRefs: ","
  }),
  computed: {
    dbref() {
      if (this.area.tabId == 2) {
        return "PRM.ProposalDet";
      } else {
        return "PRM.ProposalBSPS";
      }
    },
    jmlUsulan() {
      return this.datagrid.filter(d => {
        return d.CheckedValue;
      }).length;
    }
  },
  watch: {
    showDetailModal(val) {
      if (!val) this.selectedRef = null;
    },
    datagrid(val) {
      this.IsRekom = false;
      this.NoRefs = ",";
      if (val && val.length) {
        val.forEach(v => {
          if (v.IsApproved == 2) this.IsRekom = true;
          if (v.IsApproved) this.NoRefs += v.NoRef + ",";
        });
      }
    }
  },
  methods: {
    ClickTambahBaru() {
      this.showDetailModal = true;
    },
    OpenDetail(noRef) {
      this.selectedRef = noRef;
      this.showDetailModal = true;
    },
    OpenProposal(nik) {
      this.selectedNIK = nik;
      this.showProposalModal = true;
    },
    OpenChecklist(nik) {
      this.selectedNIK = nik;
      this.showChecklistModal = true;
    },
    filterGrid(row) {
      return Boolean(row.IsApproved);
    },
    async Rekom(rekom) {
      let ret = await this.$api.call("PRM.SavProposalRekom", {
        ProposalID: this.area.ProposalID,
        IsApproved: rekom,
        NoDPA: this.NoRefs
      });
      // this.dbparams.isRekom = { ...this.dbparams, isRekom: rekom };
      if (ret.success) {
        this.rebindSidebar++;
        this.IsRekom = rekom;
      }
    }
  }
};
</script>
<style lang="scss">
.page-input-usulan {
  .ui-checkbox {
    .--box.checked {
      color: #1976d2;
    }
  }
}
</style>
