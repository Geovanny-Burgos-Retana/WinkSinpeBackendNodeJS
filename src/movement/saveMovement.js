const { v4 } = require('uuid');
const AWS = require('aws-sdk');

const saveMovement = async (event) => {
    
    const dynamodb = new AWS.DynamoDB.DocumentClient();

    const { idAccount, contact, phone, amount, phoneTwo } = JSON.parse(event.body);
    
    const createdAt = Date.parse(new Date().toString())
    const id = v4();

    const newBankingMovement = {
        id,
        contact,
        phone,
        amount,
        createdAt,
        phoneTwo
    };

    const params = {
        TableName: 'Account',
        Key: {id: idAccount},
        UpdateExpression: `SET #banking_movements = list_append(#banking_movements, :vals), #amount = #amount - :amount`,
        ConditionExpression: `#amount > :amount`,
        ExpressionAttributeNames: {
            "#banking_movements": "banking_movements",
            "#amount": "amount"
        },
        ExpressionAttributeValues: {
            ":vals": [newBankingMovement],
            ":amount": newBankingMovement.amount
        }
    };

    const result = await dynamodb.update(params).promise();

    console.log(result);

    return {
        statusCode: 200,
        body: JSON.stringify(newBankingMovement)
    }

};

module.exports = {
    saveMovement,
};