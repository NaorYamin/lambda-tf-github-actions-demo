#!/bin/bash

#
# variables
#

# AWS variables
AWS_REGION=eu-west-1
# project name
PROJECT_NAME=lambda-tf-github-actions-demo

# the directory containing the script file
dir="$(cd "$(dirname "$0")"; pwd)"
cd "$dir"

[[ $1 != 'prod' && $1 != 'dev' ]] && { echo 'usage: publish.sh <prod | dev>'; exit 1; } ;

# root account id
ACCOUNT_ID=$(aws sts get-caller-identity \
    --query Account \
    --output text)

API_GATEWAY_ID=$(aws apigateway get-rest-apis \
    --query "items[?name=='$PROJECT_NAME'].id" \
    --region $AWS_REGION \
    --output text)
echo apigateway id: $API_GATEWAY_ID

echo aws lambda delete-alias $1
aws lambda delete-alias \
    --function-name $PROJECT_NAME \
    --name $1 \
    --region $AWS_REGION \

cd lambda/
rm --force index.zip

echo npm install 
npm install

echo zip index.js
zip -r index.zip .

echo aws lambda update-function-code $PROJECT_NAME
aws lambda update-function-code \
    --function-name $PROJECT_NAME \
    --zip-file fileb://index.zip \
    --region $AWS_REGION

echo aws lambda update-function-code $PROJECT_NAME
VERSION=$(aws lambda publish-version \
    --function-name $PROJECT_NAME \
    --description $1 \
    --region $AWS_REGION \
    --query Version \
    --output text)
echo published version: $VERSION

echo aws lambda create-alias $1
aws lambda create-alias \
    --function-name $PROJECT_NAME \
    --name $1 \
    --function-version $VERSION \
    --region $AWS_REGION

echo aws lambda add-permission
aws lambda add-permission \
    --function-name "arn:aws:lambda:$AWS_REGION:$ACCOUNT_ID:function:$PROJECT_NAME:$1" \
    --source-arn "arn:aws:execute-api:$AWS_REGION:$ACCOUNT_ID:$API_GATEWAY_ID/*/*/*" \
    --principal apigateway.amazonaws.com \
    --statement-id $1 \
    --action lambda:InvokeFunction
