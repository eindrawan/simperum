<template>
  <v-app class="dense">
    <NavBar />
    <!-- <v-content>
      <Login />
    </v-content> -->
    <router-view />
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

// import { FadeTransition as PageTransition } from "vue2-transitions";
// import Header from "./pages/Header";
import NavBar from "./components/NavBar";
// import Login from "./components/pages/Login";

export default {
  name: "App",
  components: {
    NavBar
    // Login
  },
  data: () => ({
    //
  }),
  computed: {
    ...mapGetters({
      notification: "getNotification"
    })
  },
  watch: {
    notification(val) {
      this.$toast.open({
        ...val,
        position: "top",
        dismissible: true
      });
    }
  }
};
</script>
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap");

$body-font-family: "Montserrat";
$title-font: "Roboto";
.v-application {
  font-family: $body-font-family, sans-serif !important;
  background-image: url(/imgs/bg.jpg) !important;
  background-size: cover !important;
  background-position: bottom !important;
  font-weight: medium;
  .title {
    // To pin point specific classes of some components
    font-family: $title-font, sans-serif !important;
  }
  [center] {
    text-align: center;
  }
}

.form-inline {
  .form-coms {
    display: flex;
    .form-label {
      flex: 0 0 160px;
      padding: 3px 0;
    }
    .form-coms {
      margin-bottom: 0;
    }
  }
}
.padding {
  padding: 10px;
}

.v-menu__content {
  border-radius: 2px;
  .v-list {
    border-radius: 0;
  }
}
.v-list.v-select-list {
  .v-list-item {
    padding: 0;
    min-height: 10px;
    &:last-child {
      border-bottom: 0px;
    }
    .v-list-item__content {
      padding: 8px 0;
      margin: 0 12px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      .v-list-item__title {
        font-size: 12px;
        color: #1a1a1a;
      }
    }
  }
}

.v-list.contextmenu {
  padding: 5px;

  .v-list-item {
    padding: 0 10px;
    min-height: 10px;
    &:last-child {
      border-bottom: 0px;
    }
    .v-list-item__icon {
      margin: 12px 2px 10px 0px;
      .v-icon {
        font-size: 14px;
      }
    }
    .v-list-item__title {
      padding: 10px 0;
      font-size: 14px;
    }
  }
}

.forms {
  .v-input {
    display: inline-block;
  }
}
.notices {
  font-family: "Montserrat", sans-serif !important;
  .toast {
    min-height: 3em !important;
  }
}

.tooltip {
  display: block !important;
  z-index: 10000;
  color: white;
  font-family: "Montserrat";
  font-size: 12px;

  .tooltip-inner {
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 5px 10px 4px;
    border-radius: 3px;
  }

  .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: rgba(0, 0, 0, 0.8);
    z-index: 1;
  }

  &[x-placement^="top"] {
    margin-bottom: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="bottom"] {
    margin-top: 5px;

    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="right"] {
    margin-left: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^="left"] {
    margin-right: 5px;

    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &.popover {
    $color: #f9f9f9;

    .popover-inner {
      background: $color;
      color: black;
      padding: 24px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, 0.1);
    }

    .popover-arrow {
      border-color: $color;
    }
  }

  &[aria-hidden="true"] {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.15s, visibility 0.15s;
  }

  &[aria-hidden="false"] {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.15s;
  }
}

.notices .toast .toast-text {
  padding: 0.5em 1em !important;
}
::-webkit-scrollbar {
  width: 10px; /* for vertical scrollbars */
  height: 10px; /* for horizontal scrollbars */
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.5);
}
</style>
