<template>
	<div class="w-full table-overflow px-3">
    <div class="text-xl font-bold" >Pivot Table</div>
		<table v-if="data.length" class="w-full border border-black my-5 text-white">
			<thead v-if="header" class="sticky-header bg-slate-900">
				<tr>
					<th
            v-for="(value, index) in header"
						:key="`pivot_table_header-${index}`"
						:colspan="header.length"
            class="border border-black cursor-pointer min-h-8">
						<div class="flex justify-between gap-2 px-2">
              <span @click="setOrder(value)">{{ value }}</span>
              <span v-if="value === sortKey" class="fill-white h-4 w-4">
                <IconChevronUp v-if="sortDirection === 'desc'" />
                <IconChevronDown v-else-if="sortDirection === 'asc'" />
              </span>
              <span
                v-if="sortDirection && value === sortKey"
                class="flex items-center">
                <IconCircleXMark class="fill-white h-4 w-4" @click="setOrder('', true)"/>
              </span>
            </div>
					</th>
				</tr>
			</thead>
			<tbody v-if="content.length">
        <PivotTableRow
          v-for="(row, index) in content"
          :key="`pivot_table_row-${index}`"
          :header="header"
          :row="row"
        />
			</tbody>
		</table>
	</div>
</template>

<script setup>
import { defineProps, ref, watch } from "vue";
import IconChevronUp from "../icons/IconChevronUp";
import IconChevronDown from "../icons/IconChevronDown";
import IconCircleXMark from "../icons/IconCircleXMark";
import PivotTableRow from "./PivotTableRow";

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
});

const header = ref([]);

const content = ref([]);

const sortDirection = ref('');

const sortKey = ref('');

const setOrder = (category, reset = false) => {
  if (reset) {
    sortDirection.value = '';
  } else {
    if (sortKey.value === category) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortDirection.value = 'asc';
    }
  }

  sortKey.value = category;

  content.value = dataTransformation(props.data, category, sortDirection.value);
};

const dataTransformation = (data, sortKey = '', sortOrder = 'asc') => {
  const pivotData = {};

  const categorySums = {};

  const stores = new Set();

  const categories = new Set();

  data.forEach(({ product, category, pcs, store }) => {
    if (!pivotData[product]) {
      pivotData[product] = { category, stores: {} };

      categories.add(category);
    }

    if (!pivotData[product].stores[store]) pivotData[product].stores[store] = 0;

    pivotData[product].stores[store] += pcs;

    if (!categorySums[category]) categorySums[category] = {};

    if (!categorySums[category][store]) categorySums[category][store] = 0;

    categorySums[category][store] += pcs;

    stores.add(store);
  });

  const storeList = [''].concat(Array.from(stores));

  header.value = storeList;

  const rawResult = Object.entries(pivotData).map(([product, data]) => {
    const row = { product, category: data.category };

    storeList.slice(1).forEach(store => row[store] = data.stores[store] || 0);

    return row;
  });

  const sortMultiplier = sortOrder === 'desc' ? -1 : 1;

  const sortFunction = (a, b) => ((a[sortKey] || 0) - (b[sortKey] || 0)) * sortMultiplier;

  const sortedRawResult = sortKey
    ? rawResult.sort(sortFunction)
    : rawResult;

  const result = Object.entries(categorySums).map(([category, storeSums]) => {
    const subcategories = sortedRawResult
      .filter(res => res.category === category)
      .map(({ category, ...rest }) => rest)

    return {
      category,
      ...storeSums,
      subcategories: sortKey ? subcategories.sort(sortFunction) : subcategories
    };
  });

  return sortKey ? result.sort(sortFunction) : result;
};

watch(
  () => props.data,
  (value) => {
    if (value.length) {
      content.value = dataTransformation(value);
    }
  },
  {
    immediate: true
  }
);

</script>

