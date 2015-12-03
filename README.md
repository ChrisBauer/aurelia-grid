# aurelia-grid

aurelia-grid is a simple, configurable, dynamic data grid using the Aurelia framework.

### features
*all are configurable per-column unless otherwise specified*
- sort, including custom comparators
- drag and drop columns
- custom cell views, including data binding
- custom column classes
- custom width

### example usage:

**sample.html**
```html
<aurelia-grid config.bind="config" data-model.bind="dataModel"></aurelia-grid>
```

**sample.js**
```js
this.dataModel = [
  { name: 'Chris', dob: '1987-06-05', arr: [1,2,3] },
  { name: 'Bauer', dob: '1975-03-01', arr: [1,2] }
];

this.sampleConfig = [
  { 
    field: 'name',
    width: 120
    colClass: 'first',
    header: { title: 'Name' }
  },
  {
    field: 'dob',
    header: { title: 'Date of Birth', draggable: true }
  },
  {
    field: 'arr',
    header: {
      title: 'Array',
      sortBy: (a, b) => a.arr.length - b.arr.length,
      draggable: true
    },
    cell: {
      template: '<span>${field.join('-')}</span>'
    }
  }
];
```
# config API

### configEntry

##### field (required)
the name of the field to set as the default for bindings

##### width (optional)
the width (in pixels) of the column when first laying out

##### colClass (optional)
a class to apply to the header and each cell in the column

### header

##### title (recommended)
default: *configEntry.field* with the first letter capitalized

the string for the title of the column

##### sortBy (optional)
default: the column will sort using lexicographically using .toString() on *configEntry.field*

takes either a field name or a comparator function. When using a field name,
it sorts by that field name instead of *configEntry.field*
When using a comparator function, the arguments are the entire row object, allowing for complex sorting of data

##### draggable (optional)
default: false

boolean that determines whether this column can participate on both ends of "drag" and "drop".

### cell

##### template
default: <span>${field}</span>

binding string (a la ${field}) or html string (<a href.bind="'/view/' + ${field}">${field}</a>).
The binding context is defined as 

```js
{
  field: row[cell.field], // the default data for this row
  row: row,               // the whole row object
  cell: cell              // the cell configuration object
}
```

# upcoming features

### coming soon

- resizable columns
- custom HTML in headers
- consumable jspm artifact
- unit tests

### coming later

- pagination
- filter
- in-line editable fields

### wishlist

- plugin model
- pre/post change callbacks
