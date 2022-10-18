const { v4 } = require('uuid');
const AWS = require('aws-sdk');

const save = async (event) => {

    const dynamodb = new AWS.DynamoDB.DocumentClient();

    const { amount } = JSON.parse(event.body);
    const createdAt = Date.parse(new Date().toString());
    const id = v4();

    const newAccount = {
        id,
        amount,
        banking_movements: [],
        createdAt
    };

    const params = {
        TableName: 'Account',
        Item: newAccount
    }

    await dynamodb.put(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify(newAccount)
    }

};

module.exports = {
    save,
};