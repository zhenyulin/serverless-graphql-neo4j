import { graphql } from 'graphql';

import driver from 'lib/neo4j';
import { emptyData, loadData } from 'lib/load-data';
import schema from 'graphql/schema';

const testCases = cases =>
	Object.keys(cases).map(caseName =>
		it(caseName, async () => {
			const query = cases[caseName];
			const result = await graphql(schema, query);
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

	describe('User', () => {
		testCases({
			'get user by id': `
				query {
					User(id: "4edd40c86762e0fb12000003") {
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
			'get similarUserLiked': `
				query {
					User(id: "4edd40c86762e0fb12000004") {
						similarUsersLiked {
							name
						}
					}
				}
			`,
			'return null if user not found': `
				query {
					User(id: "4edd40c86762e0fb12000099") {
						id
						name
					}
				}
			`,
			'throw error if id is not provided': `
				query {
					User() {
						id
						name
					}
				}
			`,
			'throw error if id is not valid id': `
				query {
					User(id: "random") {
						id
						name
					}
				}
			`,
		});
	});

	describe('Users', () => {
		testCases({
			'get all users': `
				query {
					Users {
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

	describe('Item', () => {
		testCases({
			'get item by id': `
				query {
					Item(id: "4edd40c86762e0fb12000015") {
						id
						name
						likedByUsers {
							name
						}
					}
				}
			`,
			'get item.ratedByUsers': `
				query {
					Item(id: "4edd40c86762e0fb12000014") {
						ratedByUsers {
							user {
								name
							}
							rating
						}
					}
				}
			`,
			'get item.averageRating': `
				query {
					Item(id: "4edd40c86762e0fb12000014") {
						averageRating
					}
				}
			`,
			'return null if item not found': `
				query {
					Item(id: "4edd40c86762e0fb12000099") {
						id
						name
					}
				}
			`,
			'throw error if id is not provided': `
				query {
					Item() {
						id
						name
					}
				}
			`,
			'throw error if id is not valid id': `
				query {
					Item(id: "random") {
						id
						name
					}
				}
			`,
		});
	});

	describe('Items', () => {
		testCases({
			'get all items': `
				query {
					Items {
						id
						name
						likedByUsers {
							name
						}
					}
				}
			`,
		});
	});
});
