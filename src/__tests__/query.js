import { graphql } from 'graphql';

import driver from 'lib/neo4j';
import { emptyData, loadData } from 'lib/load-data';
import schema from 'graphql/schema';

const testCases = cases =>
	Object.keys(cases).map(caseName =>
		it(caseName, async () => {
			const query = cases[caseName];
			const result = await graphql(schema, query, null, { driver });
			expect(result).toMatchSnapshot();
		}),
	);

describe('Query', () => {
	beforeAll(async () => {
		await emptyData();
		await loadData();
	});

	afterAll(() => {
		driver.close();
	});

	describe('Users', () => {
		testCases({
			'get all users': `
				query {
					Users(orderBy: "name_desc") {
						id
						name
						followees {
							name
						}
						followers {
							name
						}
						likeItems {
							name
						}
					}
				}
			`,
		});
	});
});
