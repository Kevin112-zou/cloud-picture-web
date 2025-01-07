import { createRouter, createWebHistory } from 'vue-router'

import UserLoginPage from '@/pages/user/UserLoginPage.vue'

import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import Homepage from '@/pages/Homepage.vue'
import AddPicturePage from '@/pages/AddPicturePage.vue'
import PictureManagePage from '@/pages/admin/PictureManagePage.vue'
import PictureDetailpage from '@/pages/PictureDetailpage.vue'
import AddPictureBatchPage from '@/pages/AddPictureBatchPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '主页',
      component: Homepage,
    },
    {
      path: '/add_picture',
      name: '上传图片',
      component: AddPicturePage,
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLoginPage,
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegisterPage,
    },
    {
      path: '/admin/userMange',
      name: '用户管理',
      component: UserManagePage,
    },
    {
      path: '/picture/:id',
      name: '图片详情页',
      component: PictureDetailpage,
      props: true,
    },
    {
      path: '/add_picture/batch',
      name: '批量创建图片',
      component: AddPictureBatchPage,
    },
    {
      path: '/admin/pictureMange',
      name: '图片管理',
      component: PictureManagePage,
    },
  ],
})

export default router
