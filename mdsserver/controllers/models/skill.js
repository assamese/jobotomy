var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Creating Skill Schema.

  "author" : "aeiou",
  "jobs" : [ "aeiou" ],
  "total_views" : 123,
  "unique_views" : 123,
  "parent_skill" : "aeiou",
  "name" : "aeiou",
  "skill_discussion_id" : "aeiou",
  "id" : "aeiou",
  "tag" : "aeiou",
  "published_at" : "2000-01-23T04:56:07.000+0000",
  "experts" : [ "aeiou" ]

 * @type {*|Schema}
 */
var SkillSchema = new Schema({
    author: String,
    status: String,
    total_views: Number,
    unique_views: Number,
    name: String,
    parent_skill: String,
    sub_skills: [String],
    skill_discussion_id: Schema.Types.ObjectId,
    published_at: {type: Date}
}, {timestamps: true});

module.exports = mongoose.model('Skill', SkillSchema);
