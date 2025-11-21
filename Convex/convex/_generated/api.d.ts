/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as conversations from "../conversations.js";
import type * as featureFlags from "../featureFlags.js";
import type * as fileStorage from "../fileStorage.js";
import type * as friends from "../friends.js";
import type * as mysteryWhispers from "../mysteryWhispers.js";
import type * as profiles from "../profiles.js";
import type * as subscriptions from "../subscriptions.js";
import type * as users from "../users.js";
import type * as webhooks from "../webhooks.js";
import type * as whispers from "../whispers.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  conversations: typeof conversations;
  featureFlags: typeof featureFlags;
  fileStorage: typeof fileStorage;
  friends: typeof friends;
  mysteryWhispers: typeof mysteryWhispers;
  profiles: typeof profiles;
  subscriptions: typeof subscriptions;
  users: typeof users;
  webhooks: typeof webhooks;
  whispers: typeof whispers;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
