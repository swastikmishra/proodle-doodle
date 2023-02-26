//https://github.com/fastify/aws-lambda-fastify/issues/89#issuecomment-1168807543
import { app } from './app.js';
import awsLambdaFastify from '@fastify/aws-lambda';

const main = async () => {
  const handler = awsLambdaFastify(app);
  await app.ready();
  return { handler };
};

// note we aren't exporting main here, but rather the result 
// of calling main() which is a promise resolving to {handler}:
module.exports = main();