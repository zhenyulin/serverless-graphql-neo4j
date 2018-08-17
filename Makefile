export PATH := ./node_modules/.bin:$(PATH)
SHELL := /bin/bash

install:
	@yarn

cleanup:
	@rm -rf .serverless .webpack coverage node_modules *.log

run:
	@sls offline start --dontPrintOutput

lint:
	@echo 'linting…'
	@eslint src

lint-fix:
	@echo 'lint-fixing…'
	@eslint src --fix

lint-watch:
	@nodemon --watch src -q --exec 'make lint-fix'

test:
	@jest --config jest.config.js

test-watch:
	@jest --watch --config jest.config.js

test-coverage:
	@jest --coverage --config jest.config.js

integration-test:
	@INTEGRATION_TEST=true jest --config jest.config.js

deploy:
	@sls deploy --verbose --stage dev --region eu-west-1

deploy-production:
	@sls deploy --verbose --stage prod --region eu-west-1

destroy:
	@sls remove --verbose --stage dev --region eu-west-1

destroy-production:
	@sls remove --verbose --stage prod --region eu-west-1