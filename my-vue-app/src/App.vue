<template>
  <div id="app" class="h-100">
    <PivotTable :data="tableData" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import PivotTable from './components/pivotTable/PivotTable.vue';

const tableData = ref();

const fetchData = async () => {
  try {
    const response = await fetch('https://hiring.wdev.sk/fe-data');

    const result = await response.json();

    tableData.value = result;
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
