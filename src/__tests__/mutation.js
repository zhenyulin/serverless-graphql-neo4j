import { graphql } from 'graphql';

import driver, { runCypher, runCypherOne } from 'lib/neo4j';
import { emptyData, loadData } from 'lib/load-data';
import schema from 'graphql/schema';

const testQuery = async query => {
	const result = await graphql(schema, query);
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
			const initState = await runCypherOne(`
				MATCH (u:User { email: "jack.daniel@test.com" })
				RETURN u
			`);
			expect(initState).toBe(undefined);
			await testQuery(`
				mutation {
					CreateUser(user: { name: "Jack Daniel", email: "jack.daniel@test.com" }) {
						name
						email
					}
				}
			`);
			const result = await runCypherOne(`
				MATCH (u:User { email: "jack.daniel@test.com" })
				RETURN u
			`);
			expect(result.email).toBe('jack.daniel@test.com');
		});

		it('throws error if email already existed', async () => {
			await testQuery(`
				mutation {
					CreateUser(user: { name: "Jack Daniel", email: "john.cage@test.com" }) {
						name
						email
					}
				}
			`);
		});

		it('throws error if email is missing', async () => {
			await testQuery(`
				mutation {
					CreateUser(user: { name: "Jack Daniel" }) {
						name
						email
					}
				}
			`);
		});
	});

	describe('UpdateUser', () => {
		it('return the updated user', async () => {
			await testQuery(`
				mutation {
					UpdateUser(id: "4edd40c86762e0fb12000004", user:  { name: "John Lemon" }){
						id
						name
					}
				}
			`);
			const result = await runCypherOne(`
				MATCH (u:User { id: "4edd40c86762e0fb12000004" })
				RETURN u
			`);
			expect(result.name).toBe('John Lemon');
		});
	});

	describe('DeleteUser', () => {
		it('return the deleted user', async () => {
			await testQuery(`
				mutation {
					DeleteUser(id: "4edd40c86762e0fb12000004"){
						id
						name
					}
				}
			`);
			const result = await runCypherOne(`
				MATCH (u:User { id: "4edd40c86762e0fb12000004" })
				RETURN u
			`);
			expect(result).toBe(undefined);
		});
	});

	describe('CreateItem', () => {
		it('return the created item', async () => {
			await testQuery(`
				mutation {
					CreateItem(item: { name: "2046" }){
						name
					}
				}
			`);
			const result = await runCypherOne(`
				MATCH (i:Item { name: "2046" })
				RETURN i
			`);
			expect(result).toMatchSnapshot();
		});

		it('throw error if name is missing', async () => {
			await testQuery(`
				mutation {
					CreateItem(item: {}){
						name
					}
				}
			`);
		});
	});

	describe('UpdateItem', () => {
		it('return the updated item', async () => {
			await testQuery(`
				mutation {
					UpdateItem(id: "4edd40c86762e0fb12000013", item: { name: "Working Class Hero" }){
						id
						name
					}
				}
			`);
			const result = await runCypherOne(`
				MATCH (i:Item { id: "4edd40c86762e0fb12000013" })
				RETURN i
			`);
			expect(result).toMatchSnapshot();
		});
	});

	describe('DeleteItem', () => {
		it('return the deleted item', async () => {
			await testQuery(`
				mutation {
					DeleteItem(id: "4edd40c86762e0fb12000013"){
						id
						name
					}
				}
			`);
			const result = await runCypherOne(`
				MATCH (i:Item { id: "4edd40c86762e0fb12000013" })
				RETURN i
			`);
			expect(result).toBe(undefined);
		});
	});

	describe('UserFollowUser', () => {
		it('return the updated follower', async () => {
			await testQuery(`
				mutation {
					UserFollowUser(followerId: "4edd40c86762e0fb12000005", followeeId: "4edd40c86762e0fb12000004"){
						id
						name
						followees {
							name
						}
					}
				}
			`);
		});

		it('will not create duplicated follow connections', async () => {
			const query = `
				mutation {
					UserFollowUser(followerId: "4edd40c86762e0fb12000005", followeeId: "4edd40c86762e0fb12000004"){
						id
						name
						followees {
							name
						}
					}
				}
			`;
			await graphql(schema, query);
			await graphql(schema, query);
			const result = await runCypher(`
				MATCH (follower:User)-[r:FOLLOW]->(followee:User)
				WHERE follower.id = "4edd40c86762e0fb12000005"
				AND followee.id = "4edd40c86762e0fb12000004"
				RETURN r
			`);
			expect(result).toMatchSnapshot();
		});
	});

	describe('UserUnfollowUser', () => {
		it('return the updated follower', async () => {
			await testQuery(`
				mutation {
					UserUnfollowUser(followerId: "4edd40c86762e0fb12000004", followeeId: "4edd40c86762e0fb12000003"){
						id
						name
						followees {
							name
						}
					}
				}
			`);
			const result = await runCypher(`
				MATCH (follower:User {id: "4edd40c86762e0fb12000004"})
				MATCH (followee:User {id: "4edd40c86762e0fb12000005"})
				MERGE (follower)-[r:FOLLOW]->(followee)
				RETURN r
			`);
			expect(result).toMatchSnapshot();
		});
	});

	describe('UserLikeItem', () => {
		it('return the updated user', async () => {
			await testQuery(`
				mutation {
					UserLikeItem(userId: "4edd40c86762e0fb12000005", itemId: "4edd40c86762e0fb12000013"){
						id
						name
						likeItems {
							name
						}
					}
				}
			`);
		});

		it('will not create duplicated like connections', async () => {
			const query = `
				mutation {
					UserLikeItem(userId: "4edd40c86762e0fb12000005", itemId: "4edd40c86762e0fb12000013"){
						id
						name
						likeItems {
							name
						}
					}
				}
			`;
			await graphql(schema, query);
			await graphql(schema, query);
			const result = await runCypher(`
				MATCH (user:User)-[r:LIKE]->(item:Item)
				WHERE user.id = "4edd40c86762e0fb12000005"
				AND item.id = "4edd40c86762e0fb12000013"
				RETURN r
			`);
			expect(result).toMatchSnapshot();
		});
	});

	describe('UserDislikeItem', () => {
		it('return the updated user', async () => {
			await testQuery(`
				mutation {
					UserDislikeItem(userId: "4edd40c86762e0fb12000004", itemId: "4edd40c86762e0fb12000014"){
						id
						name
						likeItems {
							name
						}
					}
				}
			`);
			const result = await runCypher(`
				MATCH (user:User)-[r:LIKE]->(item:Item)
				WHERE user.id = "4edd40c86762e0fb12000004"
				AND item.id = "4edd40c86762e0fb12000014"
				RETURN r
			`);
			expect(result).toMatchSnapshot();
		});
	});
});
