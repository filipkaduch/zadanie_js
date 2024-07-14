<template>
  <div id="app" class="h-100">
    <PivotTable :formatted-data="tableData" :headers="headersData" :raw-data="rawData" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import PivotTable from './components/pivotTable/PivotTable.vue';
import { dataTransformation } from './utils/dataUtils';

const tableData = ref([]);

const rawData = ref([]);

const headersData = ref([]);

const fetchData = async () => {
  try {
    const response = await fetch('https://hiring.wdev.sk/fe-data');

    const result = await response.json();

    rawData.value = result;

    const { data, header } = dataTransformation(result);

    tableData.value = data;

    headersData.value = header;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

onMounted(() => {
  fetchData();
});

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
