import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
import {getLoginUserUsingGet, getUserByIdUsingGet} from "@/api/userController.ts";

/**
 * 存储用户登录信息状态
 */
export const useLoginUserStore = defineStore('counter', () => {
  const loginUser = ref<API.LoginUserVo>({
    userName: '未登录',
  })

  /**
   * 远程获取用户登录信息
   */
  async function fetchLoginUser() {
    // todo: 登录用户信息获取逻辑,后端接口还未写好
    const res = await getLoginUserUsingGet();
    if(res.data.code === 0 && res.data.data){ // 正常返回
      loginUser.value = res.data.data
    }
    // 测试用户登录
    // setTimeout(() => {
    //   loginUser.value = {
    //     userName: '测试用户',
    //     id : 1}
    //   }, 3000)
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
