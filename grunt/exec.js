 var exports = {
    'copyAssets' : [
        'rm -rf build',
        'mkdir build',
        'cp -R assets build'
    ]
};

Object.keys(exports)
    .forEach(function toString(key){
       if(exports[key] instanceof Array){
           exports[key] = exports[key].join(' ; ');
       }
    });

module.exports = exports;