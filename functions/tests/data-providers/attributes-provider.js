const ValidAttributes = {
    FirstNameAttribute: {
        name: "First Name",
        code: "firstName",
        type: "string",
        required: true,
        order: 5,
        default: "",
        multiselect: false
    },
    LastNameAttribute: {
        name: "Last Name",
        code: "lastName",
        type: "string",
        required: true,
        order: 6,
        default: "",
        multiselect: false
    },
    MobileAttribute: {
        name: "Mobile",
        code: "mobile",
        type: "string",
        required: false,
        order: 7,
        default: "",
        multiselect: false
    },
    EmailAttribute: {
        name: "Email",
        code: "email",
        type: "string",
        required: false,
        order: 8,
        default: "",
        multiselect: false
    },
    StatusAttribute: {
        name: "Status",
        code: "status",
        type: "enum",
        required: true,
        order: 0,
        default: "active",
        multiselect: false,
        options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" }
        ]
    },
    StartDateAttribute: {
        name: "Start Date",
        code: "startDate",
        type: "date",
        required: false,
        order: 1,
        default: null,
        multiselect: false
    },
    IsFeaturedAttribute: {
        name: "Is Featured",
        code: "isFeatured",
        type: "boolean",
        required: false,
        order: 2,
        default: false,
        multiselect: false
    },
    PriorityAttribute: {
        name: "Priority",
        code: "priority",
        type: "number",
        required: false,
        order: 3,
        default: 1,
        multiselect: false
    },
    TagsAttribute: {
        name: "Tags",
        code: "tags",
        type: "string",
        required: false,
        order: 4,
        default: "",
        multiselect: true
    }
};
module.exports = {
    ValidAttributes
}
