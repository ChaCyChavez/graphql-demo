const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull
} = require('graphql');

// Hardcoded data

const customers = [
	{
		id: '1',
		name: 'John Doe', 
		email: 'johndoe@gmail.com', 
		age: 20,
		friends: ["2", "3", "5"]
	},
	{
		id: '2', 
		name: 'Steve Jobs', 
		email: 'stevejobs@gmail.com', 
		age: 40,
		friends: ["1", "5"]
	},
	{
		id: '3', 
		name: 'Sara Williams', 
		email: 'sarawilliams@gmail.com', 
		age: 30,
		friends: ["1", "5"]
	},
	{
		id: '4', 
		name: 'Czarina San Juan', 
		email: 'czasj@gmail.com', 
		age: 28,
		friends: ["1", "2", "3"]
	},
	{
		id: '5', 
		name: 'Gregory Baldemoro', 
		email: 'gregbaldemoro@gmail.com', 
		age: 35,
		friends: ["1"]
	},
]



// Root Query
const CustomerType = new GraphQLObjectType({
	name: 'Customer',
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		age: { type: GraphQLInt },
		friends: {
			type: new GraphQLList(CustomerType),
			resolve(customer){
				let friends = []

				for(let i = 0; i < customer.friends.length; i++) {
					friends.push(customers[parseInt(customer.friends[i]) - 1])
				}

				return friends;
			}
		}
	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		customer: {
			type: CustomerType,
			args: {
				id: { type: GraphQLString }
			},
			resolve(parentValue, args) {
				for(let i = 0; i < customers.length; i++) {
					if(customers[i].id === args.id) {
						return customers[i];
					}
				}
			}
		},
		customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
      	return customers;
      }
    }
	}
});

const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addCustomer: {
			type: CustomerType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				name: { type: new GraphQLNonNull(GraphQLString) },
				email: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) }
			},

			resolve(parentValue, args) {
				let obj = {
					id: args.id,
					name: args.name,
					email: args.email,
					age: args.age
				};

				customers.push(obj);

				return obj;
			}
		},

		updateCustomer: {
			type: CustomerType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				name: { type: GraphQLString },
				email: { type: GraphQLString },
				age: { type: GraphQLInt }
			},

			resolve(parentValue, args) {
				for(let i = 0; i < customers.length; i++) {
					if(customers[i].id === args.id) {
						if(args.name) {
							customers[i].name = args.name
						}
						if(args.email){
							customers[i].email = args.email
						}
						if(args.age){
							customers[i].age = args.age
						}

						return customers[i];
					}
				}
			}
		},

		deleteCustomer: {
			type: CustomerType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) }
			},

			resolve(parentValue, args) {
				for(let i = 0; i < customers.length; i++) {
					if(customers[i].id === args.id) {
						customers.splice(i, 1)
					}
				}
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation
});