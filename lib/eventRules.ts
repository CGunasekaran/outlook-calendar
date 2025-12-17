// lib/eventRules.ts
import { EventRule } from '@/types/calendar';

export const DEFAULT_RULES: EventRule[] = [
  {
    id: 'na-monthend',
    name: 'NA Monthend',
    type: 'first-working-day',
    weekendBehavior: 'next-working-day',
    description: 'First working day of every month'
  },
  {
    id: 'eu-monthend',
    name: 'EU Monthend',
    type: 'specific-day',
    dayOfMonth: 2,
    weekendBehavior: 'no-shift',
    description: '2nd of every month, no holiday shifting'
  },
  {
    id: 'eu-revenue',
    name: 'EU Revenue Allocations',
    type: 'specific-day',
    dayOfMonth: 12,
    weekendBehavior: 'next-working-day',
    description: '12th of every month, if weekend then next Monday'
  },
  {
    id: 'global-imprs',
    name: 'GLOBAL IMPRS',
    type: 'specific-day',
    dayOfMonth: 13,
    weekendBehavior: 'next-working-day',
    description: '13th of every month, if weekend then next working day'
  },
  {
    id: 'na-fv',
    name: 'NA F&V allocations',
    type: 'specific-day',
    dayOfMonth: 15,
    weekendBehavior: 'no-shift',
    description: '15th of every month, no holiday shifting'
  },
  {
    id: 'eu-fv',
    name: 'EU F&V allocations',
    type: 'specific-day',
    dayOfMonth: 19,
    weekendBehavior: 'no-shift',
    description: '19th of every month, no holiday shifting'
  },
  {
    id: 'img-allocations',
    name: 'IMG Allocations and adjustments',
    type: 'specific-day',
    dayOfMonth: 15,
    weekendBehavior: 'no-shift',
    description: '15th of every month, no holiday shifting'
  },
  {
    id: 'eu-cost',
    name: 'EU cost corrections',
    type: 'specific-day',
    dayOfMonth: 9,
    weekendBehavior: 'previous-friday',
    description: 'Runs every 9th, if weekend runs on previous Friday'
  },
  {
    id: 'money-currency',
    name: 'Money currency update',
    type: 'specific-day',
    dayOfMonth: 1,
    weekendBehavior: 'no-shift',
    description: 'First of every month'
  },
  {
    id: 'eu-dealer',
    name: 'EU Dealer price extract',
    type: 'specific-day',
    dayOfMonth: 1,
    weekendBehavior: 'no-shift',
    description: '1st of every month'
  }
];
