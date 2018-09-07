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
	@eslint_d src

lint-fix:
	@echo 'lint-fixing…'
	@eslint_d src --fix

test:
	@jest --runInBand

test-watch:
	@jest --watch --runInBand

test-coverage:
	@jest --coverage --runInBand

deploy:
	@sls deploy --verbose --stage dev --region eu-west-1

deploy-production:
	@sls deploy --verbose --stage prod --region eu-west-1

destroy:
	@sls remove --verbose --stage dev --region eu-west-1

destroy-production:
	@sls remove --verbose --stage prod --region eu-west-1