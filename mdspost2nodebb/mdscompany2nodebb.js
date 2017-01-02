'use strict';

var morgan = require("morgan");
var config = require("./config");
var nodeRestClient = require('node-rest-client').Client;
//var getJobsAPI = require('./getjobs');


var Q        = require('q');
var mongoose = require('mongoose');



//-------------- DB functions ---------------------
// http://joost.vunderink.net/blog/2015/09/18/combining-mongoose-and-q-in-node-js/
var Schema   = mongoose.Schema;

/**
 * Creating Job Schema.
 * @type {*|Schema}
 */
var JobSchema = new Schema({
    author: String,
    status: String,
    total_views: Number,
    unique_views: Number,
    name: String,
    city: String,
    position: String,
    company: String,
    job_url: String,
    job_discussion_id: Schema.Types.ObjectId,
    published_by_employer_at: {type: Date},
    skills: [String], //Schema.Types.ObjectId],
    remaining_skills: String,
    published_at: {type: Date}
}, {timestamps: true});


var Job = mongoose.model('jobs', JobSchema);


function findJobsByDate(dateStr) {


	// Create our deferred object, which we will use in our promise chain
    var deferred = Q.defer();

    // Find a single department and return in
    //Job.find({updatedAt: { $gte: new Date(dateStr) }}, function(error, foundJobs){
    Job.find({}, function(error, foundJobs){    	

        if (error) {
        	// Throw an error
            deferred.reject(new Error(error));
        }
        else {
       		// No error, continue on
            deferred.resolve(foundJobs);
        }
    });

    // Return the promise that we want to use in our chain
    return deferred.promise;
}


// Document schema in MongoDB
var PostedcompaniesSchema = new Schema({
	company: String
});

var Postedcompanies = mongoose.model('PostedCompanies', PostedcompaniesSchema);

function getPostedcompanies() {

	// Create our deferred object, which we will use in our promise chain
    var deferred = Q.defer();

    // Find a single department and return in
    Postedcompanies.find({}, function(error, foundCompanies){

        if (error) {
        	// Throw an error
            deferred.reject(new Error(error));
        }
        else {
       		// No error, continue on
            deferred.resolve(foundCompanies);
        }
    });

    // Return the promise that we want to use in our chain
    return deferred.promise;
}


function insertFoundCompanies(companiesToInsert) {

	// Create our deferred object, which we will use in our promise chain
    var deferred = Q.defer();

    console.log("companiesToInsert[0].company = " + companiesToInsert[0].company);
    var company_document;

	for(var i = 0; i < companiesToInsert.length; i++) {
	    company_document = new Postedcompanies (companiesToInsert[i]);
	    company_document.save(function(error){

	        if (error) {
	        	// Throw an error
	        	console.log("DB Insert error: " + error);
	            deferred.reject(new Error(error));
	        }
	        else {
	       		// No error, continue on
	            //if (i == (companiesToInsert.length)) deferred.resolve();
	        }
	    });
	}

    // Return the promise that we want to use in our chain
    return deferred.promise;
}

//-------------- DB related utility functions ---------------------
function companyExists(companyName, listOfCompanies) {
	for(var i = 0; i < listOfCompanies.length; i++) {
	    var company = listOfCompanies[i].company;

	    if (company == companyName) {
	    	return true;
	    }
	}
	return false;
}


//-------------- post job to NodeBB ---------------------
var nodeBBclient = new nodeRestClient();
nodeBBclient.registerMethod('postemployer', config.nodebbhost, 'POST');

var args = {
    headers: { 
    	"Content-Type": "application/x-www-form-urlencoded",
    	"Authorization": "Bearer " + config.mastertoken 
	}
}

function post2NodeBB(title, content) {
	args.data = "cid=" + config.cidForEmployers + "&title=" + title + "&content=" + content;

	nodeBBclient.methods.postemployer(args, function (data, response) {
	    //console.log(data);
	});
}


//--------------- Add formatting, Decorations-------------------
function formatCity(cityWithCountryAndZip) {
	return cityWithCountryAndZip.split(',')[0]; // returns just the name of the city Minus country, zip-code etc
}

function url4Facebook(fcn) {
	return "https://www.facebook.com/search/top/?q=" + fcn;
}

function url4Twitter(fcn) {
	return "https://twitter.com/search?q=" + fcn;
}

function url4Angel(fcn) {
	return "https://angel.co/" + fcn;
}

function url4Crunch(fcn) {
	return "https://www.crunchbase.com/organization/" + fcn + "#/entity";
}

function url4Glassdoor(fcn) {
	return "https://www.glassdoor.com/Reviews/" + fcn + "-reviews-SRCH_KE0,12.htm";
}

function url4Linkedin(fcn) {
	return "https://www.linkedin.com/company/" + fcn;
}

// https://www.linkedin.com/company/symphony-fintech

function formattedContentForNodeBB(job) {
	var formattedContent = "<div>";

	formattedContent += "<link rel=\"stylesheet\" href=\"http://minedskills.neocities.org/bbcontent.css\">";

	formattedContent += "<big><b>Company Name:</b></big> " + job.company + "</br>";
/*
	if (job.published_by_employer_at) formattedContent += "<big><b>Latest Job posted on:</b></big> " + job.published_by_employer_at.toISOString().slice(0, 10) + " GMT" + "</br>";


	if (job.job_url) {
		formattedContent += "<a class=\"rssBtn smGlobalBtn\" href=\"" + encodeURIComponent(job.job_url) + "\"></a>";
		formattedContent += "<div  style=\"margin-top: 5px; padding-left: 6px;\" > ";
		formattedContent += "<a href=" + encodeURIComponent(job.job_url) + ">" + "<big><b>Click here to see Job Description</b></big></a>";
		formattedContent += "</div>";
	}

	formattedContent += "<br>";
*/
	formattedContent += "<div id=\"social\">";
	var formattedCompanyName = job.company.replace(/\s/g, "-");
	formattedContent += "<a class=\"facebookBtn smGlobalBtn\" href=\"" + url4Facebook (formattedCompanyName) + "\"></a>";
	formattedContent += "<a class=\"twitterBtn smGlobalBtn\" href=\"" + url4Twitter (formattedCompanyName) + "\"></a>";
	formattedContent += "<a class=\"linkedinBtn smGlobalBtn\" href=\"" + url4Linkedin (formattedCompanyName) + "\"></a>";
	formattedContent += "<a class=\"googleplusBtn smGlobalBtn\" href=\"" + url4Angel (formattedCompanyName) + "\"></a>";
	formattedContent += "<a class=\"crunchbaseBtn smGlobalBtn\" href=\"" + url4Crunch (formattedCompanyName) + "\"></a>";
	formattedContent += "<a class=\"tumblrBtn smGlobalBtn\" href=\"" + url4Glassdoor (formattedCompanyName) + "\"></a>";
	formattedContent += "</div>";

	formattedContent += "<br>";
	formattedContent += "<br>";
	formattedContent += "<b>Comment on this employer ? Click the Reply button below</b>";
	
	formattedContent += "</div>";

	return formattedContent;

}

//----------------------------------

/**
 * Connecting to MongoDB using Mongoose.
*/


mongoose.connect(config.database, function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log("Connected to database");
    }
});




//----------------- main method starts here ---------------------

var allFoundCompanies;
var companiesAdded = 0;
var companiesAddedArray = [];

getPostedcompanies()
.then(function(foundCompanies){
	console.log("Found " + foundCompanies.length + " companies");
	allFoundCompanies = foundCompanies;
	return findJobsByDate(config.startDate);
})
.then(function(foundJobs) {
	console.log("Found " + foundJobs.length + " jobs");
	//console.log("foundJob = " + foundJobs);


	for(var i=0; i < foundJobs.length; i++) {
	//for(var i=0; i < 5; i++) {
		if (foundJobs[i].company) {

				if (!companyExists(foundJobs[i].company, allFoundCompanies)) {
					post2NodeBB(foundJobs[i].company + " - " + formatCity(foundJobs[i].city), formattedContentForNodeBB(foundJobs[i]));
					companiesAdded++;
					companiesAddedArray.push ({"company": foundJobs[i].company});
					allFoundCompanies.push ({"company": foundJobs[i].company});
				} else {
					console.log("foundCompany = " + foundJobs[i].company);
				}
			
		}
	}
	
	console.log("Added " + companiesAdded + " companies to NodeBB");
})
.then(function(){
	console.log("Adding " + companiesAddedArray.length + " companies to DB");
	if (companiesAddedArray.length > 0) return insertFoundCompanies(companiesAddedArray);
})
.catch(function(err) {
	console.error('Something went wrong: ' + err);
})
.done(function() {
	mongoose.disconnect();
});




