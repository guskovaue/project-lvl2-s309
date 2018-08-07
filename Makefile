install:
	npm install

start:
	npm run babel-node -- src/flow.js /Users/homyak/Documents/repos/hexlet_projects/file1.json /Users/homyak/Documents/repos/hexlet_projects/file2.json

publish:
	npm publish

lint:
	npm run eslint .

test:
	npm test