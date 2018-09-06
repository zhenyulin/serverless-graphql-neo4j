import { runCyphersAsTransactions } from './neo4j';

export default () =>
	runCyphersAsTransactions([
		`CREATE CONSTRAINT ON (u:User) ASSERT u.email IS UNIQUE`,
		`CREATE CONSTRAINT ON (i:Item) ASSERT i.name IS UNIQUE`,
	]);
