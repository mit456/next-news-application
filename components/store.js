import {createStore} from 'redux';
import {createWrapper, HYDRATE} from 'next-redux-wrapper';


const astate = {
  tick: 'Something',
}
// create your reducer
const reducer = (state = astate, action) => {
  switch (action.type) {
    case HYDRATE:
      return {...astate, ...action.payload};
    case 'TICK':
      return {...astate, tick: action.payload};
    default:
      return astate;
  }
};

// create a makeStore function
const makeStore = context => createStore(reducer);
// export an assembled wrapper
export const wrapper = createWrapper(makeStore, {debug: true});
