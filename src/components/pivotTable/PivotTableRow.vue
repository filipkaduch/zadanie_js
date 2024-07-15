<template>
  <tr class="border border-black bg-slate-600">
    <td
      v-for="(value, index1) in header"
      :key="`data_row-${index1}`"
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
  <tr
    v-for="(data, index2) in loadedData"
    :key="`expanded_row-${index2}`"
    class="border border-black bg-slate-400">
    <td
      v-for="(info, index3) in data"
      :colspan="header.length"
      :key="`expanded_row_cell-${index3}`"
      class="border border-black">
      {{ info }}
    </td>
  </tr>
</template>

<script setup>
import { defineEmits, defineProps, ref, watch } from "vue";

const props = defineProps({
  header: {
    type: Array,
    default: () => []
  },
  row: {
    type: Object,
    default: () => {}
  },
  state: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['opened']);

const loadedData = ref([]);

const triggerData = (data) => {
  loadedData.value = loadedData.value.length ? [] : data;

  emit('opened', !!loadedData.value.length);
};

watch(
  () => props.row,
  (value) => {
    if (props.state) {
      loadedData.value = value.subcategories;
    } else {
      loadedData.value = [];
    }
  },
  {
    immediate: true,
    deep: true
  }
);

</script>

