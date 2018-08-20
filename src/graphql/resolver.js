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
		AddUserFollower: async (_, { userId, followerId }) => {
			const session = driver.session();
			const result = await session.run(`
				MATCH (user:User {id: "${userId}"})
				MATCH (follower:User {id: "${followerId}"})
				MERGE (user)<-[:FOLLOWS]-(follower)
				RETURN user { .*, followers: [(user)<-[:FOLLOWS]-(user_followers:User) | user_followers { .id }] } AS user
			`);
			session.close();
			return result.records[0].get(0);
		},
		RemoveUserFollower: async (_, { userId, followerId }) => {
			const session = driver.session();
			const result = await session.run(`
				MATCH (user:User {id: "${userId}"})
				MATCH (follower:User {id: "${followerId}"})
				OPTIONAL MATCH (follower)-[follow:FOLLOWS]->(user)
				DELETE follow
				RETURN user { .*, followers: [(user)<-[:FOLLOWS]-(user_followers:User) | user_followers { .id }] } AS user;
			`);
			session.close();
			return result.records[0].get(0);
		},
		AddUserItem: async (_, { userId, itemId }) => {
			const session = driver.session();
			const result = await session.run(`
				MATCH (user:User {id: "${userId}"})
				MATCH (item:Item {id: "${itemId}"})
				MERGE (item)<-[:LIKES]-(user)
				RETURN user { .*, likes: [(items:Item)<-[:LIKES]-(user) | items { .id }] } AS user
			`);
			session.close();
			return result.records[0].get(0);
		},
	},
};
