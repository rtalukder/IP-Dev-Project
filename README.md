# IP Dev Project

Repo for all my project work. This will only include source files and not the entire environment.

# Jupyter Notebooks

For the Jupyter Notebooks portion of my project, I utilized a data set from the City of Chicago's website. Then wrote a script to import the data into a MongoDB instance.

I then used Jupyter Notebooks to retrieve data from the database with the HTTP Requests package and then performed some data analysis and plotting with the matplotlib library.

# Web Client

The web client portion of the project uses MongoDB, Eve Python REST API Framework, and Angular, Node, JavaScript, and HTML for the front end portion of the application.


### Install Dependencies

You will need to install the npm and bower package managers.

```
npm install
bower install
```

### Starting the Application

Open two consoles and change directories to where **app.js** (found in js_portion folder) and **run.py** (found in eve/web_client folder) are located.

###### To start the node application:
```
node app.js
```

You must first create a virtualenv (virtual environment) for Eve. Here documentation on where/how to configure this: http://python-eve.org/install.html

Once the virtual environment has been created, you then navigate to the 'Scripts' folder of the virtualenv and then run 'activate' using your second console window.

```
cd eve/[<name_given_to_virtualenv>]/Scripts
activate
cd ..
```

When that has been done, you can start up the API server.

###### To start the API server:
```
python run.py
```

After you start both applications, you can point your browser to ```http://localhost:3000``` and the front end portion will be running.

Please don't hesitate to ask me any questions about this code.
