<template>
  <div id="addPicturePage" class="addPicturePage">
    <h2 style="margin-bottom: 16px">
      {{ route.query?.id ? '修改图片' : '上传图片' }}
    </h2>
    <!--选择图片上传方式-->
    <!-- 选择上传方式 -->
    <a-tabs v-model:activeKey="uploadType"
      >>
      <a-tab-pane key="file" tab="文件上传">
        <PictureUpload :picture="picture" :onSuccess="onSuccess" />
      </a-tab-pane>
      <a-tab-pane key="url" tab="URL 上传" force-render>
        <UrlPictureUpload :picture="picture" :onSuccess="onSuccess" />
      </a-tab-pane>
    </a-tabs>
    <!-- 图片信息表单 picture有信息，则为编辑图片  -->
    <a-form
      v-if="picture"
      name="pictureForm"
      layout="vertical"
      :model="pictureForm"
      @finish="handleSubmit"
    >
      <a-form-item name="name" label="图片名称">
        <a-input v-model:value="pictureForm.name" placeholder="请输入名称" allow-clear />
      </a-form-item>
      <a-form-item name="introduction" label="图片简介">
        <a-textarea
          v-model:value="pictureForm.introduction"
          placeholder="请输入简介"
          :auto-size="{ minRows: 2, maxRows: 6 }"
          allow-clear
        />

        <a-form-item name="category" label="分类">
          <a-auto-complete
            v-model:value="pictureForm.category"
            placeholder="请输入分类"
            :options="categoryOptions"
            allow-clear
          />
        </a-form-item>
        <a-form-item name="tags" label="标签">
          <a-select
            v-model:value="pictureForm.tags"
            mode="tags"
            placeholder="请输入标签"
            :options="tagOptions"
            allow-clear
          />
        </a-form-item>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">
          {{ route.query?.id ? '修改' : '创建' }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import PictureUpload from '@/components/PictureUpload.vue'
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  editPictureUsingPost,
  getPictureVoByIdUsingGet,
  listPictureTagCategoryUsingGet,
} from '@/api/pictureController.ts'
import router from '@/router'
import { useRoute } from 'vue-router'
import UrlPictureUpload from '@/components/UrlPictureUpload.vue'

const picture = ref<API.PictureVO>()

// 图片上传类型，默认为文件上传
const uploadType = ref<'file' | 'url'>('file')

const pictureForm = reactive<API.PictureEditRequest>({})

/**
 * 图片上传成功
 * @param newPicture
 */
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  // 回填表单
  pictureForm.name = newPicture.name
}

/**
 * 提交表单
 * @param values 表单输入的值
 */
const handleSubmit = async (values: any) => {
  // 表单校验
  const pictureId = picture.value.id
  if (!pictureId) {
    return message.error('请先上传图片')
  }

  const res = await editPictureUsingPost({
    ...values,
    id: pictureId,
  })

  // 操作成功
  if (res.data.code === 0 && res.data.data) {
    message.success('操作成功')
    router.push({
      path: `/picture/${pictureId}`,
    })
  } else {
    message.error('创建失败, ' + res.data.message)
  }
}

const categoryOptions = ref<string[]>([])

const tagOptions = ref<string[]>([])

const getTagCategoryOptions = async () => {
  // 从后端获取分类和标签的选项
  const res = await listPictureTagCategoryUsingGet()
  // console.log("参数的值为：" + res)
  if (res.data.code === 0 && res.data.data) {
    tagOptions.value = (res.data.data.tags ?? []).map((data: string) => {
      return { value: data, label: data }
    })

    categoryOptions.value = (res.data.data.categories ?? []).map((data: string) => {
      return { value: data, label: data }
    })
  } else {
    message.error('获取分类和标签失败')
  }
}

// 页面加载时获取分类和标签的选项
onMounted(() => {
  getTagCategoryOptions()
})

const route = useRoute()

// 获取老数据
const getOldPicture = async () => {
  // 获取id
  const id = route.query?.id
  if (id) {
    const res = await getPictureVoByIdUsingGet({ id })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      picture.value = data // 把当前图片设置为已经获取到的图片
      pictureForm.name = data.name
      pictureForm.introduction = data.introduction
      pictureForm.category = data.category
      pictureForm.tags = data.tags
    }
  }
}
// 页面加载时获取老数据
onMounted(() => {
  getOldPicture()
})
</script>

<style scoped>
#addPicturePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
