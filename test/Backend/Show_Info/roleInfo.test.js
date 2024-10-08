const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const pool = require('../../../app/backend/db/index.js');
const { getLatestYear } = require('../../../app/backend/services/latestYear.js');
const { getServiceInfo } = require('../../../app/backend/services/ShowInfo/roleInfo.js');

jest.mock('../../../app/backend/db/index.js');
jest.mock('../../../app/backend/services/latestYear.js');

describe('getServiceInfo', () => {
    let req;

    beforeEach(() => {
        req = {
            query: {
                serviceRoleId: '1'
            }
        };
        pool.query = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return service info with the correct structure', async () => {
        getLatestYear.mockResolvedValueOnce('2023');
        pool.query
            .mockResolvedValueOnce({
                rows: [
                    {
                        stitle: 'Role Title',
                        description: 'Role Description',
                        dname: 'Department Name'
                    }
                ]
            }) // First query
            .mockResolvedValueOnce({
                rows: [{ exists: true }]
            }) // Second query
            .mockResolvedValueOnce({
                rows: [
                    {
                        UBCId: '12345678',
                        year: '2022',
                        full_name: 'John Doe'
                    },
                    {
                        UBCId: '87654321',
                        year: '2021',
                        full_name: 'Jane Smith'
                    }
                ]
            }); // Third query

        const result = await getServiceInfo(req);

        expect(pool.query).toHaveBeenNthCalledWith(1, expect.any(String), ['1']);
        expect(pool.query).toHaveBeenNthCalledWith(2, expect.any(String), ['1', '2023']);
        expect(pool.query).toHaveBeenNthCalledWith(3, expect.any(String), ['1', '2023']);

        expect(result).toEqual({
            currentPage: 1,
            perPage: 5,
            roleID: '1',
            assigneeCount: 2,
            roleName: 'Role Title',
            roleDescription: 'Role Description',
            department: 'Department Name',
            exists: true,
            assignees: [
                {
                    instructorID: '12345678',
                    name: 'John Doe',
                    year: '2022'
                },
                {
                    instructorID: '87654321',
                    name: 'Jane Smith',
                    year: '2021'
                }
            ],
            latestYear: '2023'
        });
    });

    it('should handle database query errors', async () => {
        getLatestYear.mockResolvedValueOnce('2023');
        pool.query.mockRejectedValueOnce(new Error('Test error'));

        console.error = jest.fn();

        await expect(getServiceInfo(req)).rejects.toThrow('Test error');
        expect(console.error).toHaveBeenCalledWith('Database query error:', expect.any(Error));
    });
});
