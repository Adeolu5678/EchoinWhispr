/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as applications from "../applications.js";
import type * as bounties from "../bounties.js";
import type * as conversations from "../conversations.js";
import type * as featureFlags from "../featureFlags.js";
import type * as fileStorage from "../fileStorage.js";
import type * as friends from "../friends.js";
import type * as milestones from "../milestones.js";
import type * as projects from "../projects.js";
import type * as soft_circles from "../soft_circles.js";
import type * as users from "../users.js";
import type * as vouches from "../vouches.js";
import type * as webhooks from "../webhooks.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  applications: typeof applications;
  bounties: typeof bounties;
  conversations: typeof conversations;
  featureFlags: typeof featureFlags;
  fileStorage: typeof fileStorage;
  friends: typeof friends;
  milestones: typeof milestones;
  projects: typeof projects;
  soft_circles: typeof soft_circles;
  users: typeof users;
  vouches: typeof vouches;
  webhooks: typeof webhooks;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
