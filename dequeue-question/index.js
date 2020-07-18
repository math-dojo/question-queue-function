const { QueueServiceClient, StorageSharedKeyCredential } = require("@azure/storage-queue");
require("dotenv").config();
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.name || (req.body && req.body.name)) {
        context.res = {
            status: 400,
            body: "no request parameters expected"
        };


    }
    else {
        dequeue()
    }
};



 async function dequeue() {

  const account = process.env.ACCOUNT_NAME || "";
  const accountKey = process.env.ACCOUNT_KEY || "";

  const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

 
  const queueServiceClient = new QueueServiceClient(
    `https://${account}.queue.core.windows.net`,
    sharedKeyCredential
  );

  
  const queueName = process.env.QUEUE_NAME;
  const queueClient = queueServiceClient.getQueueClient(queueName);

  const dequeueResponse = await queueClient.receiveMessages();
  if (dequeueResponse.receivedMessageItems.length == 1) {
    const dequeueMessageItem = dequeueResponse.receivedMessageItems[0];
    const deleteMessageResponse = await queueClient.deleteMessage(
      dequeueMessageItem.messageId,
      dequeueMessageItem.popReceipt
    );
    console.log(
      `Delete message successfully, service assigned request Id: ${deleteMessageResponse.requestId}`
    );
    return dequeueMessageItem
  }
}
