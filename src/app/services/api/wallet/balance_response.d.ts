/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Uint128 = string;

export interface BalanceResponse {
  locked_amount: Uint128;
  share: Uint128;
  staked_amount: Uint128;
  unstaked_amount: Uint128;
  [k: string]: unknown;
}