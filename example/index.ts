import { yo } from '../lib/index';

yo(process.argv[2] || 'yoo-hoo', { spacing: 1, color: 'rainbow', paddingStart: 5 });