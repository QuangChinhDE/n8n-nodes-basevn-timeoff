import * as get from './get';
import * as list from './list';

export { get, list };

export const description = [...list.description, ...get.description];
