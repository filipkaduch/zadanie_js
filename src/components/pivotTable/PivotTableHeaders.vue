<template>
  <tr>
    <th
      v-for="(value, index) in headers"
      :key="`pivot_table_header-${index}`"
      :colspan="headers.length"
      class="border border-black min-h-8"
      :class="index === 0 ? 'w-1/4' : 'max-w-8'">
      <div class="flex justify-between gap-1 px-1">
        <span class="cursor-pointer" @click="emitOrder(value)">
          {{ value }}
        </span>
        <span v-show="value === sortKey" class="fill-white h-4 w-4">
          <IconChevronUp v-if="sortDirection === 'desc'" />
          <IconChevronDown v-else-if="sortDirection === 'asc'" />
        </span>
        <span
          v-if="sortDirection && value === sortKey"
          class="flex items-center cursor-pointer">
          <IconCircleXMark class="fill-white h-4 w-4" @click="emitOrder('', true)"/>
        </span>
      </div>
    </th>
  </tr>
</template>

<script setup>
import { defineEmits, defineProps, ref } from "vue";
import IconChevronUp from "../icons/IconChevronUp";
import IconChevronDown from "../icons/IconChevronDown";
import IconCircleXMark from "../icons/IconCircleXMark";

const props = defineProps({
  headers: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['sort']);

const sortDirection = ref('');

const sortKey = ref('');

const emitOrder = (category, reset = false) => {
  if (reset) {
    sortDirection.value = '';
  } else {
    sortDirection.value = (sortKey.value === category && sortDirection.value === 'asc') ? 'desc' : 'asc';
  }

  sortKey.value = category;

  emit('sort', category, sortDirection.value);
};

</script>