/**
 * Тесты проверки номера товара из адреса.
 *
 * @module
 */

import { expect, test } from '@jest/globals';

import { parseTopicId } from './topicId';

test('принимает положительное целое число', () => {
  expect(parseTopicId('1')).toBe('1');
  expect(parseTopicId('194')).toBe('194');
});

test('отклоняет всё остальное', () => {
  expect(parseTopicId('abc')).toBeUndefined();
  expect(parseTopicId('0')).toBeUndefined();
  expect(parseTopicId('-5')).toBeUndefined();
  expect(parseTopicId('1.5')).toBeUndefined();
  expect(parseTopicId('01')).toBeUndefined();
  expect(parseTopicId(' 1')).toBeUndefined();
  expect(parseTopicId('')).toBeUndefined();
});

test('массив или отсутствие параметра — не id', () => {
  expect(parseTopicId(['1', '2'])).toBeUndefined();
  expect(parseTopicId(undefined)).toBeUndefined();
});
