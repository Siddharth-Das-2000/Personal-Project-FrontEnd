const API_BASE_URL =
    "https://personal-projects-ppe8.onrender.com";

async function fetchLogs() {

    try {

        const response =
            await fetch(`${API_BASE_URL}/logs`);

        const data = await response.json();

        updateCounters(data);

        renderTable(data.logs);

    } catch (error) {

        console.error("Error fetching logs:", error);
    }
}

function updateCounters(data) {

    document.getElementById("totalCount")
        .innerText = data.totalCount;

    document.getElementById("errorCount")
        .innerText = data.errorCount;
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

        row.innerHTML = `

            <td>${log.id}</td>

            <td>${log.timestamp}</td>

            <td>
                <pre>${escapeHtml(log.payload)}</pre>
            </td>

            <td>
                <button onclick='downloadXml(${JSON.stringify(log.payload)})'>
                    Download
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function downloadXml(payload) {

    const blob =
        new Blob([payload], {
            type: "application/xml"
        });

    const url =
        window.URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        `payload-${Date.now()}.xml`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
}

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.innerText = text;

    return div.innerHTML;
}

fetchLogs();

setInterval(fetchLogs, 3000);