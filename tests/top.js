function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

let common = require("./common");
let models  = common.models;



describe("", function () {
	beforeEach(function () {
    });

	describe("\n\n||||||| INITIALIZATION |||||||", function () {
		it('drop test database', (done) => {
			models.User.remove({}, (err) => { 
		        models.CustomSort.remove({},(err) => { 
		        	models.Collection.remove({}, (err) => {
		            	done();
		            });
		        })
		    });
		});
	});

	importTest("\n\n||||||||||| AUTH ||||||||||||", './auth');
    importTest("\n\n||||||||||| USERS |||||||||||", './user');
    importTest("\n\n|||||||| COLLECTIONS ||||||||", './collection');

    after(function () {
    });
});