'use strict'

// eslint-disable-next-line
const BaseExceptionHandler = use('BaseExceptionHandler')

// eslint-disable-next-line
const Logger = use('Logger')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle(error, { request, response }) {
    response.status(error.status).json({
      status: error.status,
      errors: error.message
    })
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report(error, { request }) {
    Logger.error(JSON.stringify(error.message), {
      url: request.originalUrl(),
      method: request.method()
    })
  }
}

module.exports = ExceptionHandler