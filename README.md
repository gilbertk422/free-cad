The project consists of two parts.

For run the project you need execute the commands
~~~
sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io

sudo docker-compose up --build 

#to run as a daemon
docker-compose up --no-deps -d

#for run on developer computer
docker-compose -f docker-compose-dev.yml up -d

#for view container logs 
docker logs -f <container_name>  

#for remove all containers
docker system prune
~~~


##frontend
The part is in the ./frontend directory. 

For doc generation use <code>./node_modules/.bin/esdoc</code>
run the command execute <code>npm install</code> for installing all dependency.
And see the doc no the http:/[host]/docs/ page.



##backend
The part is in the ./backend directory. 
Responsibility of the part is to add access to all necessary 
API for the frontend part.



##development cycle
The project is deployed in two environments, development and production.

According to the environment, there are two branches of __dev__ and a __master__. 
With a frequency of once every two weeks, the application is tested and in the absence of critical 
errors, the code of the dev branch merges into the master branch (with a change in the release version).
See version name rules in the file [frontend/manual-doc/VersionNameRules.md]

the __dev__ branch is deployed on the cad-dev.emachineshop.com:81 address.

the __master__ branch is deployed on the cad.emachineshop.com address.
