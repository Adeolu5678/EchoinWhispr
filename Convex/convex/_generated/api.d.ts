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
import type * as careerWhispers from "../careerWhispers.js";
import type * as conversations from "../conversations.js";
import type * as fileStorage from "../fileStorage.js";
import type * as friends from "../friends.js";
import type * as governanceProposals from "../governanceProposals.js";
import type * as matches from "../matches.js";
import type * as moodConnections from "../moodConnections.js";
import type * as profiles from "../profiles.js";
import type * as randomMessages from "../randomMessages.js";
import type * as romanceSwiping from "../romanceSwiping.js";
import type * as tokenTransactions from "../tokenTransactions.js";
import type * as usageLimits from "../usageLimits.js";
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
  careerWhispers: typeof careerWhispers;
  conversations: typeof conversations;
  fileStorage: typeof fileStorage;
  friends: typeof friends;
  governanceProposals: typeof governanceProposals;
  matches: typeof matches;
  moodConnections: typeof moodConnections;
  profiles: typeof profiles;
  randomMessages: typeof randomMessages;
  romanceSwiping: typeof romanceSwiping;
  tokenTransactions: typeof tokenTransactions;
  usageLimits: typeof usageLimits;
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
