'use strict';

var morgan = require("morgan");
var config = require("./config");
var nodeRestClient = require('node-rest-client').Client;
//var getJobsAPI = require('./getjobs');


var Q        = require('q');
var mongoose = require('mongoose');



//-------------- get Jobs drom DB ---------------------
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


var Job = mongoose.model('Job', JobSchema);


function findJobsByDate(dateStr) {
  var foundJobs;
  return Q(Job.find({ updatedAt: { $gte: new Date(dateStr) }}).exec())
  .then(function(jobs) {
  	foundJobs = jobs;
    return {
      jobs: foundJobs
    };
  });
}

//----------------------------------
/*
		mongoose.connect(config.database)
		  .then(function() {
		  		console.log ("Connected to database");

				getJobsAPI.findJobsByJobURL("2016-05-20Z").then(function(foundJobs) {
					console.log("foundJob = " + foundJobs);
				});
				
		  }, function(err) {
			console.error(err);
		  });


*/


//-------------- post job to NodeBB ---------------------
var nodeBBclient = new nodeRestClient();
nodeBBclient.registerMethod('postjob', config.nodebbhost, 'POST');

var args = {
    headers: { 
    	"Content-Type": "application/x-www-form-urlencoded",
    	"Authorization": "Bearer " + config.mastertoken 
	}
}

function post2NodeBB(title, content) {
	args.data = "cid=" + config.cidForJobs + "&title=" + title + "&content=" + content;

	nodeBBclient.methods.postjob(args, function (data, response) {
	    console.log(data);
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

	if (job.company) {
		formattedContent += "<big><b>Company Name:</b></big> " + job.company + "</br>";
	}

	if (job.published_by_employer_at) formattedContent += "<big><b>Job posted on:</b></big> " + job.published_by_employer_at.toISOString().slice(0, 10) + " GMT" + "</br>";

	if (job.skills) {
		formattedContent += "<big><b>Skills:</b></big> ";
		for(var i=0; i< job.skills.length; i++) {
			formattedContent += job.skills[i] + ", ";
		}
	}

	if (job.remaining_skills) { // same as (! === undefined)
		formattedContent += job.remaining_skills + "</br>";
	} else {
		formattedContent += "</br>";
	}

	if (job.job_url) {
		formattedContent += "<a class=\"rssBtn smGlobalBtn\" href=\"" + encodeURIComponent(job.job_url) + "\"></a>";
		formattedContent += "<div  style=\"margin-top: 5px; padding-left: 6px;\" > ";
		formattedContent += "<a href=" + encodeURIComponent(job.job_url) + ">" + "<big><b>Click here to see Job Description</b></big></a>";
		formattedContent += "</div>";
	}

	formattedContent += "<br>";

	if (job.company) {
		formattedContent += "<div id=\"social\">";

		var formattedCompanyName = job.company.replace(/\s/g, "-");
		formattedContent += "<a class=\"facebookBtn smGlobalBtn\" href=\"" + url4Facebook (formattedCompanyName) + "\"></a>";
		formattedContent += "<a class=\"twitterBtn smGlobalBtn\" href=\"" + url4Twitter (formattedCompanyName) + "\"></a>";
		formattedContent += "<a class=\"linkedinBtn smGlobalBtn\" href=\"" + url4Linkedin (formattedCompanyName) + "\"></a>";
		formattedContent += "<a class=\"googleplusBtn smGlobalBtn\" href=\"" + url4Angel (formattedCompanyName) + "\"></a>";
		formattedContent += "<a class=\"crunchbaseBtn smGlobalBtn\" href=\"" + url4Crunch (formattedCompanyName) + "\"></a>";
		formattedContent += "<a class=\"tumblrBtn smGlobalBtn\" href=\"" + url4Glassdoor (formattedCompanyName) + "\"></a>";

		formattedContent += "</div>";
	}

	formattedContent += "<br>";
	formattedContent += "<br>";
	formattedContent += "<b>Rave or Rant about this job ? Click the Reply button below</b>";
	
	formattedContent += "</div>";

	return formattedContent;

/*
    skills: [String], //Schema.Types.ObjectId],
    remaining_skills: String,
*/
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

findJobsByDate(config.startDate)
.then(function(foundJobs) {
	console.log("foundJob = " + foundJobs.jobs);
	var header;

	for(var i=0; i < foundJobs.jobs.length; i++) {
		header = foundJobs.jobs[i].position;

		if (foundJobs.jobs[i].company) {
			header += " - " + foundJobs.jobs[i].company.replace(/\s/g, "-");
		}

		header += " - " + formatCity(foundJobs.jobs[i].city);

		if (foundJobs.jobs[i].published_by_employer_at) {
			header += " - " + foundJobs.jobs[i].published_by_employer_at.toISOString().slice(0, 10) + " GMT";
		}

		post2NodeBB(header, formattedContentForNodeBB(foundJobs.jobs[i]));
	}
	console.log("Added " + foundJobs.jobs.length + " jobs to NodeBB");
})
.catch(function(err) {
	console.error('Something went wrong: ' + err);
})
.done(function() {
	mongoose.disconnect();
});



