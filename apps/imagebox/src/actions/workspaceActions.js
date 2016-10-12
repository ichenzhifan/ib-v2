import { CHANGE_WORKSPACE_SPREAD } from '../contants/actionTypes';

/**
 * 更改workspace中的活动的spread.
 * @param spread
 */
export function changeSpread(spread) {
  return {
    type: CHANGE_WORKSPACE_SPREAD,
    spread
  };
}
