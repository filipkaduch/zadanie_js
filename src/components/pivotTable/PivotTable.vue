<template>
  <div class="w-full table-overflow px-3">
    <div class="text-xl font-bold" >Pivot Table</div>
      <table v-if="formattedData.length" class="w-full border border-black my-5 text-white">
        <thead v-if="headers.length" class="bg-slate-900">
          <PivotTableHeaders :headers="headers" @sort="setOrder" />
        </thead>
        <tbody v-if="content.length">
          <PivotTableRow
            v-for="(row, index) in content"
            :key="`pivot_table_row-${index}`"
            :header="headers"
            :row="row"
            :state="rowMap[index]"
            @opened="rowMap[index] = $event"/>
        </tbody>
      </table>
  </div>
</template>

<script setup>
import { defineProps, ref, watch } from "vue";
import PivotTableHeaders from "./PivotTableHeaders";
import PivotTableRow from "./PivotTableRow";
import { dataTransformation } from "../../utils/dataUtils";

const props = defineProps({
  formattedData: {
    type: Array,
    default: () => []
  },
  headers: {
    type: Array,
    default: () => []
  },
  rawData: {
    type: Array,
    default: () => []
  }
});

const rowMap = ref([]);

const content = ref([]);

const setOrder = (category, sortDirection) => {
  content.value = dataTransformation(props.rawData, category, sortDirection).data;
};

watch(
  () => props.formattedData,
  (value) => {
    if (value.length) {
      content.value = value;

      value.map(() => rowMap.value.push(false));
    }
  },
  {
    immediate: true
  }
);

</script>

