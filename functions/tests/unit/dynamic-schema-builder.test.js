const DynamicSchemaBuilder = require('../../src/schema/dynamicSchemaBuilder');

describe('DynamicSchemaBuilder', () => {
    let builder;

    beforeEach(() => {
        // instantiate a new builder before each test
        builder = new DynamicSchemaBuilder();
    });

    describe('Building schema for string types.', () => {
        test('Create Schema and validate - String', () => {
            // sample input representing a dynamic schema configuration
            const fields = [
                { name: 'UserName', type: 'string', required: true, multiple: false, default_value: 'Veera' },
            ];

            const schema = builder.buildSchema(fields);
            const { error } = schema.validate({ "UserName": 'JohnDoe' });
            expect(error).toBeFalsy();

            const { error1 } = schema.validate({});
            expect(error1).toBeFalsy();
        });

        test('Create Schema and validate - String & Default Value', () => {
            // sample input representing a dynamic schema configuration
            const fields = [
                { name: 'UserName', type: 'string', required: false, multiple: false, default_value: 'Veera' },
            ];

            const schema = builder.buildSchema(fields);
            const { error } = schema.validate({ "UserName": 'JohnDoe' });
            expect(error).toBeFalsy();

            const { error1, value } = schema.validate({});
            expect(error1).toBeFalsy();
            expect(value).toEqual({ UserName: 'Veera' });

        });

        test('Create Schema and validate - String & Options', () => {
            const fields = [
                {
                    name: 'sex',
                    type: 'enum',
                    required: false,
                    multiple: false,
                    options: [{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }],
                    default_value: 'Male'
                },
            ];

            let schema = builder.buildSchema(fields);

            {
                const result = schema.validate({ "sex": 'JohnDoe' });
                expect(result.error).toBeTruthy();
                expect(result.error.details[0].message).toBe("\"sex\" must be one of [Male, Female]");
            }

            {
                const result = schema.validate({ "sex": 'Male' });
                expect(result.error).toBeFalsy();
                console.log('Error object:', result.error);
                console.log('Validate Method Result:', result.value);
                expect(result.value).toEqual({ sex: 'Male' });
            }

            {
                const result = schema.validate({});
                expect(result.error).toBeFalsy();
                expect(result.value.sex).toBe("Male");
            }


            fields.required = true;
            schema = builder.buildSchema(fields);
            {
                const result = schema.validate({ "sex": 'Male' });
                expect(result.error).toBeFalsy();
            }
        });
    });

    describe('Building schema for number types.', () => {
        test('Create Schema and validate - Number', () => {
            const fields = [
                { name: 'age', type: 'number', required: true, multiple: false },
            ];

            const schema = builder.buildSchema(fields);
            const { error } = schema.validate({ "age": 25 });
            expect(error).toBeFalsy();

            {
                const { error, value } = schema.validate({});
                expect(error).toBeTruthy();
                // console.log('Error object:', error);
                // console.log('Validate Method Result:', value);
            }
        });

        test('Create Schema and validate - Number & Default Value', () => {
            const fields = [
                { name: 'age', type: 'number', required: false, multiple: false, default_value: 25 },
            ];

            const schema = builder.buildSchema(fields);
            const { error } = schema.validate({ "age": 30 });
            expect(error).toBeFalsy();

            const { error1, value } = schema.validate({});
            expect(error1).toBeFalsy();
            expect(value).toEqual({ age: 25 });
        });
    });

    describe('Building schema for boolean types.', () => {
        test('Create Schema and validate - Boolean', () => {
            const fields = [
                { name: 'isActive', type: 'boolean', required: true, multiple: false },
            ];

            const schema = builder.buildSchema(fields);
            {
                const { error, value } = schema.validate({ "isActive": true });
                expect(error).toBeFalsy();
                expect(value).toEqual({ isActive: true });
            }

            {
                const { error, value } = schema.validate({});
                expect(error).toBeTruthy();
            }
        });

        test('Create Schema and validate - Boolean & Default Value', () => {
            const fields = [
                { name: 'isActive', type: 'boolean', required: false, multiple: false, default_value: true },
            ];

            const schema = builder.buildSchema(fields);
            {
                const { error, value } = schema.validate({ "isActive": false });
                expect(error).toBeFalsy();
                expect(value).toEqual({ isActive: false });
            }

            {
                const { error, value } = schema.validate({});
                expect(error).toBeFalsy();
                expect(value).toEqual({ isActive: true });
            }
        });
    });
});

