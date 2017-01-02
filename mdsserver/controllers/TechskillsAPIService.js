'use strict';

var Skill = require('./models/skill');
var Job = require('./models/job');
var ObjectId = require('mongoose').Types.ObjectId; 


exports.authenticate = function(args, res, next) {
  /**
   * parameters expected in the args:
  * authParams (NewAuth)
  **/
  
  console.log("authenticate: username = " + args.username);

  var examples = {};
  examples['application/json'] = {
  "success" : true,
  "id" : "id",
  "token" : "token"
  };
  
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
  
}


exports.addJob = function(args, res, next) {
  /**
   * parameters expected in the args:
  * jobUrl (NewJob)
  **/

  if(!args || !args.job_url){
    console.log("addJob: " + "args = null");
    res.end();
    return
  }

  console.log("addJob: job_url = " + args.job_url);
  
  var newJob = {};

  Job.create(args, function (err) {
    if (err) {
      console.log("addJob: create err = " + err);
      res.end(); //send(err);
      return
    }
    else {
      Job.find({job_url: args.job_url}, function (err, newJob) {
        if (err) {
            console.log("addJob: find err = " + err);
            res.end(); //send(err);
            return
        }

        console.log("addJob: newJob.length = " + newJob.length);

        if(Object.keys(newJob).length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(newJob || {}, null, 2));
        }
        else {
          res.end();
        }

      });
        
    }
  });


}

exports.addSkill = function(args, res, next) {
  /**
   * parameters expected in the args:
  * skill (NewSkill)
  **/
  
  
  var examples = {};
  examples['application/json'] = {
  "unique_views" : 123,
  "parent_skill" : "aeiou",
  "author" : "aeiou",
  "name" : "aeiou",
  "skill_discussion_id" : "aeiou",
  "total_views" : 123,
  "id" : "aeiou",
  "sub_skills" : [ "aeiou" ],
  "tag" : "aeiou",
  "published_at" : "2000-01-23T04:56:07.000+0000",
  "status" : "aeiou"
  };
  
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
  
}

exports.deleteSkill = function(args, res, next) {
  /**
   * parameters expected in the args:
  * id (String)
  **/
  // no response value expected for this operation
  
  
  res.end();
}

exports.findJobsBySkillName = function(args, res, next) {
  /**
   * parameters expected in the args:
  * skillName (String)
  **/
  
  var jobs = {};
  console.log("findJobsBySkillName: args.skill_name = " + args.skill_name.value);
  console.log("findJobsBySkillName: args.limit.value = " + args.limit.value);


  Job.find({skills: {$eq:args.skill_name.value}}, function (err, jobs) {
    if (err) {
        console.log("findJobsBySkillName: err = " + err);
        res.end(); //send(err);
        return
    }

    console.log("findJobsBySkillName: jobs.length = " + jobs.length);

    if(Object.keys(jobs).length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(jobs || {}, null, 2));
    }
    else {
      res.end();
    }

  });
}

exports.findJobsBySkillId = function(args, res, next) {
  /**
   * parameters expected in the args:
  * skillId (String)
  **/
  
  var jobs = {};
  console.log("findJobsBySkillId: args.skill_id = " + args.skill_id.value);
  console.log("findJobsBySkillId: args.limit.value = " + args.limit.value);


  Job.find({skills: {$eq:args.skill_id.value}}, function (err, jobs) {
  //Job.find({skills: {$in:[args.skill_id.value]}}, function (err, jobs) {
  //Job.find({skills: {$in:[ObjectId(args.skill_id.value)]}}, function (err, jobs) {
  //Job.find({city: args.skill_id.value}, function (err, jobs) {
    if (err) {
        console.log("findJobsBySkillId: err = " + err);
        res.end(); //send(err);
        return
    }

    console.log("findJobsBySkillId: jobs.length = " + jobs.length);

    if(Object.keys(jobs).length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(jobs || {}, null, 2));
    }
    else {
      res.end();
    }

  });
}

exports.findSkillById = function(args, res, next) {
  /**
   * parameters expected in the args:
  * id (String)
  **/

  var skills = {};
  console.log("findSkillById: id = " + args.id.value);

  Skill.find({"_id" : args.id.value}, function (err, skills) {
    if (err) {
        console.log("findSkillById: err = " + err);
        res.end(); //send(err);
        return
    }

    if(Object.keys(skills).length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(skills[Object.keys(skills)[0]] || {}, null, 2));
    }
    else {
      res.end();
    }

  });
 
}

exports.findSubskills = function(args, res, next) {
  /**
   * parameters expected in the args:
  * skill (String)
  **/

  var skills = {};
  console.log("findSubskills: skillname = " + args.skillname.value);

  Skill.find({"name" : args.skillname.value}, function (err, skills) {
    if (err) {
        console.log("findSubskills: err = " + err);
        res.end(); //send(err);
        return
    }

    console.log("findSubskills: skills.length = " + skills.length);

    if(Object.keys(skills).length === 1) {
        res.setHeader('Content-Type', 'application/json');
        console.log("findSubskills: skills[0].sub_skills.length = " + skills[0].sub_skills.length);
        res.end(JSON.stringify(skills[0].sub_skills || {}, null, 2));
    }
    else {
      console.log("findSubskills: Found no/more-than-1 skill(s)");
      res.end();
    }

  });
 
}

exports.findSkills = function(args, res, next) {
  /**
   * parameters expected in the args:
  * tags (List)
  * limit (Integer)  
  **/
  var skills = {};
  console.log("findSkills: args.wildcard.value = " + args.wildcard.value);
  var myRegExp = args.wildcard.value || '';
  Skill.find({name: new RegExp(myRegExp, "i"), "status" : "active"}, function (err, skills) {
//  Skill.find({name: new RegExp('^'+ myRegExp, "i"), "parent_id" : null, "status" : "active"}, function (err, skills) {
//  Skill.find({name: { $regex: /^J/i }, "parent_id" : null, "status" : "active"}, function (err, skills) {
  //Job.find({skills: {$in:[args.skill_id.value]}}, function (err, jobs) {
  //Job.find({skills: {$in:[ObjectId(args.skill_id.value)]}}, function (err, jobs) {
  //Job.find({city: args.skill_id.value}, function (err, jobs) {
    if (err) {
        console.log("findSkills: err = " + err);
        res.end(); //send(err);
        return
    }

    console.log("findSkills: skills.length = " + skills.length);

    if(Object.keys(skills).length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(skills || {}, null, 2));
    }
    else {
      res.end();
    }

  });
    
}


