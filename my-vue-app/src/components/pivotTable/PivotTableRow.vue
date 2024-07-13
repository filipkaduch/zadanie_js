<template>
  <tr class="border border-black bg-slate-600">
    <td
      v-for="(value, index1) in header"
      :key="index1"
      :colspan="header.length"
      class="border border-black py-1 px-2">
      <div v-if="index1 === 0" class="flex justify-between items-center">
        {{ row.category }}
        <button class="py-1 px-3 w-8 bg-black rounded" @click="triggerData(row.subcategories)">
          {{ loadedData.length ? '-' : '+' }}
        </button>
      </div>
      <div v-else class="font-bold">
        {{ row[value]}}
      </div>
    </td>
  </tr>
  <tr v-for="(data, index2) in loadedData" :key="index2" class="border border-black bg-slate-400">
    <td v-for="(info, index3) in data" :colspan="header.length" :key="index3" class="border border-black">
      {{ info }}
    </td>
  </tr>
</template>

<script setup>
import { defineProps, ref, watch } from "vue";

const props = defineProps({
  header: {
    type: Array,
    default: () => []
  },
  row: {
    type: Object,
    default: () => {}
  },
});

const loadedData = ref([]);

const triggerData = (data) => loadedData.value = loadedData.value.length ? [] : data;

watch(
  () => props.row.subcategories,
  (value) => {
    if (loadedData.value.length) {
      loadedData.value = value;
    }
  },
  {
    immediate: true,
    deep: true
  }
);
</script>

