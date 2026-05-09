const API_BASE_URL =
    "https://personal-projects-ppe8.onrender.com/api";

let chart;

let currentLogs = [];

async function fetchLogs() {

    try {

        const response =
            await fetch(`${API_BASE_URL}/logs`);

        const data = await response.json();

        currentLogs = data.logs;

        updateCounters(data);

        renderChart(data);

        renderTable(data.logs);

    } catch (error) {

        console.error(error);
    }
}

function updateCounters(data) {

    const successCount =
        data.totalCount - data.errorCount;

    document.getElementById("totalCount")
        .innerText = data.totalCount;

    document.getElementById("successCount")
        .innerText = successCount;

    document.getElementById("errorCount")
        .innerText = data.errorCount;
}

function renderChart(data) {

    const successCount =
        data.totalCount - data.errorCount;

    const ctx =
        document.getElementById("statusChart");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {

        type: 'pie',

        data: {

            labels: ['Success', 'Error'],

            datasets: [{
                data: [successCount, data.errorCount]
            }]
        }
    });
}

function renderTable(logs) {

    const tableBody =
        document.getElementById("tableBody");

    tableBody.innerHTML = "";

    logs.forEach(log => {

        const row =
            document.createElement("tr");

        if (log.error) {
            row.classList.add("error-row");
        }

        const status =
            log.error ? "ERROR" : "SUCCESS";

        const shortPayload =
            log.payload.length > 150
                ? log.payload.substring(0, 150) + "..."
                : log.payload;

        row.innerHTML = `

            <td>${log.id}</td>

            <td>${formatISTDate(log.timestamp)}</td>

            <td>${status}</td>

            <td>

                <div class="payload-preview">
                    ${escapeHtml(shortPayload)}
                </div>

                <button class="expand-btn"
                    onclick="toggleLog('log-${log.id}')">

                    Expand
                </button>

                <div class="full-log"
                    id="log-${log.id}">

                    <pre>${escapeHtml(log.payload)}</pre>

                </div>

            </td>
        `;

        tableBody.appendChild(row);
    });
}

function toggleLog(id) {

    const element =
        document.getElementById(id);

    if (element.style.display === "block") {

        element.style.display = "none";

    } else {

        element.style.display = "block";
    }
}

function formatISTDate(timestamp) {

    return new Date(timestamp)
        .toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata"
        });
}

function downloadDailyLogs() {

    let xmlContent = "";

    currentLogs.forEach(log => {

        xmlContent += `

<!-- ${log.timestamp} -->

${log.payload}

`;
    });

    const blob =
        new Blob([xmlContent], {
            type: "application/xml"
        });

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        `sap-cpi-logs-${new Date().toISOString().split('T')[0]}.xml`;

    a.click();

    URL.revokeObjectURL(url);
}

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.innerText = text;

    return div.innerHTML;
}

fetchLogs();