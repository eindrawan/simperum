export default [
  {
    path: "/Main/RTLH/PBDT",
    component: () => import("../pages/RTLH/Database/Database.vue")
  },
  {
    path: "/Main/RTLH/InputProposal",
    component: () => import("../pages/RTLH/InputUsulan/InputUsulan.vue")
  },
  {
    path: "/Main/RTLH/ReviewProposal",
    component: () => import("../pages/RTLH/ReviewUsulan/ReviewUsulan.vue")
  },
  {
    path: "/Main/RTLH/RekomProposal",
    component: () => import("../pages/RTLH/Rekomendasi/Rekomendasi.vue")
  },
  {
    path: "/Main/RTLH/PBDT_edit",
    component: () => import("../pages/RTLH/ValidasiData/ValidasiData.vue")
  },
  {
    path: "/Main/RTLH/Alokasi",
    component: () => import("../pages/RTLH/Alokasi.vue")
  },
  {
    path: "/Main/RTLH/Report",
    component: () => import("../pages/RTLH/Report.vue")
  },
  {
    path: "/Main/RTLH/DesaBinaan",
    component: () => import("../pages/RTLH/DesaBinaan.vue")
  }
];
