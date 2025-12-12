# Part 3: Node Internals (note: formated the file using ai for better reading + examples also)

## 1. What is the Node.js Event Loop?

The Node.js Event Loop is a fundamental mechanism that enables Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded. It's responsible for handling asynchronous callbacks and executing code in a specific order.

**How it works:**
- The Event Loop continuously checks if there are tasks to execute
- It processes tasks from different phases in a specific order
- It allows Node.js to handle multiple operations concurrently without creating new threads

**Event Loop Phases:**
1. **Timers** - Executes callbacks scheduled by `setTimeout()` and `setInterval()`
2. **Pending Callbacks** - Executes I/O callbacks deferred to the next loop iteration
3. **Idle, Prepare** - Internal use only
4. **Poll** - Retrieves new I/O events; executes I/O related callbacks
5. **Check** - Executes `setImmediate()` callbacks
6. **Close Callbacks** - Executes close event callbacks (e.g., `socket.on('close', ...)`)

Each phase has a FIFO queue of callbacks to execute. The Event Loop processes callbacks in each phase until the queue is exhausted or the maximum number of callbacks has been executed, then moves to the next phase.


## 2. What is Libuv and What Role Does It Play in Node.js?

**Libuv** is a multi-platform C library that provides Node.js with asynchronous I/O capabilities. It's a critical component of Node.js architecture.

**Key Roles of Libuv:**

1. **Event Loop Implementation**: Libuv provides the actual implementation of the Event Loop
2. **Asynchronous I/O**: Handles file system operations, networking, and other I/O operations
3. **Thread Pool**: Manages a pool of threads for operations that can't be done asynchronously at the OS level
4. **Cross-Platform Abstraction**: Abstracts platform-specific system calls for Windows, Linux, and macOS
5. **Handle and Request Management**: Manages handles (long-lived objects) and requests (short-lived operations)

**Why Node.js needs Libuv:**
- JavaScript doesn't have built-in async I/O capabilities
- Different operating systems handle async operations differently
- Some operations (like file system operations) don't have native async support
- Libuv provides a consistent async API across all platforms

## 3. How Does Node.js Handle Asynchronous Operations Under the Hood?

Node.js handles asynchronous operations through a combination of the Event Loop, Libuv, and the Thread Pool:

**Process:**

1. **Request Initiation**: When you call an async function (e.g., `fs.readFile()`), Node.js delegates it to Libuv

2. **Operation Delegation**:
   - For network I/O: Libuv uses OS-level async mechanisms (epoll on Linux, kqueue on macOS, IOCP on Windows)
   - For file system operations: Libuv delegates to the Thread Pool because most file systems don't have native async APIs

3. **Thread Pool Execution**: If the operation goes to the Thread Pool:
   - A worker thread picks up the task
   - The thread performs the blocking operation
   - Once complete, the result is queued back to the Event Loop

4. **Callback Queue**: When the operation completes:
   - The callback is placed in the appropriate Event Loop phase queue
   - The Event Loop picks it up in the next iteration

5. **Callback Execution**: The callback runs on the main thread with the operation result

## 4. What is the Difference Between the Call Stack, Event Queue, and Event Loop in Node.js?

These three components work together to manage JavaScript execution:

### **Call Stack**
- A data structure that keeps track of function calls (LIFO - Last In, First Out)
- Contains the currently executing function and its context
- When a function is called, it's pushed onto the stack
- When a function completes, it's popped off the stack
- JavaScript has a single Call Stack (single-threaded)

**Example:**
```javascript
function first() {
    second();
}
function second() {
    console.log('Hello');
}
first();
// Stack: [first] → [first, second] → [first] → []
```

### **Event Queue (Callback Queue)**
- A queue that holds callback functions waiting to be executed (FIFO - First In, First Out)
- Callbacks are placed here when async operations complete
- Actually consists of multiple queues for different types of callbacks:
  - Microtask Queue (Promises, process.nextTick)
  - Macrotask Queue (setTimeout, setInterval, I/O callbacks)
  - Check Queue (setImmediate)

### **Event Loop**
- Continuously monitors the Call Stack and Event Queue
- When the Call Stack is empty, it moves callbacks from the Event Queue to the Call Stack
- Ensures proper order of execution based on priority (microtasks before macrotasks)

**Interaction Example:**
```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');

// Output: 1, 4, 3, 2
// Explanation:
// 1. '1' and '4' execute immediately (Call Stack)
// 2. Promise callback goes to Microtask Queue
// 3. setTimeout goes to Macrotask Queue
// 4. Event Loop processes Microtasks first (3)
// 5. Then processes Macrotasks (2)
```

## 5. What is the Node.js Thread Pool and How to Set the Thread Pool Size?

### **Node.js Thread Pool**

The Thread Pool is a set of worker threads managed by Libuv that handles operations that can't be performed asynchronously at the OS level.

**Operations that use the Thread Pool:**
1. File system operations (fs module)
2. DNS lookups (`dns.lookup()`)
3. CPU-intensive crypto operations
4. Compression operations (zlib)
5. Some other CPU-intensive tasks

**Default Configuration:**
- Default size: **4 threads**
- Can be configured from 1 to 1024 threads (but typically 4-128 is practical)

### **How to Set Thread Pool Size**

You can set the thread pool size using the `UV_THREADPOOL_SIZE` environment variable:

**Method 1: Command Line**
```bash
# Set to 8 threads
UV_THREADPOOL_SIZE=8 node server.js
```

**Method 2: In Code (Must be before any async operations)**
```javascript
// This must be the FIRST line in your application
process.env.UV_THREADPOOL_SIZE = 8;

const fs = require('fs');
// ... rest of your code
```

**Method 3: Package.json script**
```json
{
  "scripts": {
    "start": "UV_THREADPOOL_SIZE=8 node server.js"
  }
}
```

**Choosing the Right Size:**
- Default (4) is good for most applications
- Increase if you have many concurrent I/O operations
- Consider your CPU cores (e.g., 2x CPU cores)
- Too many threads can cause overhead and reduce performance
- Monitor your application's performance to find the optimal size

## 6. How Does Node.js Handle Blocking and Non-Blocking Code Execution?

### **Blocking vs Non-Blocking**

**Blocking Code:**
- Prevents the Event Loop from continuing until the operation completes
- The entire application waits for the operation to finish
- Uses synchronous methods (e.g., `fs.readFileSync()`)

**Non-Blocking Code:**
- Allows the Event Loop to continue processing other events
- Operations are performed asynchronously
- Uses callbacks, promises, or async/await

### **How Node.js Handles Each:**

**1. Blocking Code Execution:**
```javascript
// Blocking - BAD for Node.js
const fs = require('fs');
const data = fs.readFileSync('file.txt', 'utf8'); // Blocks here
console.log(data);
console.log('This waits for file to be read');
```
- Executed directly on the main thread
- Call Stack is occupied until completion
- No other code can execute during this time
- Should be avoided in production servers

**2. Non-Blocking Code Execution:**
```javascript
// Non-Blocking - GOOD for Node.js
const fs = require('fs');
fs.readFile('file.txt', 'utf8', (err, data) => {
    console.log(data);
});
console.log('This executes immediately');
```

**Execution Flow:**
1. `fs.readFile()` is called
2. Node.js delegates to Libuv/Thread Pool
3. Main thread continues (prints 'This executes immediately')
4. When file reading completes, callback is queued
5. Event Loop picks up the callback and executes it

**Best Practices:**

1. **Always use async methods in servers:**
   ```javascript
   // Good
   fs.readFile(path, callback);
   
   // Bad (in servers)
   fs.readFileSync(path);
   ```

2. **Use async/await for cleaner code:**
   ```javascript
   async function readFiles() {
       const data1 = await fs.promises.readFile('file1.txt');
       const data2 = await fs.promises.readFile('file2.txt');
       return { data1, data2 };
   }
   ```

3. **CPU-intensive tasks should be offloaded:**
   - Use Worker Threads for heavy computation
   - Use child processes for separate operations
   - Consider external services for very heavy tasks

4. **Be cautious with:**
   - Synchronous methods (use only in startup/configuration)
   - Long loops (break them up or use setImmediate)
   - Heavy JSON parsing (consider streaming parsers)

**When Blocking is Acceptable:**
- Application startup/initialization
- Configuration loading
- Command-line tools
- Build scripts
- Any script that doesn't need to handle concurrent operations
