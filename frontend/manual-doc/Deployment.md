
For compiling the project need using <code>npm start</code> or <code>npm run compile</code>  for compiling, it can be use on deployment on a production server.

Before run the command execute <code>npm install</code> for installing all dependency.

For doc generation use <code>./node_modules/.bin/esdoc</code>

For testing use <code>npm test</code>

for run single file test 
~~~
./node_modules/mocha/bin/mocha --compilers js:@babel/register --require ./test/testHelper.js --require ./src/Container.js --require ./src/model/math/index.js --require ./src/bootstrap.js  ./test/file/xml/DocumentToXMLTranslator.spec.js
~~~

Copyright (c) 2019 Micro Logic Corp.