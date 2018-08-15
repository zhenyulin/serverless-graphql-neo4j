const users = {
	a: {
		id: 'a',
		name: 'John Cage',
		email: 'john.cage@test.com',
		followers: ['b'],
		likes: ['1', '2'],
	},
	b: {
		id: 'b',
		name: 'Jonny Walk',
		email: 'jonny.walk@test.com',
		followers: [],
		likes: ['3'],
	},
};

const items = {
	'1': {
		id: '1',
		name: 'Submariner',
		model: '11060421',
	},
	'2': {
		id: '2',
		name: 'Speedmaster',
		model: '1238882',
	},
	'3': {
		id: '3',
		name: 'Seamaster',
		model: '12888434',
	},
};

export default {
	Query: {
		user: async (_, { id }) => users[id],
		item: async (_, { id }) => items[id],
	},

	User: {
		followers: ({ followers }) => followers.map(id => users[id]),
		likes: ({ likes }) => likes.map(id => items[id]),
	},
};
