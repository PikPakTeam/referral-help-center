<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue?: string;
  placeholder?: string;
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
    <input
      v-model="inputValue"
      :placeholder="placeholder ?? 'Search docs...'"
      class="search-box__input"
      type="search"
    >
    <button
      class="search-box__button"
      type="submit"
    >
      Search
    </button>
  </form>
</template>
