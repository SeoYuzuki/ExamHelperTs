module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
      ? '/ExamHelperTs/' // ExamHelperTs 為 repo 名稱
      : '/'
  }