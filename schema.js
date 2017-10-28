const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull
} = require('graphql');

// Hardcoded data

const students = [
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
const StudentType = new GraphQLObjectType({
	name: 'Student',
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		age: { type: GraphQLInt },
		friends: {
			type: new GraphQLList(StudentType),
			resolve(student){
				let friends = []

				for(let i = 0; i < student.friends.length; i++) {
					friends.push(students[parseInt(student.friends[i]) - 1])
				}

				return friends;
			}
		}
	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		student: {
			type: StudentType,
			args: {
				id: { type: GraphQLString }
			},
			resolve(parentValue, args) {
				for(let i = 0; i < students.length; i++) {
					if(students[i].id === args.id) {
						return students[i];
					}
				}
			}
		},
		students: {
      type: new GraphQLList(StudentType),
      resolve(parentValue, args) {
      	return students;
      }
    }
	}
});

const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addStudent: {
			type: StudentType,
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

				students.push(obj);

				return obj;
			}
		},

		updateStudent: {
			type: StudentType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				name: { type: GraphQLString },
				email: { type: GraphQLString },
				age: { type: GraphQLInt }
			},

			resolve(parentValue, args) {
				for(let i = 0; i < students.length; i++) {
					if(students[i].id === args.id) {
						if(args.name) {
							students[i].name = args.name
						}
						if(args.email){
							students[i].email = args.email
						}
						if(args.age){
							students[i].age = args.age
						}

						return students[i];
					}
				}
			}
		},

		deleteStudent: {
			type: StudentType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) }
			},

			resolve(parentValue, args) {
				for(let i = 0; i < students.length; i++) {
					if(students[i].id === args.id) {
						students.splice(i, 1)
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