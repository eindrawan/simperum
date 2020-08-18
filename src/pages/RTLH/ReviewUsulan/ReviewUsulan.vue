<template>
  <Page title="Review Usulan" :sidebar="true">
    <Sidebar :value.sync="area" :hideTabs="true" />
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
        :disabled="true"
        height="calc(100vh - 230px)"
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
            name: '',
            value: 'VerStatsID',
            class: 'plain center'
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
        <template v-slot:row-Approval="{ row }">
          <v-btn
            v-if="row.IsComplete || row.IsApproved"
            text
            small
            color="success"
            @click="ApproveProposal(row)"
          >
            <v-icon left v-if="row.IsApproved">check_box</v-icon>
            <v-icon left v-if="!row.IsApproved"
              >mdi-checkbox-blank-outline</v-icon
            >
            SETUJUI
          </v-btn>
        </template>
      </Grid>
      <ValidasiDetail
        :show.sync="showDetailModal"
        :noRef="selectedRef"
        :area="area"
      />
      <ProposalDetail :nik="selectedNIK" :show.sync="showProposalModal" />
      <ChecklistProposal :nik="selectedNIK" :show.sync="showChecklistModal" />
    </div>
  </Page>
</template>
<script>
import Sidebar from "../InputUsulan/SideBar";
import DesaGlance from "../DesaGlance";
import ValidasiDetail from "../InputUsulan/ValidasiDetail";
import ProposalDetail from "../InputUsulan/ProposalDetail";
import ChecklistProposal from "./Checklist";

export default {
  components: {
    Sidebar,
    DesaGlance,
    ValidasiDetail,
    ProposalDetail,
    ChecklistProposal
  },
  data: () => ({
    datagrid: [],
    area: {},
    showDetailModal: false,
    showProposalModal: false,
    showChecklistModal: false,
    selectedRef: null,
    selectedNIK: null
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
    async ApproveProposal(row) {
      this.$api.call("PRM.SavProposalApproval", {
        ProposalDetID: "," + row.ProposalDetID + ",",
        IsApproved: row.IsApproved ? 0 : 1
      });
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
