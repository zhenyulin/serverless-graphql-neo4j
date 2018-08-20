import { neo4jgraphql } from 'neo4j-graphql-js';
import { driver } from '../server';

export default {
	Query: {
		Users: (...args) => neo4jgraphql(...args),
		User: (...args) => neo4jgraphql(...args),
		UserLikesItem: (...args) => neo4jgraphql(...args),
		UserFollowsdUser: (...args) => neo4jgraphql(...args),
		Items: (...args) => neo4jgraphql(...args),
		Item: (...args) => neo4jgraphql(...args),
	},
	Mutation: {
		AddUserFollower: async (obj, { userId, followerId }) => {
			const session = driver.session();
			const result = await session.run(`
				MATCH (user:User {id: "${userId}"})
				MATCH (follower:User {id: "${followerId}"})
				CREATE (user)<-[:FOLLOWS]-(follower)
				RETURN user { .id ,followers: [(user)<-[:FOLLOWS]-(user_followers:User) | user_followers { .id }] } AS user
			`);
			session.close();
			return result.records[0].get(0);
		},
	},
};
