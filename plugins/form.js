class Errors {
  /**
   * Create a new Errors instance.
   */
  constructor () {
    this.errors = {}
  }

  /**
   * Determine if an errors exists for the given field.
   *
   * @param {string} field
   */
  has (field) {
    return Object.prototype.hasOwnProperty.call(this.errors, field)
  }

  /**
   * Determine if we have any errors.
   */
  any () {
    return Object.keys(this.errors).length > 0
  }

  /**
   * Retrieve the error message for a field.
   *
   * @param {string} field
   */
  get (field) {
    if (this.errors[field]) {
      return this.errors[field][0]
    }
  }

  /**
   * Record the new errors.
   *
   * @param {object} errors
   */
  record (errors) {
    this.errors = errors
  }

  /**
   * Clear one or all error fields.
   *
   * @param {string|null} field
   */
  clear (field = null) {
    if (field) {
      delete this.errors[field]

      return
    }

    this.errors = {}
  }
}

class Form {
  /**
   * Create a new Form instance.
   *
   * @param {object} data
   * @param $axios
   * @param {boolean} resetData
   */
  constructor (data, $axios, resetData) {
    this.originalData = data
    this.axios = $axios
    this.resetData = resetData
    this.submitting = false

    for (const field in data) {
      this[field] = data[field]
    }

    this.errors = new Errors()
  }

  /**
   * Fetch all relevant data for the form.
   */
  data () {
    const data = {}

    for (const property in this.originalData) {
      data[property] = this[property]
    }

    return data
  }

  /**
   * Reset the form fields.
   */
  reset () {
    for (const field in this.originalData) {
      this[field] = ''
    }

    this.errors.clear()
  }

  /**
   * Send a POST request to the given URL.
   * .
   * @param {string} url
   */
  post (url) {
    return this.submit('$post', url)
  }

  /**
   * Send a PUT request to the given URL.
   * .
   * @param {string} url
   */
  put (url) {
    return this.submit('$put', url)
  }

  /**
   * Send a PATCH request to the given URL.
   * .
   * @param {string} url
   */
  patch (url) {
    return this.submit('$patch', url)
  }

  /**
   * Send a DELETE request to the given URL.
   * .
   * @param {string} url
   */
  delete (url) {
    return this.submit('$delete', url)
  }

  /**
   * Submit the form.
   *
   * @param {string} requestType
   * @param {string} url
   */
  submit (requestType, url) {
    this.errors.clear()
    this.submitting = true
    return new Promise((resolve, reject) => {
      this.axios[requestType](url, this.data())
        .then(({ data }) => {
          this.onSuccess(data)

          this.submitting = false

          resolve(data)
        })
        .catch((error) => {
          if (error.response.data.errors) {
            this.onFail(error.response.data.errors)
          }

          this.submitting = false

          reject(error.response.data)
        })
    })
  }

  /**
   * Handle a successful form submission.
   *
   * @param {object} data
   */
  onSuccess (data) {
    if (this.resetData) { this.reset() }
  }

  /**
   * Handle a failed form submission.
   *
   * @param {object} errors
   */
  onFail (errors) {
    this.errors.record(errors)
  }
}

export default ({ app: { $axios } }, inject) => {
  inject('form', (data, resetData = true) => new Form(data, $axios, resetData))
}
