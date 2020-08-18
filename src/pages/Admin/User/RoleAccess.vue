<template>
  <Page title="Role Access">
    <Grid
      :datagrid.sync="roles"
      dbref="Arch.RoleAccess"
      :dbparams="dbparams"
      :disabled="true"
      style="height:calc(100vh - 230px)"
      class="dense"
      :columns="[
        {
          name: 'Menu',
          value: 'MenuName'
        },
        {
          name: 'Access',
          value: 'AllowAccess'
        }
      ]"
    >
      <template v-slot:row-MenuName="{ row }">
        <div :class="'menu-' + row.MenuID.length">
          {{ row.MenuName }}
        </div>
      </template>
      <template v-slot:row-AllowAccess="{ row }">
        <div center>
          <Checkbox :value.sync="row.AllowAccess" />
        </div>
      </template>
    </Grid>
  </Page>
</template>
<script>
export default {
  data: () => ({
    roles: null,
    forms: {}
  }),
  props: {
    roleId: [String, Number],
    "page-data": Array
  },
  async mounted() {},
  watch: {
    roles(val) {
      this.$emit("update:page-data", val);
    }
  },
  computed: {
    dbparams() {
      return {
        RolePositionID: this.roleId
      };
    }
  },
  methods: {
    ShowRoleAccess() {
      this.roleAccess = true;
    }
  }
};
</script>
<style lang="scss">
.page-role-access {
  .menu-3 {
    font-weight: bold;
  }
  .menu-5 {
    padding-left: 10px;
  }
}
</style>
