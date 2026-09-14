<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue?: string;
  placeholder?: string;
  buttonLabel?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  submit: [value: string];
}>();

const inputValue = ref(props.modelValue ?? '');

watch(
  () => props.modelValue,
  (value) => {
    inputValue.value = value ?? '';
  },
);

watch(inputValue, (value) => {
  emit('update:modelValue', value);
});

function handleSubmit() {
  emit('submit', inputValue.value.trim());
}
</script>

<template>
  <form
    class="search-box"
    @submit.prevent="handleSubmit"
  >
    <ElInput
      v-model="inputValue"
      :placeholder="placeholder ?? 'Search docs...'"
      class="search-box__input"
      size="large"
      @keyup.enter="handleSubmit"
    >
      <template #prefix>
        <ElIcon><Search /></ElIcon>
      </template>
      <template #append>
        <ElButton
          type="primary"
          @click="handleSubmit"
        >
          {{ buttonLabel ?? 'Search' }}
        </ElButton>
      </template>
    </ElInput>
  </form>
</template>
