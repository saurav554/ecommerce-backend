const bcryptjs = require('bcryptjs');


const password = 'secret123';

bcryptjs.genSalt(10).then(function(salt){
    bcryptjs.hash(password, salt).then(function(encrypted){
       console.log(encrypted);
    }).catch(function(err){
        console.log(err)
    })
})