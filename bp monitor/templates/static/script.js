window.addEventListener('DOMContentLoaded', () => {
    const bpForm = document.getElementById('bpForm');
    const analysisText = document.getElementById('analysis');

    function getReadingsFromTable() {
        const rows = document.getElementById('bpTable').rows;
        const dates = [], sys = [], dia = [], colors = [];

        for (let r of rows) {
            const s = parseInt(r.cells[1].innerText);
            const d = parseInt(r.cells[2].innerText);
            dates.push(r.cells[0].innerText);
            sys.push(s);
            dia.push(d);

            if (s <= 120 && d <= 80) colors.push("green");
            else if (s <= 140 && d <= 90) colors.push("yellow");
            else colors.push("red");
        }

        return { dates, sys, dia, colors };
    }

    const ctx = document.getElementById('bpChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                { label: "Systolic", data: [], borderColor: "#007bff", pointRadius: 6, pointBackgroundColor: [] },
                { label: "Diastolic", data: [], borderColor: "#28a745", pointRadius: 6, pointBackgroundColor: [] }
            ]
        }
    });

    function updateChart() {
        const d = getReadingsFromTable();
        chart.data.labels = d.dates;
        chart.data.datasets[0].data = d.sys;
        chart.data.datasets[0].pointBackgroundColor = d.colors;
        chart.data.datasets[1].data = d.dia;
        chart.data.datasets[1].pointBackgroundColor = d.colors;
        chart.update();
    }

    updateChart();

    bpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const s = parseInt(document.getElementById("systolic").value);
        const d = parseInt(document.getElementById("diastolic").value);

        if (s <= 120 && d <= 80) analysisText.innerText = "Normal BP. Healthy lifestyle maintained!";
        else if (s <= 140 && d <= 90) analysisText.innerText = "Elevated BP. Monitor regularly.";
        else analysisText.innerText = "High BP! Consult a doctor.";

        bpForm.submit();
        setTimeout(updateChart, 200);
    });
});
