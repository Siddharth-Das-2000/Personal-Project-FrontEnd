const API_BASE_URL =
    "https://personal-projects-ppe8.onrender.com/api";

let chart;

let currentLogs = [];

let currentPage = 1;

const logsPerPage = 10;

async function fetchLogs() {

    try {

        const response =
            await fetch(`${API_BASE_URL}/logs`);

        const data =
            await response.json();

        currentLogs = data.logs.reverse();

        updateCounters(data);

        renderChart(data);

        renderTable();

        renderPagination();

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

function renderTable() {

    const tableBody =
        document.getElementById("tableBody");

    tableBody.innerHTML = "";

    const start =
        (currentPage - 1) * logsPerPage;

    const end =
        start + logsPerPage;

    const paginatedLogs =
        currentLogs.slice(start, end);

    paginatedLogs.forEach(log => {

        const row =
            document.createElement("tr");

        if (log.error) {
            row.classList.add("error-row");
        }

        const shortPayload =
            log.payload.length > 120
                ? log.payload.substring(0, 120) + "..."
                : log.payload;

        row.innerHTML = `

            <td>${log.id}</td>

            <td>${formatISTDate(log.timestamp)}</td>

            <td>
                ${log.error ? 'ERROR' : 'SUCCESS'}
            </td>

            <td>

                <div class="payload-preview">

                    ${escapeHtml(shortPayload)}

                    <span class="expand-icon"
                        onclick="toggleLog('log-${log.id}')">

                        ▼
                    </span>

                </div>

                <div class="full-log"
                    id="log-${log.id}">

                    <pre>${escapeHtml(log.payload)}</pre>

                </div>

            </td>
        `;

        tableBody.appendChild(row);
    });
}

function renderPagination() {

    const pagination =
        document.getElementById("pagination");

    pagination.innerHTML = "";

    const totalPages =
        Math.ceil(currentLogs.length / logsPerPage);

    for (let i = 1; i <= totalPages; i++) {

        const button =
            document.createElement("button");

        button.innerText = i;

        button.classList.add("page-btn");

        button.onclick = () => {

            currentPage = i;

            renderTable();
        };

        pagination.appendChild(button);
    }
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