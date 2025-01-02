import {ref, computed} from 'vue'
import {defineStore} from 'pinia'

/**
 * 存储用户登录信息状态
 */
export const useLoginUserStore = defineStore('counter', () => {
  const loginUser = ref<any>({
    userName: '未登录',
  })

  /**
   * 获取登录用户信息
   */
  async function fetchLoginUser() {
    // todo: 登录用户信息获取逻辑,后端接口还未写好

    // 测试用户登录
    setTimeout(() => {
      loginUser.value = {
        userName: '测试用户',
        id : 1}
      }, 3000)
    }

    /**
     * 设置登录用户信息
     * @param newLoginUser
     */
    function setLoginUser(newLoginUser: any) {
      loginUser.value = newLoginUser
    }


    return {loginUser, fetchLoginUser, setLoginUser}
  }

)
