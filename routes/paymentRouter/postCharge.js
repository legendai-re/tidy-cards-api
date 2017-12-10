module.exports = function postCharge (req, res) {

	const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

	if(!req.body.amount || !req.body.stripeEmail || !req.body.stripeToken){
        res.status(400).send({ error: 'some required parameters was not provided'});
        res.end();
    }else{
	    let amount = req.body.amount;

	 	stripe.customers.create({
	    	email: req.body.stripeEmail,
	    	source: req.body.stripeToken
	  	})
	    .then(customer =>
		    stripe.charges.create({
		    	amount,
		    	description: "TidyCards Donation",
		        currency: "eur",
		        customer: customer.id
		    }))
	    .then(charge => {
	    	if(charge.paid){
	    		res.json({success: true});
	    	}else{
	    		res.json({success: false});
	    	}
	    });
	}
}