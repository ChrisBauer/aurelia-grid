export class Home {
    constructor (ViewCompiler, resources, Container) {
        this.text = 'hello world';
        this.sampleConfig = [
            {
                field: 'name',
                header: {
                    title: 'Name'
                }
            },
            {
                field: 'dob',
                header: {
                    title: 'Date of Birth'
                }
            },
            {
                field: 'test',
                header: {
                    title: 'Test',
                    sortBy: function (a, b) {
                        return a.length > b.length;
                    }
                },
                cell: {
                    template: '<span>${field.length}</span>'
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
            }
        ];
        setTimeout( () => {
            this.sampleData.push({
                name: 'Riley',
                dob: '1992-10-30',
                test: [1,2,3,4]
            });
            this.sampleData.push({
                name: 'Amy',
                dob: '1960-10-06',
                test: [1,2,3,5,6]
            });
        }, 3000);
    }
    attached () {
        var el = '<div>${text}</div>';
    }
}
