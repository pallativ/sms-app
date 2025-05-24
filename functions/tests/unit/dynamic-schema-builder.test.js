const DynamicSchemaBuilder = require('../../src/schema/dynamic-schema-builder');

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
                //console.log('Error object:', result.error);
                //console.log('Validate Method Result:', result.value);
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

    describe('Building schema for date types.', () => {
        test('Create Schema and validate - Date', () => {
            const fields = [
                { name: 'createdAt', type: 'date', required: true, multiple: false }
            ];

            const schema = builder.buildSchema(fields);

            // Valid date
            {
                const { error, value } = schema.validate({ createdAt: new Date('2023-01-01') });
                expect(error).toBeFalsy();
                expect(value).toEqual({ createdAt: new Date('2023-01-01') });
            }

            // Invalid date (string)
            {
                const { error } = schema.validate({ createdAt: 'not-a-date' });
                expect(error).toBeTruthy();
            }

            // Missing required date
            {
                const { error } = schema.validate({});
                expect(error).toBeTruthy();
            }
        });

        test('Create Schema and validate - Date & Default Value', () => {
            const defaultDate = new Date('2022-12-31');
            const fields = [
                { name: 'createdAt', type: 'date', required: false, multiple: false, default_value: defaultDate }
            ];

            const schema = builder.buildSchema(fields);

            // Provided date
            {
                const { error, value } = schema.validate({ createdAt: new Date('2023-01-01') });
                expect(error).toBeFalsy();
                expect(value).toEqual({ createdAt: new Date('2023-01-01') });
            }

            // No date provided, should use default
            {
                const { error, value } = schema.validate({});
                expect(error).toBeFalsy();
                // Compare ISO strings for equality
                expect(value.createdAt.toISOString()).toBe(defaultDate.toISOString());
            }
        });
    });

    describe('Building schema for email types.', () => {
        test('Create Schema and validate - Email', () => {
            const fields = [
                { name: 'email', type: 'email', required: true, multiple: false }
            ];
            const schema = builder.buildSchema(fields);
            // Valid email
            {
                const { error, value } = schema.validate({ email: 'abc@gmail.com' });
                expect(error).toBeFalsy();
                expect(value).toEqual({ email: 'abc@gmail.com' });
            };

            // no email
            {
                const { error, value } = schema.validate({ email: 'abcded' });
                expect(error).toBeTruthy();
            };

            // no email
            {
                const { error, value } = schema.validate({});
                expect(error).toBeTruthy();
            };
        });
        test('Create Schema and validate - Email & Default Value', () => {
            const fields = [
                {
                    name: 'email', type: 'email', required: false, multiple: false, default_value: 'abc@gmail.com'
                }
            ];
            const schema = builder.buildSchema(fields);

            {
                const { error, value } = schema.validate({ email: 'abc1@gmail.com' });
                expect(error).toBeFalsy();
                expect(value).toEqual({ email: 'abc1@gmail.com' });
            }

            // default value behaviour
            {
                const { error, value } = schema.validate({});
                expect(error).toBeFalsy();
                expect(value).toEqual({ email: 'abc@gmail.com' });
            }
        });
    });

    describe('Building schema for enum types.', () => {
        let schema;
        const fields = [{
            name: 'status',
            type: 'enum',
            required: true,
            multiple: false,
            options: [
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Pending', value: 'pending' }
            ],
            default_value: 'active'
        }];
        beforeEach(() => {
            schema = builder.buildSchema(fields);
        });
        test('Create schema and validate - enum', () => {
            // Valid enum value
            {
                const { error, value } = schema.validate({ status: 'active' });
                expect(error).toBeFalsy();
                expect(value).toEqual({ status: 'active' });
            }
        });

        test('Create schema and validate - enum & Default Value', () => {
            var localFields = [...fields];
            localFields[0].required = false;
            var localSchema = builder.buildSchema(localFields);
            // No enum value provided, should use default
            const { error, value } = localSchema.validate({});
            expect(error).toBeFalsy();
            expect(value).toEqual({ status: 'active' });
        });

        test("Verify missing enum attribute", () => {
            // Missing required enum value
            const { error, value } = schema.validate({});
            expect(error).toBeFalsy();
            expect(value).toEqual({ status: 'active' });
        });

        test("Verify invalid enum value", () => {
            // Invalid enum value
            const { error } = schema.validate({ status: 'archived' });
            expect(error).toBeTruthy();
            expect(error.details[0].message).toBe('"status" must be one of [active, inactive, pending]');
        });

        test("Verify multiple enum values", () => {
            const fields = [{
                name: 'status',
                type: 'enum',
                required: true,
                multiple: true,
                options: [
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                    { label: 'Pending', value: 'pending' }
                ],
                default_value: ['active']
            }];
            const schema = builder.buildSchema(fields);
            // Valid enum values
            {
                const { error, value } = schema.validate({ status: ['active', 'inactive'] });
                expect(error).toBeFalsy();
                expect(value).toEqual({ status: ['active', 'inactive'] });
            }
            // Invalid enum values
            {
                const { error } = schema.validate({ status: ['archived'] });
                expect(error).toBeTruthy();
                expect(error.details[0].message).toBe('"status[0]" must be one of [active, inactive, pending]');
            }
        });
    });

    describe("Building schema for multiple types", () => {
        test("Verify multiple types", () => {
            const fields = [
                { name: 'age', type: 'number', required: true, multiple: false },
                { name: 'isActive', type: 'boolean', required: true, multiple: false },
                { name: 'createdAt', type: 'date', required: true, multiple: false },
                { name: 'email', type: 'email', required: true, multiple: false, default_value: 'abc@gmail.com' },
                { name: 'status', type: 'enum', required: false, multiple: false, options: [{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }], default_value: 'active' }
            ];

            // Test with all required fields
            {
                const schema = builder.buildSchema(fields);
                const { error, value } = schema.validate({ age: 25, isActive: true, email: 'pkondalu@gmail.com', createdAt: new Date('2023-01-01') });
                expect(error).toBeFalsy();
                expect(value).toEqual({ age: 25, isActive: true, email: 'pkondalu@gmail.com', createdAt: new Date("2023-01-01"), status: 'active' });
            }

            // Test with missing required fields
            {
                fields[3].required = false;
                const schema = builder.buildSchema(fields);
                const { error, value } = schema.validate({ age: 25, isActive: true, createdAt: new Date('2023-01-01') });
                expect(error).toBeFalsy();
                expect(value).toEqual({ age: 25, isActive: true, email: 'abc@gmail.com', createdAt: new Date("2023-01-01"), status: 'active' });
            }
        });
    });
});

