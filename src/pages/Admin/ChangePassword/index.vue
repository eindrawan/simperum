<template>
  <v-row>
    <v-dialog v-model="isShow" max-width="400">
      <v-card>
        <v-card-title class="headline">Ganti Password</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field label="Password Lama" type="password"></v-text-field>
          <v-divider></v-divider>
          <v-text-field label="Password Baru" type="password"></v-text-field>
          <v-text-field
            label="Ulangi Password Baru"
            type="password"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="blue darken-1" text @click="handleSave">
            Simpan
          </v-btn>

          <v-btn color="info darken-1" text @click="handleCancel">
            Batalkan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isShow: {
      get() {
        return this.show || false;
      },
      set(val) {
        this.$emit("update:show", val);
      }
    }
  },
  methods: {
    handleSave() {
      this.isShow = false;
    },
    handleCancel() {
      this.isShow = false;
    }
  }
};
</script>
