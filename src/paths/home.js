export class Home {
    constructor (ViewCompiler, resources, Container) {
        this.editable = {
            name: 'Ed',
            dob: '1987-06-05',
            test: [1,2,3,6]
        };

        this.sampleConfig = [
            {
                field: 'name',
                width: 120,
                colClass: 'first',
                header: {
                    title: 'Name'
                }
            },
            {
                field: 'dob',
                header: {
                    title: 'Date of Birth',
                    draggable: true
                }
            },
            {
                field: 'test',
                header: {
                    title: 'Test',
                    sortBy: (a, b) => a.test.length - b.test.length,
                    draggable: true
                },
                cell: {
                    template: '<span>${field.join(",")}</span>'
                }
            }
        ]
        this.sampleData = [
            {
                name: 'Chris',
                dob: '1989-09-23',
                test: [1,2]
            },
            {
                name: 'Rachel',
                dob: '1990-02-20',
                test: [1,2,3]
            },
            {
                name: 'Jeff',
                dob: '1959-01-06',
                test: []
            },
            {
                name: 'Dan',
                dob: '1990-05-19',
                test: [1]
            },
            {
                name: 'George',
                dob: '1931-03-12',
                test: [1,2,3,4,5,6]
            },
            this.editable
        ];
        // setTimeout( () => {
        //     this.sampleData.push({
        //         name: 'Riley',
        //         dob: '1992-10-30',
        //         test: [1,2,3,4]
        //     });
        //     this.sampleData.push({
        //         name: 'Amy',
        //         dob: '1960-10-06',
        //         test: [1,2,3,5,6]
        //     });
        // }, 3000);
    }
    attached () {
        var el = '<div>${text}</div>';
    }
}
