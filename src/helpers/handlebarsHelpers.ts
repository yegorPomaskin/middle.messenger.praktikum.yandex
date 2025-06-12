import Handlebars from 'handlebars';

Handlebars.registerHelper('concat', function (...args) {
  return args.slice(0, -1).join('');
});

Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

Handlebars.registerHelper('length', function (array) {
  return Array.isArray(array) ? array.length : 0;
});

// Хелпер для отладки (можно удалить в продакшене)
Handlebars.registerHelper('debug', function (value) {
  console.log('Handlebars debug:', value);
  return '';
});

Handlebars.registerHelper('formatTime', function (timeString) {
  try {
    const date = new Date(timeString);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return timeString;
  }
});
