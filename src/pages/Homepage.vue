<template>
  <div id="homePage">
    <div class="search-bar">
      <a-input-search
        v-model:value="searchParams.searchText"
        placeholder="从海量图片中搜索你想找的图片..."
        enter-button
        size="large"
        @search="doSearch"
      />
    </div>
    <!-- 分类 + 标签 activeKey：选中的key  -->
    <a-tabs v-model:activeKey="selectedCategory" @change="doSearch">
      <a-tab-pane key="all" tab="全部" />
      <!-- for循环展示每个标签，通过key是否展示高亮   -->
      <a-tab-pane v-for="category in categoryList" :key="category" :tab="category" />
    </a-tabs>
    <div class="tag-bar">
      <span style="margin-right: 8px">标签：</span>
      <a-space :size="[0, 8]" wrap>
        <a-checkable-tag
          v-for="(tag, index) in tagList"
          :key="tag"
          v-model:checked="selectedTagList[index]"
          @change="doSearch"
        >
          {{ tag }}
        </a-checkable-tag>
      </a-space>
    </div>

    <!-- 图片列表 -->
    <a-list
      :data-source="dataList"
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :loading="loading"
      :pagination="pagination"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0">
          <!-- 单张图片  优化方法 :src="picture.thumbnailUrl ?? picture.url" -->
          <a-card hoverable @click="doClickPicture(picture)">
            <template #cover>
              <img
                :alt="picture.name"
                :src="picture.url"
                style="height: 180px; object-fit: cover"
              />
            </template>
            <a-card-meta :title="picture.name">
              <template #description>
                <a-flex justify="space-between">
                  <a-flex>
                    <a-tag :bordered="false" color="green">
                      {{ picture.category ?? '默认' }}
                    </a-tag>
                  </a-flex>
                  <a-flex>
                    <a-tag color="orange" v-for="tag in picture.tags" :key="tag">
                      {{ tag }}
                    </a-tag>
                  </a-flex>
                </a-flex>
              </template>
            </a-card-meta>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
// 数据
import { computed, onMounted, reactive, ref } from 'vue'
import {
  listPictureTagCategoryUsingGet,
  listPictureVoByPageUsingPost,
} from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/UseLoginUserStore.ts'

const dataList = ref([])
const total = ref(0)
const loading = ref(true)
const loginUserStore = useLoginUserStore()
// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1, // 当前页号
  pageSize: 12, // 每页显示条数
  sortField: 'createTime', // 创建时间字段
  sortOrder: 'descend', // 降序
})

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    // 切换页号时，会修改搜索参数并获取数据
    onChange: (page, pageSize) => {
      searchParams.current = page
      searchParams.pageSize = pageSize
      fetchData()
    },
  }
})

// 获取数据
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const prams = {
    ...searchParams,
    tags: [] as string[],
  }

  if (selectedCategory.value !== 'all') {
    prams.category = selectedCategory.value
  }

  selectedTagList.value.forEach((UseTag, index) => {
    if (UseTag) {
      prams.tags?.push(tagList.value[index])
    }
  })
  // 如果 searchParams 是一个对象，那么 ...searchParams 会将其所有可枚举属性复制到它所在的对象或数组中。
  // 如果 searchParams 是一个数组，那么 ...searchParams 会将其所有元素复制到它所在的另一个数组中。
  const res = await listPictureVoByPageUsingPost(prams)

  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}

// 页面加载时请求一次
onMounted(() => {
  fetchData()
})

// 搜索
const doSearch = () => {
  // 重置搜索条件
  searchParams.current = 1
  fetchData()
}

// 标签和分类列表
const categoryList = ref<string[]>([])
const selectedCategory = ref<string>('all')

const tagList = ref<string[]>([])

// 标签选中状态，选中为true,未选中为false
const selectedTagList = ref<boolean[]>([])

const getTagCategoryOptions = async () => {
  // 从后端获取分类和标签的选项
  const res = await listPictureTagCategoryUsingGet()

  if (res.data.code === 0 && res.data.data) {
    tagList.value = res.data.data.tags ?? []
    categoryList.value = res.data.data.categories ?? []
  } else {
    message.error('获取分类和标签失败,' + res.data.message)
  }
}

onMounted(() => {
  getTagCategoryOptions()
})

const router = useRouter()
// 跳转至图片详情
const doClickPicture = (picture) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}
</script>

<style scoped>
#homePage {
  margin-bottom: 16px;
}

#homePage .search-bar {
  max-width: 480px;
  margin: 0 auto 16px;
}

#homePage .tag-bar {
  margin-bottom: 16px;
}
</style>
