const Joi = require('joi');

class DynamicSchemaBuilder {
    constructor() {
    }

    buildSchema(fieldList) {
        const schemaMap = {};

        fieldList.forEach(field => {
            const { name, code, type, required, multiple, options, default_value } = field;
            let joiField = this.getFieldType(type, options, multiple);

            // Add required behaviour.
            joiField = required ? joiField.required() : joiField.optional();

            // Handle default value behaviour.
            if (default_value !== undefined) {
                joiField = joiField.default(default_value);
            }


            schemaMap[code] = joiField;
        });

        return Joi.object(schemaMap);
    }

    getFieldType(type, options, multiple) {
        let joiField;

        switch (type.toLowerCase()) {
            case 'string':
                joiField = Joi.string().empty(''); // Treat empty strings as undefined
                break;
            case 'number':
                joiField = Joi.number();
                break;
            case 'boolean':
                joiField = Joi.boolean();
                break;
            case 'date':
                joiField = Joi.date(); // Accepts ISO strings or Date objects
                break;
            case 'email':
                joiField = Joi.string().email(); // Accepts ISO strings or Date objects
                break;
            case 'enum': {
                const values = options.map(opt => opt.value);
                if (multiple) {
                    joiField = Joi.array().items(Joi.valid(...values));
                } else {
                    joiField = Joi.valid(...values);
                }
                break;
            }
            default:
                joiField = Joi.any();
        }

        return joiField;
    }
}

module.exports = DynamicSchemaBuilder;
