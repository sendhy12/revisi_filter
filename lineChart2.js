document.addEventListener("DOMContentLoaded", function () {
  let lineChart; // Variabel untuk menyimpan objek chart

  const filterForm = document.getElementById("filterForm");

  // Tambahkan event listener untuk setiap perubahan pada dropdown
  filterForm.addEventListener("change", applyFilters);

  // Fungsi untuk mengambil data dan menerapkan filter
  function applyFilters() {
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => {
        const selectedQuarter = document.getElementById("quarters").value;
        const selectedYear = document.getElementById("year").value;
        const selectedCountry = document.getElementById("country").value;
        const selectedCategory =
          document.getElementById("bikes-category").value;
        const selectedAgeGroup = document.getElementById("age-group").value;
        const selectedGender = document.getElementById("gender").value;

        // Filter data berdasarkan pilihan dropdown
        const filteredData = data.filter((item) => {
          const itemQuarter = getQuarter(item.Date);

          return (
            (selectedQuarter === "All" || itemQuarter === selectedQuarter) &&
            (selectedYear === "All" || item.Year === selectedYear) &&
            (selectedCountry === "All" || item.Country === selectedCountry) &&
            (selectedCategory === "All" ||
              item.Sub_Category === selectedCategory) &&
            (selectedAgeGroup === "All" ||
              item.Age_Group === selectedAgeGroup) &&
            (selectedGender === "All" ||
              item.Customer_Gender === selectedGender)
          );
        });

        // Memproses data yang sudah difilter
        processFilteredData(filteredData);
      })
      .catch((error) => console.error("Error:", error));
  }

  // Fungsi untuk memproses data yang sudah difilter
  function processFilteredData(data) {
    // Mengelompokkan total transaksi berdasarkan bulan
    const transactionsByMonth = {};
    data.forEach((item) => {
      const month = item.Month;
      if (!transactionsByMonth[month]) {
        transactionsByMonth[month] = 1; // Inisialisasi total transaksi pada bulan tertentu dengan 1
      } else {
        transactionsByMonth[month]++; // Increment total transaksi pada bulan tertentu
      }
    });

    // Mengurutkan bulan secara alfanumerik
    const months = Object.keys(transactionsByMonth).sort((a, b) => {
      return new Date("2000-" + a + "-01") - new Date("2000-" + b + "-01");
    });

    // Mengambil total transaksi yang sesuai dengan urutan bulan
    const transactions = months.map((month) => transactionsByMonth[month]);

    // Update chart dengan data yang baru
    updateLineChart(months, transactions);
  }

  // Fungsi untuk membuat grafik garis atau memperbarui data pada grafik yang sudah ada
  function updateLineChart(labels, data) {
    const ctx = document.getElementById("lineChart2").getContext("2d");
    if (lineChart) {
      lineChart.destroy(); // Hancurkan chart yang ada jika sudah ada
    }
    lineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Transactions by Month",
            data: data,
            borderColor: "blue",
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }

  // Fungsi untuk mendapatkan kuartal dari tanggal
  function getQuarter(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    if (month <= 3) {
      return "Quarters 1";
    } else if (month <= 6) {
      return "Quarters 2";
    } else if (month <= 9) {
      return "Quarters 3";
    } else {
      return "Quarters 4";
    }
  }

  // Panggil applyFilters saat halaman pertama kali dimuat
  applyFilters();
});
