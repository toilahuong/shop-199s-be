const data = [
    {
        "id": 7,
        "attributes": [
            {
                "value": 8,
                "label": "S"
            },
            {
                "value": 9,
                "label": "M"
            }
        ]
    },
    {
        "id": 6,
        "attributes": [
            {
                "value": 11,
                "label": "Đỏ"
            }
        ]
    }
];
let A = [];
function print() {
    console.table(A);
}
function back_track(i) {
    for (let j = 0; j < data[i].attributes.length; j++) {
        A[i] = data[i].attributes[j];
        if(i === data.length-1) {
            print();
        } else {
            back_track(i+1);
        }
    }
}
function main() {
    back_track(0);
}
main();