module.exports = {
  options : { 
    livereload : false, 
    debounceDelay : 500 
  },
  dev : {
    files : [
      'src/**/*'
    ],
    tasks : [
      'build'
    ]
  }
}
