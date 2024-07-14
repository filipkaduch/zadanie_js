const processData = (data) => {
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

  return { pivotData, categorySums, stores, categories };
};

const createHeader = (stores) => {
  return [''].concat(Array.from(stores));
};

const createRawResult = (pivotData, storeList) => {
  return Object.entries(pivotData).map(([product, data]) => {
    const row = { product, category: data.category };

    storeList.slice(1).forEach(store => row[store] = data.stores[store] || 0);

    return row;
  });
};

const sortData = (data, sortKey, sortOrder) => {
  if (!sortKey) return data;

  const sortMultiplier = sortOrder === 'desc' ? -1 : 1;

  const sortFunction = (a, b) => ((a[sortKey] || 0) - (b[sortKey] || 0)) * sortMultiplier;

  return data.sort(sortFunction);
};

const formatResult = (sortedRawResult, categorySums, sortKey, sortOrder) => {
  const result = Object.entries(categorySums).map(([category, storeSums]) => {
    const subcategories = sortedRawResult
      .filter(res => res.category === category)
      .map(({ category, ...rest }) => rest);

    return {
      category,
      ...storeSums,
      subcategories: sortKey ? sortData(subcategories, sortKey, sortOrder) : subcategories
    };
  });

  return sortKey ? sortData(result, sortKey, sortOrder) : result;
};

const dataTransformation = (data, sortKey = '', sortOrder = 'asc') => {
  const { pivotData, categorySums, stores } = processData(data);

  const storeList = createHeader(stores);

  const rawResult = createRawResult(pivotData, storeList);

  const sortedRawResult = sortData(rawResult, sortKey, sortOrder);

  return {
    data: formatResult(sortedRawResult, categorySums, sortKey, sortOrder),
    header: storeList
  };
};

export { dataTransformation };