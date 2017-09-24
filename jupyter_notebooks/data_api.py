#!/usr/bin/env python

import requests
import json
import csv
import pandas as pd
from sodapy import Socrata

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

def pandas_api():
	client = Socrata("data.cityofchicago.org", None)
	results_list = client.get("tt4n-kn4t")
	results_df = pd.DataFrame.from_records(results_list)

	json_data = results_df.to_json()

	print(json_data )

def csv_to_json():
	csv_file = open("data/test.csv")
	json_file = open("data/csv_to_json_file.txt", 'w')

	field_names = ("typical_hours", "name", "salary_or_hourly", "full_or_part_time", "annual_salary", "department", "job_titles", "hourly_rate")
	reader = csv.DictReader(csv_file, field_names)
	
	for row in reader:
			print(row)
			# json.dump(row, json_file)
			# json_file.write("\n")

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
	# get_api_data()
	pandas_api()
	# file_split()
	# mongo_export()
	# csv_to_json()