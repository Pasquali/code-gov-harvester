const getConfig = require('../../config');
const RepoIndexer = require("./repo");
const TermIndexer = require("./term");
const { Logger } = require("../../libs/loggers");

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
    await this.delay(1);

    this.index()
      .then(() => this.logger.info('Indexing process complete'))
      .catch(error => this.logger.error(error));
  }

  async delay(delayInSeconds) {
  //   setInterval(this.index, delayInSeconds * 1000,
  //     (err) => {
  //       if (err) {
  //         this.logger.error(err);
  //       }
  //     });
  // }
  return await new Promise(resolve => setTimeout(resolve, delayInSeconds * 1000));
  }
}

if (require.main === module) {
  const config = getConfig(process.env.NODE_ENV);
  let indexer = new Indexer(config);
  indexer.startIndex();
}

module.exports = Indexer;
