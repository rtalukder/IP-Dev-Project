// Raquib Talukder
// mongoDB_cmds from codeschool

db.potions.insert({"name":"invisibility", "vendor":"kettlecooked"})

db.potions.insert({"name":"newName"})

db.potions.insert({"name":"newerRecord"})

db.potions.insert(
	{
	"name":"invisibility",
	"vendor":"kettlecooked",
	"price": 10.99,
	"score": 59,
	"tryDate": new Date(1994,2,4),
	"ingredients" : ["string", 69, 4.20],
	"ratings": {"strength": 2, "flavor": 5}
	}
)

// collection of update fields used below 
update_ops = [$set, $inc, $sunset, $rename, $min, $max, $mul, $pop,
 					$push, $pull]

/* 
	Section on .update() ops
*/

// update the field of the first document found
db.potions.update(
	{"name" : "invisibility"},
	{"$set" : {"price": 3.99}}
	)

// multi field set to true
// will update all values matched to the name
db.potions.update(
	{"name" : "invisibility"},
	{"$set" : {price: 3.99}},
	{"multi": true}
	)

// notice we're doing db.logs not db.collection
// very important line ("upsert": true) in order to add field to logs
db.logs.update(
	{"name": "invisibility"},
	{"$inc": {"count": 1}},
	{"upsert": true}
	)

// removing fields from documents
// {} will query for all items in the collection
// "" 
db.potions.update(
	{},
	{"$unset" : {"score" : ""}},
	{"multi": true}
	)
	
// renaming a specified field that's already a field in the document
db.potions.update(
	{},
	{"$rename": {"tryDate":"my_birthday"}},
	{"multi": true}
	)

// updating single values in an array
db.potions.update(
	{"name": "invisibility"},
	{"$set": {"ingredients.1" : "another_ingredient"}}
	)

// updating multiple arrays w/o knowing index location
// --- will only update the first match
db.potions.update(
	{"ingredients": "string"},
	{"$set": {"ingredients.$": "newString"}},
	{"multi": true}
	)

// updating an embedded value
db.potions.update(
	{"name": "newRecord"},
	{"$set": {"ratings.strength": 99999}}
	)

// $pop will only remove first or last value
// -1 removes first element || 1 removed the last element
// doesn't return value-- only modifies array
db.potions.update(
	{"name": "newerRecord"},
	{"$pop": {"ingredients": 1}}
	)

// $push will add a value to the end of an array
db.potions.update(
	{"name": "newName"},
	{"$push": {"ingredients": "pushing_ingredient"}}
	)

// $addToSet will add value to end of an array unless it's already present
db.potions.update(
	{"name": "newName"},
	{"$addToSet": {"ingredients": "pushing_ingredient"}}
	)

// $pull will remove any instance of avalue from an array
// if value isn't unique, all instances will be removed from the array
db.potions.update(
	{"name": "newName"},
	{"$pull": {"ingredients": "pushing_ingredient"}}
	)

/* 
	Section on .find() ops

	by default, only the first 20 documents are printed out
	objects returned from the find method are called 'cursor objects'
*/

query_ops = [$gt, $gte, $ne, $lt, $lte, $elemMatch]

// you can query based on multiple criteria
db.potions.find(
	{
		"vendor": "kettlecooked",
		"ratings.strength": 2
	}
	)

// single op 
db.potions.find({"price": {"$lt": 11}})

// in between values
db.potions.find({"price": {"$gt": 5, "$lt": 45}})

// range queries on an array
// below means AT LEAST 1 value in an array much be >5 and <45
db.potions.find({"$elemMatch": {"$gt": 5, "$lt": 45}})

/*
	list_one	sizes = [10, 16, 32]
	list_two 	sizes = [2, 8, 16]
*/

db.potions.find(
	{"sizes": {"$gt": 8, "$lt": 16}}
)

/* 
	the above command will match to list two because each value is checked
	individually. if at least 1 array value is true for each critera, the 
	entire document matches

	list_one,
		32 > 8 AND 64 > 8 AND 80 > 8, which matches
		36, 64, 80 !< 16, which doesn't match

		list_one doesn't meet all criteria 

	list_two, 
		16 > 8, which matches 
		2 < 16 AND 8 < 16, which both match 

	list_two of sizes will be returned since both criteria are met
*/

// find() takes a second parameter called a 'projection'
// that we cab use to specify the exact fields we want 
// back by setting their value to true

// the projection can have ONLY all true or all false values for fields
// the only field that can be set to false when selecting/exlcuding fields
// if the '_id' field
db.potions.find(
	{"score": {"$gte": 55}},
	{"vendor": true, "name": true}
	)

// count() can be used to return the count of matching documents
db.potions.find().count()

// sort through documents
// -1 to order descending | 1 to order ascending
db.potions.find.sort({"price": 1})

// limiting how many documents are returned
db.potions.find.limit(5)

// you can also skip a certain amount and also limit
// this line will skip the first three document, and limit 5 returned ones
// this method can become expensive with large collections
db.potions.find.skip(3).limit(5)



