document.addEventListener("DOMContentLoaded", function() {
    let stackedBarChart; // Variabel untuk menyimpan objek chart
  
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
                const selectedCategory = document.getElementById("bikes-category").value;
                const selectedAgeGroup = document.getElementById("age-group").value;
                const selectedGender = document.getElementById("gender").value;
                const selectedCountry = document.getElementById("country").value;
  
                // Filter data berdasarkan pilihan dropdown
                const filteredData = data.filter((item) => {
                    const itemQuarter = getQuarter(item.Date);
  
                    return (
                        (selectedQuarter === "All" || itemQuarter === selectedQuarter) &&
                        (selectedYear === "All" || item.Year === selectedYear) &&
                        (selectedCategory === "All" || item.Sub_Category === selectedCategory) &&
                        (selectedAgeGroup === "All" || item.Age_Group === selectedAgeGroup) &&
                        (selectedGender === "All" || item.Customer_Gender === selectedGender) &&
                        (selectedCountry === "All" || item.Country === selectedCountry)
                    );
                });
  
                // Memproses data yang sudah difilter
                processFilteredData(filteredData);
            })
            .catch((error) => console.error("Error:", error));
    }
  
    // Fungsi untuk memproses data yang sudah difilter
    function processFilteredData(data) {
        // Mengelompokkan total keuntungan berdasarkan negara
        const profitByCountry = {};
        data.forEach((item) => {
            const country = item.Country;
            const profit = parseFloat(item.Total_Profit);
            if (!profitByCountry[country]) {
                profitByCountry[country] = profit;
            } else {
                profitByCountry[country] += profit;
            }
        });
  
        const profitByCountrySorted = Object.entries(profitByCountry).sort((a, b) => b[1] - a[1]);
        const countries = profitByCountrySorted.map((item) => item[0]);
        const profits = profitByCountrySorted.map((item) => item[1]);
  
        // Update chart dengan data yang baru
        updateStackedBarChart(countries, profits);
    }
  
    // Fungsi untuk membuat stacked bar chart atau memperbarui data pada chart yang sudah ada
    function updateStackedBarChart(labels, data) {
        const ctx = document.getElementById("barChart2").getContext("2d");
        if (stackedBarChart) {
            stackedBarChart.destroy(); // Hancurkan chart yang ada jika sudah ada
        }
        stackedBarChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Total Profit by Country",
                        data: data,
                        backgroundColor: "blue",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                indexAxis: "y",
                // Elements options apply to all of the options unless overridden in a dataset
                // In this case, we are setting the border of each horizontal bar to be 2px wide
                elements: {
                    bar: {
                        borderWidth: 2,
                    },
                },
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    },
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
  