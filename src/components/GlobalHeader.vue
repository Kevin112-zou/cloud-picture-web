<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="200px">
        <router-link to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/logo.png" alt="logo" />
            <!-- alt作用：当图片加载不出来时可以显示文字-->
            <div class="title">超级云图库</div>
          </div>
        </router-link>
      </a-col>
      <a-col flex="auto">
        <!--v-model:selectedKeys="current"  双向绑定当前选中的菜单项的 key 数组-->
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="doMenuClick"
        />
      </a-col>
      <a-col flex="120px">
        <div class="user-login-status">
          <div v-if="loginUserStore.loginUser.id">
            <a-dropdown>
              <a-space>
                <a-avatar :src="loginUserStore.loginUser.userAvatar" />
                <span style="font-size: 16px"
                  >{{ loginUserStore.loginUser.userName ?? '无名' }}
                </span>
                <span v-if="loginUserStore.loginUser.userRole === 'admin'">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 32 32"
                  >
                    <path
                      fill="none"
                      stroke="#dc2626"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m7 13l3 6.5l3-6.5m3.5 0v6.5m4-2.225h1.48c.651 0 1.277-.275 1.721-.75a2.34 2.34 0 0 0 .215-2.932a1.4 1.4 0 0 0-1.14-.593H20.5zm0 0V19.5M5 7h22a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2"
                    />
                  </svg>
                </span>
              </a-space>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="doLogout">
                    <LogoutOutlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div v-else>
            <a-button type="primary" href="/user/login"> 登录</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { LogoutOutlined } from '@ant-design/icons-vue'
import { MenuProps, message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/UseLoginUserStore.ts'
import { userLogoutUsingPost } from '@/api/userController'

const loginUserStore = useLoginUserStore()

const originItems = [
  {
    key: '/',
    label: '主页',
    title: '主页',
  },
  {
    key: '/add_picture',
    label: '上传图片',
    title: '上传图片',
  },
  {
    key: '/admin/userMange',
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: '/admin/pictureMange',
    label: '图片管理',
    title: '图片管理',
  },
  {
    key: '/others',
    label: h('a', { href: 'https://www.codefather.cn', target: '_blank' }, '编程导航'),
    title: '编程导航',
  },
]
// 过滤菜单项
const filterMenus = (menus = [] as MenuProps['items']) => {
  return menus?.filter((menu) => {
    // 管理员才能看到 /admin 开头的菜单
    if (menu?.key?.startsWith('/admin')) {
      // 管理员权限
      const loginUser = loginUserStore.loginUser
      if (!loginUser || loginUser.userRole !== 'admin') {
        return false
      }
    }
    return true
  })
}

// 展示在菜单的路由数组
const items = computed(() => {
  return filterMenus(originItems)
})

const router = useRouter()

// 路由跳转事件
const doMenuClick = ({ key }) => {
  router.push({
    path: key,
  })
}

// 当前要高亮的菜单项
const current = ref<string[]>([])
// 钩子函数，监听路由变化，更新高亮菜单项
router.afterEach((to, from, next) => {
  current.value = [to.path] // 更新当前选中项
})

// 用户注销
const doLogout = async () => {
  const res = await userLogoutUsingPost()
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: '未登录',
    })
    message.success('退出登录成功')
    router.push({
      path: '/user/login',
    })
  } else {
    message.error('退出登录失败，' + res.data.message)
  }
}
</script>

<style scoped>
#globalHeader .title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black;
  font-size: 20px;
  margin-left: 16px;
}

.logo {
  height: 40px;
}
</style>
