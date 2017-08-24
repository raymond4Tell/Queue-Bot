import { ActionTypes } from "./ActionsIndex";

/** Returns a function that builds action-builders for a family of action types, represented by the `ActionTypes` type argument */
function actionBuilderFactory<TActions extends { type: string }>() {
	return function <T extends { type: TActions["type"] }>(
		s: T["type"]
	): ActionBuilder<T> {
		return (...keys: (keyof T)[]) => {
			return (...values: any[]) => {
				const action = <any>{ type: s };
				for (let i = 0, l = keys.length; i < l; i++) {
					action[keys[i]] = values[i];
				}
				return action as T;
			};
		};
	};
}


interface ActionBuilder<TAction> {
	(): () => TAction;
	<K1 extends keyof TAction>(k1: K1): (v1: TAction[K1]) => TAction;
	<K1 extends keyof TAction, K2 extends keyof TAction>(k1: K1, k2: K2): (
		v1: TAction[K1],
		v2: TAction[K2]
	) => TAction;
	<
		K1 extends keyof TAction,
		K2 extends keyof TAction,
		K3 extends keyof TAction
		>(k1: K1, k2: K2, k3: K3): (v1: TAction[K1], v2: TAction[K2], v3: TAction[K3]) => TAction;
}

export const actionBuilder = actionBuilderFactory<ActionTypes>();