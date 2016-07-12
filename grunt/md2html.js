module.exports = {
  options : {
    layout : 'src/layout.template', 
    markedOptions : { gfm : true }
  },
  build : {
    files : [{
      flatten : true,
      cwd : '.', 
      expand : true,
      src : ['src/markdown/*.md'],
      dest : 'build/',
      ext : '.html'
    }]
  }
};
