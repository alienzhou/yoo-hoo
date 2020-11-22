const { yo } = require('../lib/index');

yo(process.argv[2] || 'yoo-hoo', { spacing: 1, color: 'random' });