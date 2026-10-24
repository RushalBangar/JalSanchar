/**
 * JalSanchar V2 - Chart.js Hydrological Visualizer
 * Creates 14-day water forecast charts with shaded low/expected/high bands.
 */

(function (window) {
  "use strict";

  const JalCharts = {
    /**
     * Renders a 14-day water depletion & storage forecast chart with confidence bands.
     * @param {HTMLCanvasElement} canvas
     * @param {Array<{day: number, low: number, expected: number, high: number}>} dailyData
     * @param {string} [unit='Days of Water Left']
     */
    renderForecastChart(canvas, dailyData, unit = "Days of Water Left") {
      if (!canvas || !window.Chart) {
        console.warn("[JalCharts] Canvas or Chart.js not available.");
        return null;
      }

      const existingChart = Chart.getChart(canvas);
      if (existingChart) {
        existingChart.destroy();
      }

      const labels = dailyData.map((d) => `Day +${d.day}`);
      const lowData = dailyData.map((d) => Number(d.low.toFixed(1)));
      const expectedData = dailyData.map((d) => Number(d.expected.toFixed(1)));
      const highData = dailyData.map((d) => Number(d.high.toFixed(1)));

      const ctx = canvas.getContext("2d");

      return new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Worst Case (Low)",
              data: lowData,
              borderColor: "#E67E22", // Warning Amber
              borderWidth: 1.5,
              borderDash: [4, 4],
              pointRadius: 0,
              fill: false
            },
            {
              label: "Expected Trajectory",
              data: expectedData,
              borderColor: "#148F77", // Water Teal
              backgroundColor: "rgba(20, 143, 119, 0.15)",
              borderWidth: 2.5,
              pointRadius: 3,
              pointBackgroundColor: "#148F77",
              pointHoverRadius: 6,
              fill: "-1" // Fill between Expected and Low
            },
            {
              label: "Best Case (High)",
              data: highData,
              borderColor: "#27AE60", // Success Green
              backgroundColor: "rgba(39, 174, 96, 0.12)",
              borderWidth: 1.5,
              borderDash: [4, 4],
              pointRadius: 0,
              fill: "-1" // Fill between High and Expected
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false
          },
          plugins: {
            legend: {
              position: "top",
              labels: {
                boxWidth: 12,
                font: { family: "'Source Sans 3', sans-serif", size: 12, weight: 600 },
                color: "#1F2937"
              }
            },
            tooltip: {
              backgroundColor: "#1A5276",
              titleFont: { family: "'Outfit', sans-serif", size: 13, weight: 700 },
              bodyFont: { family: "'IBM Plex Mono', monospace", size: 12 },
              padding: 10,
              cornerRadius: 6,
              callbacks: {
                label(context) {
                  return ` ${context.dataset.label}: ${context.parsed.y} days remaining`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                font: { family: "'IBM Plex Mono', monospace", size: 11 },
                color: "#4B5563"
              }
            },
            y: {
              min: 0,
              grid: { color: "rgba(0, 0, 0, 0.06)" },
              title: {
                display: true,
                text: unit,
                font: { family: "'Source Sans 3', sans-serif", size: 12, weight: 600 },
                color: "#374151"
              },
              ticks: {
                font: { family: "'IBM Plex Mono', monospace", size: 11 },
                color: "#4B5563"
              }
            }
          }
        }
      });
    }
  };

  window.JalCharts = JalCharts;
})(window);
