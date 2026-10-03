import type { QueryAst, QueryNode } from '@leemour/cli-messaging/services';
export type { QueryAst, QueryNode };
export declare function parseLucene(text: string): QueryAst;
export declare function validateFields(ast: QueryAst): QueryAst;
export declare function normalize(text: string): string;
export declare function compileAutomaton(pattern: string): { test(text: string): boolean };
export declare function wildcardPattern(value: string): string;
export declare function dateRange(lower: string, upper: string, lowerInclusive: boolean, upperInclusive: boolean, zone: string, span: {start: number; end: number}): { lower?: number; upper?: number; lowerInclusive: boolean; upperInclusive: boolean };
export declare const QUERY_FIELDS: readonly {name: string; support: string; type: string; operators: readonly string[]; values?: readonly string[]; example: string}[];
