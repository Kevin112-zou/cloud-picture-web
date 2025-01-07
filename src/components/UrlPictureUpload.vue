<template>
  <div class="url-picture-upload">
    <a-input-group compact>
      <a-input
        v-model:value="fileUrl"
        style="width: calc(100% - 120px)"
        placeholder="请输入图片地址"
      />
      <a-button type="primary" style="width: 120px" :loading="loading" @click="handleUpload"
        >提交
      </a-button>
    </a-input-group>
    <div class="img-upload">
      <img v-if="picture?.url" :src="picture?.url" alt="avatar" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { uploadPictureByUrlUsingPost } from '@/api/pictureController.ts'

interface Props {
  picture?: API.PictureVO
  onSuccess?: (newPicture: API.PictureVO) => void
}

// 文件上传地址
const fileUrl = ref<string>()

const props = defineProps<Props>()

// 上传图片接口
const handleUpload = async () => {
  loading.value = true

  try {
    const params: API.PictureUploadRequest = { fileUrl: fileUrl.value }
    if (props.picture) {
      // 如果已经有图片，则更新
      params.id = props.picture?.id
    }
    const res = await uploadPictureByUrlUsingPost(params)

    if (res.data.code === 0 && res.data.data) {
      message.success('图片上传成功')
      // 将上传成功的图片传递给父组件
      props.onSuccess?.(res.data.data)
    } else {
      message.error('图片上传失败，' + res.data.message)
    }
  } catch (error) {
    console.error('图片上传失败，' + error.message)
    message.error('图片上传失败，' + error.message)
  }
  loading.value = false
}

const loading = ref<boolean>(false)
</script>
<style scoped>
.url-picture-upload {
  margin-bottom: 16px;
}

.url-picture-upload img {
  max-width: 100%;
  max-height: 320px;
}

.url-picture-upload .img-upload {
  text-align: center;
  margin-top: 16px;
}
</style>
