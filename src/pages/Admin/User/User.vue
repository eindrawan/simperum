<template>
  <Page title="Data Pengguna">
    <Grid
      :datagrid.sync="users"
      dbref="Arch.User"
      style="height:calc(100vh - 120px)"
      class="dense"
      :columns="[
        {
          name: 'Username',
          value: 'Username',
          width: '120px',
          editable: {
            com: 'Input'
          }
        },
        {
          name: 'Password',
          value: 'Password',
          width: '120px',
          editable: {
            com: 'Input',
            type: 'password'
          }
        },
        {
          name: 'Nama Lengkap',
          value: 'FullName',
          width: '180px',
          editable: {
            com: 'Input'
          }
        },
        {
          name: 'Aktif ?',
          value: 'IsActive',
          width: '70px',
          editable: {
            com: 'Checkbox'
          }
        },
        {
          name: 'Role',
          class: 'plain',
          value: 'RolePositionName',
          editable: {
            com: 'Select',
            value: 'RolePositionID',
            text: 'RolePositionName',
            dbref: 'Arch.SelRolePosition'
          }
        }
      ]"
    >
      <template v-slot:row-IsActive="{ row }">
        <div center>
          <v-icon>
            {{ row.IsActive ? "mdi-check-box-outline" : "mdi-crop-square" }}
          </v-icon>
        </div>
      </template>
      <template v-slot:row-RolePositionID="{ row }">
        <v-btn
          text
          small
          color="primary"
          @click="ShowRoleAccess(row.RolePositionID)"
        >
          {{ row.RolePositionName }}
        </v-btn>
      </template>
    </Grid>
    <Modal
      id="modal-role-access"
      :show.sync="roleAccess"
      title="ROLE ACCESS"
      width="350px"
      @onSubmit="SubmitRoleAccess"
    >
      <RoleAccessPage :roleId="roleId" :page-data.sync="roleAccessData" />
    </Modal>
  </Page>
</template>
<script>
import RoleAccessPage from "./RoleAccess";

export default {
  components: {
    RoleAccessPage
  },
  data: () => ({
    roleAccess: false,
    roleAccessData: [],
    roleId: null,
    users: null,
    forms: {}
  }),
  async mounted() {},
  methods: {
    ShowRoleAccess(roleId) {
      this.roleAccess = true;
      this.roleId = roleId;
    },
    SubmitRoleAccess() {
      this.$api.call("Arch.SavRoleAccess", {
        RolePositionID: this.roleId,
        XmlRoleAccess: this.roleAccessData
      });
    }
  }
};
</script>
<style lang="scss">
#modal-role-access {
  .ui-table {
    height: 500px !important;
  }
}
</style>
