module.exports = {
    formate: 'A4',
    orientation: 'portrait',
    border: '2mm',
    zoomFactor: ".5",
    header: {
        height: '5mm',
        contents: '<h4 style=" color: red;font-size:20;font-weight:800;text-align:center;">Class Routine</h4>'
    },
    footer: {
        height: '5mm',
        contents: {
            first: 'Cover page',
            2: 'Second page',
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', 
            last: 'Last Page'
        }
    }
}