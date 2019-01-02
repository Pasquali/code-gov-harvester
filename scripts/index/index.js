const getConfig = require('../../config');
const RepoIndexer = require("./repo");
const TermIndexer = require("./term");
const { Logger } = require("../../libs/loggers");
const schedule = require('node-schedule');

/**
 * Defines the class responsible for creating and managing the elasticsearch indexes
 *
 * @class Indexer
 */
class Indexer {

  /**
   * Creates an instance of Indexer.
   *
   */
  constructor(config) {
    this.logger = new Logger({ name: "index-script", level: config.LOGGER_LEVEL });
    this.config = config;
  }

  async index() {

    let repoIndexer = new RepoIndexer(this.config);
    let termIndexer = new TermIndexer(this.config);

    try {
      await repoIndexer.index();
      await termIndexer.index();
    } catch(error) {
      this.logger.trace(error);
      throw error;
    }
  }

  async startIndex() {
    console.log('Job Started');
    await this.delay(60);

    this.index()
      .then(() => this.logger.info('Indexing process complete'))
      .catch(error => this.logger.error(error));
  }

  async delay(delayInSeconds) {
    return await new Promise(resolve => setTimeout(resolve, delayInSeconds * 1000));
  }

  async schedule() {
    console.log('scheduling job');
    schedule.scheduleJob('35 17 * * *', () => this.startIndex());
  }
}

if (require.main === module) {
  const config = getConfig(process.env.NODE_ENV);
  let indexer = new Indexer(config);
  indexer.schedule();
}

module.exports = Indexer;
