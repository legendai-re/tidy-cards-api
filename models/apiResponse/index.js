class ApiResponse {
  constructor (error = null, status = null, data = null) {
    this.error = error
    this.status = status
    this.data = data
  }
}

exports.apiResponseModel = ApiResponse
