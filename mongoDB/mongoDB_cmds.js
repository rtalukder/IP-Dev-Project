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

/*
	refer to slides dicussing whether to implment embedded or reference documents.
	if data is starting to become very complex, relational DBs are they way to go
*/

/*
	Section on .aggregate() ops

	the aggregation framework allows for advanced computations. the aggregate method
	acts like a pipeline, where we can pass data through many stages in order
	to change it along the way.
*/

aggregate_ops = [$group, $sum, $avg, $max, $min, $match, $project,
					$sort, $limit]

// vendor_id is an array that it will seach through
// fields names that begin with '$' are called 'field paths'
// and are links to a fields in a document

// the results returns unique objects containing the field path name
db.potions.aggregate(
	[{"$group": {"_id": "$vendor_id"}}]
	)

// accumulators take a single expression and compute the expression for grouped documents
// this will return the total number of entires for each field path 
db.potions.aggregate(
	[{"$group": {"_id": "$vendor_id", "total": {"sum": 1}}}]
	)

/*
	field paths v. operators

	field paths- when values begin with a '$', they represent field paths
		that point ot that value

	operators- when fields begin with a '$', they are operators that perform a task
	
	in the command below, 

		field paths: $vendor_id and $grade
		operators: $group and $sum

	each stage modifies the working data set and then passes the altered documents
	to the next stage until we get our desired result

*/

db.potions.aggregate(
	[{"$group": {
		"_id": "$vendor_id", 
		"total": {"sum": 1},
		"grade_total": {"$sum": "$grade"}
		}
	}]
	)

// similar to a normal query and will only pass documents to the next 
// stage if they meet the specified condition(s)
// * use match early to resuce the number of documents for better performance
db.potions.aggregate(
	[{"$match": {"ingredients": "unicorn"}}]
	)

/*	Example 1

	Find the following: All potions containing 'unicorn'
		1. query potions
		2. group by vendor
		3. sum the number of potions per vendor
*/

db.potions.aggregate([
	{"$match": {"ingredients": "unicorn"}}, // stage 1
	{"$group": {							// stage 2
		"_id": "$vendor_id"
		"potion_count": {"sum": 1}
		}
	}
	])

/*	Example 2

	Find the following: All potions under $15
		1. query potions with price < $15
		2. group by vendor and average their grades
		3. sort the results by grade average
		4. limit results to only 3 vendors
*/

db.potions.aggregate([
	{"$match": {"price": {"$lt": 15}}},									// stage 1
	{"$group": {"_id": "$vendor_id", "avg_grade": {"avg": "$grade"}}},	// stage 2
	{"$sort": {"avg_grade": -1}},										// stage 3
	{"$limit": 3}														// stage 4
	])


// we can limit the fields we send by using $project
// it's common to see $match/$project used together early throughout the pipeline
db.potions.aggregate([
	{"$match": {"price": {"$lt": 15}}},									// stage 1
	{"$project": {"_id": false, "vendor_id": true, "grade": true}},		// stage 2
	{"$group": {"_id": "$vendor_id", "avg_grade": {"avg": "$grade"}}},	// stage 3
	{"$sort": {"avg_grade": -1}},										// stage 4
	{"$limit": 3}														// stage 5
	])