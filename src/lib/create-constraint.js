import { runCypher } from './neo4j';

export const createUserConstraint = () =>
	runCypher(`
	CREATE CONSTRAINT ON (u:User) ASSERT u.email IS UNIQUE
`);

export const createItemConstraint = () =>
	runCypher(`
	CREATE CONSTRAINT ON (i:Item) ASSERT i.name IS UNIQUE
`);

export default async () => {
	await Promise.all([createUserConstraint(), createItemConstraint()]);
};
