export function download(payload) {

    const blob =
        new Blob([payload], {
            type: "application/xml"
        });

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download = "payload.xml";

    a.click();

    URL.revokeObjectURL(url);
}