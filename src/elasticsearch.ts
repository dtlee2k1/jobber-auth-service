import { winstonLogger } from '@dtlee2k1/jobber-shared';
import { Client } from '@elastic/elasticsearch';
import envConfig from '@auth/config';

const logger = winstonLogger(`${envConfig.ELASTIC_SEARCH_URL}`, 'authElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
  node: `${envConfig.ELASTIC_SEARCH_URL}`
});

export async function checkConnection() {
  let isConnected = false;
  while (!isConnected) {
    logger.info('AuthService connecting to ElasticSearch...');
    try {
      const health = await elasticSearchClient.cluster.health({});
      logger.info(`AuthService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      logger.error('Connection to ElasticSearch failed. Retrying ...');
      logger.log({ level: 'error', message: `AuthService checkConnection() method error: ${error}` });
    }
  }
}
