import type { Task } from '@/entities/task'

export const initialTasks: Task[] = [
  {
    id: 'js-closure',
    sectionId: 'javascript-fundamentals',
    question: 'What is a closure in JavaScript?',
    answer:
      'A closure is a function that retains access to variables from its lexical scope even after the outer function has finished executing. Closures are created when a function is defined inside another function and the inner function references variables from the outer scope.',
  },
  {
    id: 'js-event-loop',
    sectionId: 'javascript-fundamentals',
    question: 'Explain the JavaScript event loop.',
    answer:
      'The event loop continuously checks the call stack and task queues. Synchronous code runs on the call stack first. When the stack is empty, the event loop moves macrotasks (setTimeout, I/O) and microtasks (Promises) from their queues onto the stack, giving microtasks priority between macrotasks.',
  },
  {
    id: 'js-prototype',
    sectionId: 'javascript-fundamentals',
    question: 'How does prototypal inheritance work?',
    answer:
      'Every JavaScript object has an internal [[Prototype]] link to another object. When a property is accessed, the engine looks on the object itself, then walks the prototype chain until the property is found or the chain ends at null.',
  },
  {
    id: 'ds-array-vs-linked-list',
    sectionId: 'data-structures',
    question: 'When would you prefer an array over a linked list?',
    answer:
      'Arrays are better when you need O(1) random access by index, cache-friendly contiguous memory, and mostly append operations at the end. Linked lists are better when you frequently insert or delete at the beginning or middle without resizing concerns.',
  },
  {
    id: 'ds-hash-map',
    sectionId: 'data-structures',
    question: 'How does a hash map achieve average O(1) lookups?',
    answer:
      'A hash function maps keys to bucket indices. Collisions are handled with chaining (linked lists in buckets) or open addressing. With a good hash function and load factor management, average lookup, insert, and delete remain O(1).',
  },
  {
    id: 'sd-url-shortener',
    sectionId: 'system-design',
    question: 'Design a URL shortener.',
    answer:
      'Use a hash or base62 encoding to map long URLs to short codes. Store mappings in a database with the short code as primary key. Add a redirect service, rate limiting, analytics, and optional TTL for expiring links. Scale reads with caching (Redis) and writes with sharding by short code.',
  },
  {
    id: 'sd-rate-limiter',
    sectionId: 'system-design',
    question: 'How would you implement a rate limiter?',
    answer:
      'Common approaches: token bucket (smooth burst handling), fixed window counter (simple but boundary spikes), sliding window log (accurate, memory-heavy), or sliding window counter (hybrid). Store counters in Redis for distributed systems and return HTTP 429 when limits are exceeded.',
  },
]
