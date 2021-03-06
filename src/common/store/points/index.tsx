import {Dispatch} from "redux";

import {
    Points,
    PointTransaction,
    Actions,
    ActionTypes,
    ResetAction,
    FetchedAction,
} from "./types";

import {getPoints, getPointTransactions} from "../../api/private";

export const initialState: Points = {
    points: "0.000",
    uPoints: "0.000",
    transactions: []
};

export default (state: Points = initialState, action: Actions): Points => {
    switch (action.type) {
        case ActionTypes.FETCHED: {
            return {
                points: action.points,
                uPoints: action.uPoints,
                transactions: action.transactions || [...state.transactions]
            }
        }
        case ActionTypes.RESET: {
            return {...initialState};
        }
        default:
            return state;
    }
}

/* Actions */

export const fetchPoints = (username: string) => async (dispatch: Dispatch) => {
    const name = username.replace("@", "");

    let points;
    try {
        points = await getPoints(name);
    } catch (e) {
        return;
    }

    dispatch(fetchedAct(points.points, points.unclaimed_points));

    let transactions;
    try {
        transactions = await getPointTransactions(name);
    } catch (e) {
        return;
    }

    dispatch(fetchedAct(points.points, points.unclaimed_points, transactions));
}


export const resetPoints = () => (dispatch: Dispatch) => {
    dispatch(resetAct());
};


/* Action Creators */
export const resetAct = (): ResetAction => {
    return {
        type: ActionTypes.RESET,
    };
};

export const fetchedAct = (points: string, uPoints: string, transactions?: PointTransaction[]): FetchedAction => {
    return {
        type: ActionTypes.FETCHED,
        points,
        uPoints,
        transactions,
    };
};
