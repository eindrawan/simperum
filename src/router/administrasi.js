export default [
  {
    path: "/Main/Admin/Company",
    name: "Company",
    component: () => import("../pages/Admin/Company.vue")
  },
  {
    path: "/Main/Admin/User/*",
    name: "User",
    component: () => import("../pages/Admin/User/User.vue")
  },
  {
    path: "/Main/App/ChangePassword/*",
    name: "Profile",
    component: () => import("../pages/Admin/Profile.vue")
  }
];
