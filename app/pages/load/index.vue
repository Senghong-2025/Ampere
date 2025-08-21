<template>
  <div>
    <button @click="exportDataToCsv">Export to CSV</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      myData: [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
      ],
    };
  },
  methods: {
    exportDataToCsv() {
      let csvContent = "data:text/csv;charset=utf-8,";
      // Add header row
      const headers = Object.keys(this.myData[0]).join(',');
      csvContent += headers + "\n";

      // Add data rows
      this.myData.forEach(row => {
        const values = Object.values(row).join(',');
        csvContent += values + "\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "my_data.csv");
      document.body.appendChild(link); // Required for Firefox
      link.click();
      document.body.removeChild(link); // Clean up
    },
  },
};
</script>