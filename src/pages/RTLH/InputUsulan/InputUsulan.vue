<template>
  <Page title="Input Usulan" :sidebar="true">
    <template v-slot:toolbar>
      <v-icon @click="doPrint++" v-tooltip="'Download Excel'"
        >mdi-microsoft-excel</v-icon
      >
    </template>
    <Sidebar :value.sync="area" />
    <div style="padding:10px; width:100%;" v-show="area.Kelurahan">
      <DesaGlance
        :dbparams="area"
        :jmlUsulan="jmlUsulan"
        :isApproved.sync="isApproved"
        @clickTambahBaru="ClickTambahBaru"
      />
      <Grid
        :datagrid.sync="datagrid"
        :dbref="dbref"
        :dbparams="area"
        :disabled="true"
        height="calc(100vh - 230px)"
        :doPrint="doPrint"
        :columns="[
          {
            name: '',
            value: 'IsChecked',
            class: 'plain center'
          },
          {
            name: 'NIK',
            value: 'NIK',
            class: 'plain',
            filter: {
              type: 'search'
            }
          },
          {
            name: '',
            value: 'VerStatsID',
            class: 'plain center'
          },
          {
            name: 'Nama',
            value: 'KRT_Nama',
            width: '200px',
            class: 'fix-width',
            filter: {
              type: 'search',
              value: 'Nama'
            }
          },
          {
            name: 'Alamat',
            value: 'Alamat',
            width: '250px',
            class: 'fix-width',
            filter: {
              type: 'search'
            }
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
            class: area.tabId == 2 ? '' : 'hide'
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
        <template v-slot:row-VerStatsID="{ row }">
          <v-icon
            v-if="row.VerStatsID >= 6"
            color="primary"
            v-tooltip="'Sudah Terverifikasi'"
            >mdi-account-check</v-icon
          >
          <v-icon v-if="row.VerStatsID < 6" v-tooltip="'Belum Terverifikasi'"
            >mdi-account-question-outline</v-icon
          >
        </template>
        <template v-slot:row-TipeData="{ row }">
          {{ parseInt((row.TipeData + "").substr(-2)) + 2000 }}
        </template>
        <template v-slot:row-Dokumen="{ row }">
          <v-icon
            v-if="row.IsComplete"
            color="success"
            v-tooltip="'Proposal Sudah Lengkap'"
            @click="OpenProposal(row.NIK)"
            >mdi-file-check</v-icon
          >
          <v-icon
            v-if="!row.IsComplete"
            @click="OpenProposal(row.NIK)"
            v-tooltip="'Proposal Belum Lengkap'"
            >mdi-file-alert-outline</v-icon
          >
        </template>
        <template v-slot:footer="{ columns }">
          <td :colspan="columns.length" v-if="area.ProposalID > 7">
            <div style="text-align: center; padding: 12px;">
              Akan masuk halaman usulan juka sudah
              <a href="/Main/RTLH/PBDT_edit/">tervalidasi</a> lengkap
            </div>
          </td>
        </template>
      </Grid>
      <ValidasiDetail
        :show.sync="showDetailModal"
        :noRef="selectedRef"
        :area="area"
      />
      <ProposalDetail :show.sync="showProposalModal" :nik="selectedNIK" />
    </div>
  </Page>
</template>
<script>
import Sidebar from "./SideBar";
import DesaGlance from "../DesaGlance";
import ValidasiDetail from "./ValidasiDetail";
import ProposalDetail from "./ProposalDetail";

export default {
  components: {
    Sidebar,
    DesaGlance,
    ValidasiDetail,
    ProposalDetail
  },
  data: () => ({
    datagrid: [],
    area: {},
    showDetailModal: false,
    showProposalModal: false,
    selectedRef: null,
    doPrint: 0,
    selectedNIK: null,
    isApproved: null
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
    isApproved(val) {
      this.area = { ...this.area, isApproved: val };
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
    async SubmitProposal(nik, checked, callback) {
      var ret = await this.$api.call("PRM.SavProposalDetByNIK", {
        ProposalID: this.area.ProposalID,
        NIK: nik,
        IsAdd: checked,
        Sumber: this.area.tabId
      });
      if (!ret.Success) {
        callback(false);
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
