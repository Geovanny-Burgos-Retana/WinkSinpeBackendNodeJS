const { v4 } = require('uuid');
const AWS = require('aws-sdk');

const findById = async (event) => {
    
    const dynamodb = new AWS.DynamoDB.DocumentClient();

    console.log(event);

    const { id } = event.pathParameters;

    var { records, offset } = event.queryStringParameters;

    records = parseInt(records);
    offset = parseInt(offset);

    console.log(id);

    const params = {
        TableName: 'Account',
        Key: { id }
    };

    const result = await dynamodb.get(params).promise();

    const account = result.Item;

    // todo gbr hay que darle vuelta a los datos para que se muestren de primero los mas recientes

    if(offset*records < account.banking_movements.length) {
      if(offset*records+records < account.banking_movements.length) {
        account.banking_movements = account.banking_movements.slice(offset*records, offset*records+records);
      } else {
        account.banking_movements = account.banking_movements.slice(offset*records, account.banking_movements.length);
      }
    }

    console.log(account);

    return {
        statusCode: 200,
        body: JSON.stringify(
          {
            account: account
          },
          null,
          2
        ),
    };
};

module.exports = {
    findById,
};