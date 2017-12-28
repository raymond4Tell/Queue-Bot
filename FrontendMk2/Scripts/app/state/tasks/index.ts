import reducer from "./reducers";

import * as taskSelectors from "./selectors";
import * as taskOperations from "./operations";
import * as taskTypes from "./types";

export {
    taskSelectors,
    taskOperations,
    taskTypes
};

export default reducer;