<template>
  <section class="nav-bar">
    <div class="nav-container">
      <div class="brand">
        <a href="/"><img src="/imgs/logo.png"/></a>
      </div>
      <nav>
        <div class="nav-mobile">
          <a id="nav-toggle" @click="openMenu"><span></span></a>
        </div>
        <ul class="nav-list">
          <li v-for="(m, idx) in menu" :key="idx">
            <a href="javascript:void(0)" @click="handleMenuClick(m.MenuUrl)">{{
              m.MenuName
            }}</a>
            <ul v-if="m.child" class="nav-dropdown">
              <li v-for="(sm, sidx) in m.child" :key="sidx">
                <a
                  href="javascript:void(0)"
                  @click="handleMenuClick(sm.MenuUrl)"
                  >{{ sm.MenuName }}</a
                >
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </section>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    // menu: [
    //   {
    //     MenuName: "SIMPERUM",
    //     MenuUrl: "/"
    //   }
    // ]
    // menu: null
  }),
  computed: {
    ...mapGetters({
      menu: "getMenu"
    })
  },
  async mounted() {
    // let res = await this.$api.call("Arch_SelMenu");
    // let menu = [];
    // let last = null;
    // for (let i = 0; i < res.data.length; i++) {
    //   let m = res.data[i];
    //   m.child = [];
    //   if (last && m.ParentMenuID == last.MenuID) {
    //     last.child.push(m);
    //   } else {
    //     menu.push(m);
    //     last = m;
    //   }
    // }
    // this.menu = menu;
    // this.menu = this.xmenu.length
    //   ? this.xmenu
    //   : JSON.parse(localStorage.getItem("menu"));
  },
  methods: {
    handleMenuClick(url) {
      // evt.target.closest("LI").querySelector("UL").style.display = "initial";
      if (url.match(/^javascript:/)) eval(url);
      else this.$router.push(url);
    },
    openMenu() {
      if (document.querySelector(".nav-list").style.display == "none")
        document.querySelector(".nav-list").style.display = "initial";
      else document.querySelector(".nav-list").style.display = "none";
    }
  }
};
</script>
<style lang="scss">
.nav-bar {
  height: 50px;
  background: #262626;

  ul {
    padding-left: 0px !important;
    z-index: 10;
  }
  .nav-list {
    li:hover {
      & > ul {
        display: initial;
      }
    }
  }
}

.brand {
  position: absolute;
  padding-left: 20px;
  float: left;
  line-height: 70px;
  text-transform: uppercase;
  font-size: 1.4em;
}
.brand a img {
  max-height: 70px;
}
.brand a,
.brand a:visited {
  color: #ffffff;
  text-decoration: none;
}

.nav-container {
  max-width: 1000px;
  margin: 0 auto;
}

nav {
  float: right;
}
nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
nav ul li {
  float: left;
  position: relative;
}
nav ul li a,
nav ul li a:visited {
  display: block;
  padding: 0 20px;
  line-height: 50px;
  background: #262626;
  color: #ffffff !important;
  text-decoration: none;
}
nav ul li a:hover,
nav ul li a:visited:hover {
  background: #2ab1ce;
  color: #ffffff;
}
nav ul li a:not(:only-child):after,
nav ul li a:visited:not(:only-child):after {
  padding-left: 4px;
  content: " ▾";
}
nav ul li ul li {
  min-width: 190px;
}
nav ul li ul li a {
  padding: 15px;
  line-height: 20px;
}

.nav-dropdown {
  position: absolute;
  display: none;
  z-index: 1;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
}
.nav-mobile {
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  background: #262626;
  height: 50px;
  width: 70px;
}

@media only screen and (max-width: 798px) {
  .nav-mobile {
    display: block;
  }

  nav {
    width: 100%;
    padding: 70px 0 15px;
  }
  nav ul {
    display: none;
  }
  nav ul li {
    float: none;
  }
  nav ul li a {
    padding: 15px;
    line-height: 20px;
    padding-left: 25%;
  }
  nav ul li ul li a {
    padding-left: 30%;
  }

  .nav-dropdown {
    position: static;
  }
  .brand a img {
    max-height: 60px;
    margin-top: 5px;
  }
}
@media screen and (min-width: 799px) {
  .nav-list {
    display: block !important;
  }
}
#nav-toggle {
  position: absolute;
  left: 18px;
  top: 15px;
  cursor: pointer;
  padding: 10px 35px 16px 0px;
}
#nav-toggle span,
#nav-toggle span:before,
#nav-toggle span:after {
  cursor: pointer;
  border-radius: 1px;
  height: 5px;
  width: 35px;
  background: #ffffff;
  position: absolute;
  display: block;
  content: "";
  transition: all 300ms ease-in-out;
}
#nav-toggle span:before {
  top: -10px;
}
#nav-toggle span:after {
  bottom: -10px;
}
#nav-toggle.active span {
  background-color: transparent;
}
#nav-toggle.active span:before,
#nav-toggle.active span:after {
  top: 0;
}
#nav-toggle.active span:before {
  transform: rotate(45deg);
}
#nav-toggle.active span:after {
  transform: rotate(-45deg);
}
</style>
