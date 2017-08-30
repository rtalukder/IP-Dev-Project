#!/usr/bin/env python

import requests
import json

# retreiving data from 
def get_api_data():
	url = "https://data.cityofchicago.org/resource/tt4n-kn4t.json"

	file = open("data/JSONdata.txt", 'w')

	response = requests.get(url)
	if response.status_code == 200:
	    data = response.json()

	for i in data:
		file.write(json.dumps(i))
		file.write("\n")

	file.close()

	print("Data has been saved to 'IP Dev Project/jupyter_notebooks/data/JSONdata'")

# splitting JSON data from function above into salried and hourly employees
def file_split():
	salried_file = open("data/salariedJSON.txt", 'w')
	hourly_file = open("data/hourlyJSON.txt", 'w')

	file = open("data/JSONdata.txt", 'r')
	
	for JSON_item in file:
		flag = JSON_item[2:15]

		if flag == "typical_hours":
			hourly_file.write(JSON_item)
		else:
			salried_file.write(JSON_item)
	
	print("Files have been split into 'salariedJSON' and 'hourlyJSON' respectively.")

# function to export JSON entried from salaried and hourly employees
# into their respective collections in MongoDB 
def mongo_export():
	salaried_url = "http://127.0.0.1:5000/salaried"
	hourly_url = "http://127.0.0.1:5000/hourly"

	# exporting salaried employee data to MongoDB in salaried collection
	salary_file =  open("data/salariedJSON.txt", 'r')

	for line in salary_file:
		trimmed_JSON = line.strip('\n')

		headers = {
		    'content-type': "application/json",
		    }

		response = requests.request("POST", salaried_url, data= trimmed_JSON, headers=headers)
		print(response.text)

	salary_file.close()

	# exporting hourly employee data to MongoDB in hourly collection
	hourly_file = open("data/hourlyJSON.txt", 'r')

	for line in hourly_file:
		trimmed_JSON = line.strip('\n')

		headers = {
		    'content-type': "application/json",
		    }

		response = requests.request("POST", hourly_url, data= trimmed_JSON, headers=headers)	
		print(response.text)

	hourly_file.close()

	print("Exported data to 'salaried' and 'hourly' collections in MongoDB.")

if __name__ == '__main__':
	get_api_data()
	file_split()
	mongo_export()