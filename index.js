const fs = require('fs');
const Handlebars = require('handlebars');
const { dateHelpers } = require(__dirname + '/helpers/date_helpers.js');
const { MY, Y, DMY } = dateHelpers;

Handlebars.registerHelper('MY', MY);
Handlebars.registerHelper('Y', Y);
Handlebars.registerHelper('DMY', DMY);

COURSES_COLUMNS = 3;

function validateArray(arr) {
  return arr !== undefined && arr !== null && arr instanceof Array && arr.length > 0;
}

function render(resume) {
  // Split courses into 3 columns
  if (validateArray(resume.education)) {
    resume.education.forEach(function(block) {
      if (validateArray(block.courses)) {
        splitCourses = [];
        columnIndex = 0;
        for (let i = 0; i < COURSES_COLUMNS; i++) {
          splitCourses.push([]);
        }
        block.courses.forEach(function(course) {
          splitCourses[columnIndex].push(course);
          columnIndex++;
          if (columnIndex >= COURSES_COLUMNS) {
            columnIndex = 0;
          }
        });
        block.courses = splitCourses;
      }
    });
  }

	const css = fs.readFileSync(__dirname + '/style.css', 'utf-8');
	const tpl = fs.readFileSync(__dirname + '/resume.hbs', 'utf-8');
	return Handlebars.compile(tpl)({
		css: css,
		resume: resume
	});
}

module.exports = {
	render: render
};
