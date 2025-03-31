import Handlebars from 'handlebars';

// Handlebars.registerHelper('concat', function () {
//   return Array.prototype.slice.call(arguments, 0, -1).join('');
// });

Handlebars.registerHelper('concat', function (...args) {
  return args.slice(0, -1).join('');
});