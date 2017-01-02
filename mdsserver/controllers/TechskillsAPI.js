'use strict';

var url = require('url');


var TechskillsAPI = require('./TechskillsAPIService');


module.exports.addJob = function addJob (req, res, next) {
  TechskillsAPI.addJob(req.body, res, next); // changed from req.swagger.params to req.body
};

module.exports.addSkill = function addSkill (req, res, next) {
  TechskillsAPI.addSkill(req.body, res, next); // changed from req.swagger.params to req.body
};

module.exports.deleteSkill = function deleteSkill (req, res, next) {
  TechskillsAPI.deleteSkill(req.swagger.params, res, next);
};

module.exports.findJobsBySkillId = function findJobsBySkillId (req, res, next) {
  TechskillsAPI.findJobsBySkillId(req.swagger.params, res, next);
};

module.exports.findJobsBySkillName = function findJobsBySkillName (req, res, next) {
  TechskillsAPI.findJobsBySkillName(req.swagger.params, res, next);
};

module.exports.findSkillById = function findSkillById (req, res, next) {
  TechskillsAPI.findSkillById(req.swagger.params, res, next);
};

module.exports.findSubskills = function findSubskills (req, res, next) {
  TechskillsAPI.findSubskills(req.swagger.params, res, next);
};

module.exports.findSkills = function findSkills (req, res, next) {
  TechskillsAPI.findSkills(req.swagger.params, res, next);
};

module.exports.authenticate = function authenticate (req, res, next) {
  TechskillsAPI.authenticate(req.body, res, next); // changed from req.swagger.params to req.body
};
