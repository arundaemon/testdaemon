
const numOperator = [
    { label: "Equals", value: "equals",default:true },
    { label: "Does not equal", value: "notEquals",default:false },
    { label: "Greater than", value: "gt",default:false },
    { label: "Greater than or equal to", value: "gte" ,default:false},
    { label: "Less than", value: "lt" ,default:false},
    { label: "Less than or equal to", value: "lte" ,default:false},
]


const strOperator = [
    { label: "Custom filter list", value: "equals" ,default:true},
    { label: "Filter list", value: "equals" ,default:false},    
    { label: "Does not equal", value: "notEquals" ,default:false},
    { label: "Contains", value: "contains" ,default:false},
    { label: "Does not contain", value: "notContains" ,default:false},
    
];

const timeOperator = [
    { label: "In Date Range", value: "inDateRange"  ,default:true},
    { label: "Not In Date Range", value: "notInDateRange" ,default:false},
    { label: "Before Date", value: "beforeDate" ,default:false},
    { label: "After Date", value:  "afterDate" ,default:false},
    
]

const defaultOperator = [
    { label: "Equals", value: "equals" ,default:true},
    { label: "Does not equal", value: "notEquals" ,default:false},
]


module.exports = {
    numOperator,
    strOperator,
    timeOperator,
    defaultOperator
}