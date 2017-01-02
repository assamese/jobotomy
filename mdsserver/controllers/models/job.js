var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

module.exports = mongoose.model('Job', JobSchema);
