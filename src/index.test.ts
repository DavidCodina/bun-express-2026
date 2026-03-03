// Traversy Media at 27:15 : https://www.youtube.com/watch?v=U4JVw8K19uY&t=787s
// Bun will look for filest that have the xxx.test.ts extension.
// Use: bun test

import { describe, expect, test, beforeAll } from 'bun:test'

/* ========================================================================

======================================================================== */

export const add = (a: number, b: number): number => a + b

export const subtract = (a: number, b: number): number => a - b

export const multiply = (a: number, b: number): number => a * b

export const divide = (a: number, b: number): number => {
  if (b === 0) {
    throw new Error('Division by zero is not allowed')
  }
  return a / b
}

/* ========================================================================

======================================================================== */

beforeAll(() => {
  console.log(`
    ┌──────────────────────────────────────────────────────────────────────────┐
    │                                Test Time!                                │
    └──────────────────────────────────────────────────────────────────────────┘
  `)
})

describe('Arithmetic Functions', () => {
  describe('add', () => {
    test('should add two positive numbers correctly', () => {
      expect(add(5, 3)).toBe(8)
    })

    test('should add negative and positive numbers correctly', () => {
      expect(add(-5, 3)).toBe(-2)
    })
  })

  describe('subtract', () => {
    test('should subtract two positive numbers correctly', () => {
      expect(subtract(10, 4)).toBe(6)
    })

    test('should subtract negative numbers correctly', () => {
      expect(subtract(-5, -3)).toBe(-2)
    })
  })

  describe('multiply', () => {
    test('should multiply two positive numbers correctly', () => {
      expect(multiply(4, 5)).toBe(20)
    })

    test('should multiply by zero correctly', () => {
      expect(multiply(10, 0)).toBe(0)
    })
  })

  describe('divide', () => {
    test('should divide two positive numbers correctly', () => {
      expect(divide(15, 3)).toBe(5)
    })

    test('should throw error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Division by zero is not allowed')
    })
  })
})
