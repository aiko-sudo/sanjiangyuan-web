<template>
  <div class="craftsmen-page">
    <div class="page-header">
      <h2>传承人管理</h2>
      <el-button type="primary" @click="showDialog = true">添加传承人</el-button>
    </div>
    <el-card>
      <el-table :data="craftsmen" style="width: 100%">
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" :size="40" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="level" label="等级" width="120">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="skills" label="技艺" width="200">
          <template #default="{ row }">
            <el-tag v-for="skill in row.skills" :key="skill" size="small" style="margin-right: 4px">{{ skill }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="guardians" label="守护人数" width="100" />
        <el-table-column prop="years" label="从业年限" width="100" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="editCraftsman(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="showDialog" :title="isEdit ? '编辑传承人' : '添加传承人'" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="姓名" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="等级" required>
          <el-select v-model="form.level">
            <el-option label="国家级传承人" value="国家级传承人" />
            <el-option label="省级传承人" value="省级传承人" />
            <el-option label="市级传承人" value="市级传承人" />
          </el-select>
        </el-form-item>
        <el-form-item label="技艺">
          <el-select v-model="form.skills" multiple placeholder="选择技艺">
            <el-option label="唐卡绘制" value="唐卡绘制" />
            <el-option label="堆绣工艺" value="堆绣工艺" />
            <el-option label="氆氇编织" value="氆氇编织" />
            <el-option label="藏装制作" value="藏装制作" />
            <el-option label="藏香制作" value="藏香制作" />
          </el-select>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.intro" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model="form.avatar" placeholder="图片URL" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="从业年限">
              <el-input-number v-model="form.years" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="传承学生">
              <el-input-number v-model="form.students" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="代表作品">
              <el-input-number v-model="form.works" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/api/request'

const craftsmen = ref([])
const showDialog = ref(false)
const isEdit = ref(false)
const editingId = ref('')

const form = ref({
  name: '', level: '省级传承人', skills: [], intro: '', avatar: '', years: 0, students: 0, works: 0
})

const fetchCraftsmen = async () => {
  try {
    const res = await request.get('/craftsmen')
    craftsmen.value = res.craftsmen
  } catch (err) { console.error(err) }
}

const getLevelType = (level: string) => ({ '国家级传承人': 'danger', '省级传承人': 'warning', '市级传承人': '' }[level] || 'info')

const editCraftsman = (item: any) => {
  isEdit.value = true
  editingId.value = item._id
  form.value = { ...item }
  showDialog.value = true
}

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await request.put(`/craftsmen/${editingId.value}`, form.value)
      ElMessage.success('更新成功')
    } else {
      await request.post('/craftsmen', form.value)
      ElMessage.success('添加成功')
    }
    showDialog.value = false
    fetchCraftsmen()
    resetForm()
  } catch (err) { console.error(err) }
}

const handleDelete = async (id: string) => {
  await ElMessageBox.confirm('确定删除该传承人？', '警告', { type: 'warning' })
  try {
    await request.delete(`/craftsmen/${id}`)
    ElMessage.success('删除成功')
    fetchCraftsmen()
  } catch (err) { console.error(err) }
}

const resetForm = () => {
  isEdit.value = false
  editingId.value = ''
  form.value = { name: '', level: '省级传承人', skills: [], intro: '', avatar: '', years: 0, students: 0, works: 0 }
}

onMounted(fetchCraftsmen)
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
</style>
