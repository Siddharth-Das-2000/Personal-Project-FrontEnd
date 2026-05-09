export function buildTableRow(log) {

    return `
        <tr class="${log.error ? 'error-row' : ''}">
            <td>${log.id}</td>
            <td>${log.timestamp}</td>
            <td><pre>${log.payload}</pre></td>
        </tr>
    `;
}