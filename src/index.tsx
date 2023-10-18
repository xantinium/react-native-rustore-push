import init from './methods/init';
import token from './methods/token';
import checkPushAvailability from './methods/check';
import events from './events';

export default {
  	init,
	checkPushAvailability,
	...token,
	...events,
};
