import { message } from 'ant-design-vue'
import router from './router'
import { useLoginUserStore } from './stores/UseLoginUserStore'

let firstFetchLoginUser = true
/**
 * 全局权限校验
 */
router.beforeEach(async (to, from, next) => {
  const loginUserStore = useLoginUserStore()
  let loginUser = loginUserStore.loginUser
  // 确保刷新页面时，首次加载时，能等待后端返回用户信息后再校验权限
  if (!firstFetchLoginUser) {
    await loginUserStore.fetchLoginUser()
    loginUser = loginUserStore.loginUser
    firstFetchLoginUser = false
  }
  const toUrl = to.fullPath
  console.log('MytoUrl: ' + toUrl)
  // todo: 自定义权限校验逻辑； 比如：管理员才能访问 /admin 开头的页面
  if (toUrl.startsWith('/admin')) {
    console.log('loginUser: ' + loginUser.userRole)
    if (!loginUser || loginUser.userRole !== 'admin') {
      message.error('您没有权限访问此页面')
      next(`/user/login?redirect=${to.fullPath}`)
      return
    }
  }
  next() // 放行
})
