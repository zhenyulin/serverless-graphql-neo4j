import { graphql } from 'graphql';

import driver, { runCypher } from 'lib/neo4j';
import { emptyData, loadData } from 'lib/load-data';
import schema from 'graphql/schema';

const testQuery = async query => {
	const result = await graphql(schema, query, null, { driver });
	expect(result).toMatchSnapshot();
};

describe('Mutation', () => {
	beforeEach(async () => {
		await emptyData();
		await loadData();
	});

	afterAll(async () => {
		driver.close();
	});

	describe('CreateUser', () => {
		it('return the created user', async () => {
			const initState = await runCypher(`
				MATCH (u:User { email: "jack.daniel@test.com" })
				RETURN u
			`);
			expect(initState).toHaveLength(0);
			await testQuery(`
				mutation {
					CreateUser(name: "Jack Daniel", email: "jack.daniel@test.com") {
						name
					}
				}
			`);
			const result = await runCypher(`
				MATCH (u:User { email: "jack.daniel@test.com" })
				RETURN u
			`);
			expect(result).toHaveLength(1);
		});

		it('throws error if email already existed', async () => {
			await testQuery(`
				mutation {
					CreateUser(name: "Jack Daniel", email: "john.cage@test.com") {
						name
						email
					}
				}
			`);
		});

		it('throws error if email is missing', async () => {
			await testQuery(`
				mutation {
					CreateUser(name: "Jack Daniel") {
						name
						email
					}
				}
			`);
		});
	});
});
