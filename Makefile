export PATH := ./node_modules/.bin:$(PATH)
SHELL := /bin/bash

REGION_EU := eu-west-1
REGION_US := us-west-2

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
	@sls deploy --verbose --stage dev --region $(REGION_EU)

deploy-production-eu:
	@sls deploy --verbose --stage prod --region $(REGION_EU)

deploy-production-us:
	@sls deploy --verbose --stage prod --region $(REGION_US)

destroy:
	@sls remove --verbose --stage dev --region $(REGION_EU)

destroy-production-eu:
	@sls remove --verbose --stage prod --region $(REGION_EU)

destroy-production-us:
	@sls remove --verbose --stage prod --region $(REGION_US)