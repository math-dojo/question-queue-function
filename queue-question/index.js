
const { QueueServiceClient, StorageSharedKeyCredential } = require("@azure/storage-queue");

require("dotenv").config();
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.body && req.body.questionTitle) {
        await enqueue(context, req.body)
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
}

 async function enqueue(context, question) {

    const account = process.env.ACCOUNT_NAME || "";
    const accountKey = process.env.ACCOUNT_KEY || "";
    context.log(account + "is the account name");

    const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

    const queueServiceClient = new QueueServiceClient(

        `https://${account}.queue.core.windows.net`,
        sharedKeyCredential
    );


    const queueName = process.env.QUEUE_NAME;
    context.log(queueName + "is the queue name");
    const queueClient = queueServiceClient.getQueueClient(queueName);
    const createQueueResponse = await queueClient.create();
    context.log(
        `Create queue ${queueName} successfully, service assigned request Id: ${createQueueResponse.requestId}`
    );


    const enqueueQueueResponse = await queueClient.sendMessage(question);
    context.log(
        `Sent message successfully, service assigned message Id: ${enqueueQueueResponse.messageId}, service assigned request Id: ${enqueueQueueResponse.requestId}`
    );
}


