const input = document.getElementById('file');
const send = document.getElementById('send-btn');
const result = document.getElementById('result');

send.addEventListener('click', async () => {
    if (! input.files.length) {
        return;
    }

    result.innerHTML = '';

    const file = input.files[0];
    const path = (window.URL || window.webkitURL).createObjectURL(file);

    const dpi = 72;
    const permanent = 25.4;
    
    const pagesCoordinates = [];
    const tasks = pdfjsLib.getDocument(path);
    
    tasks.promise.then(function (pdf) {
        for (let pageNumber = pdf._pdfInfo.numPages; pageNumber <= pdf._pdfInfo.numPages; pageNumber++) {
            pdf.getPage(pageNumber).then(async function (page) {
                const viewport = await page.getViewport({ scale: 1 });
                const content = await page.getTextContent();
    
                content?.items?.forEach(item => {
                    const json = {
                        txt: item?.str,
                        x: item?.transform[4] * permanent / dpi,
                        y: (viewport.height - item?.height - item?.transform[5]) * permanent / dpi,
                    };

                    ! (item?.str?.trim()) || [
                        pagesCoordinates.push(json),
                        result.innerHTML += JSON.stringify(json, undefined, 2),
                    ];
                });
            });
        }
    });
});
