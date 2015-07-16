export class Home {
    constructor () {
        this.text = 'hello world';
        this.sampleConfig = [
            {
                field: 'name',
                header: {
                    title: 'Name'
                },
                cell: {
                    template: '$field + ": " + $row.dob'
                }
            },
            {
                field: 'dob',
                header: {
                    title: 'Date of Birth'
                }
            }
        ]
        this.sampleData = [
            {
                name: 'Chris',
                dob: '1989-09-23'
            },
            {
                name: 'Rachel',
                dob: '1990-02-20'
            }
        ];
    }
}
