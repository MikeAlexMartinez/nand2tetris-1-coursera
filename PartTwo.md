# Nand 2 Tetris Course - Part Two - Coursera

What we have already:
- The Hack Hardware, i.e. A computer
- The Hack Assembler, takes code written in the Hack machine language and creates a binary file, that the Hack Hardware uses to run programs

What comes next:
- Machine Language -> used by assembler
    ^ VM Translator
- VM Code -> VM translator uses this to create a machine language
    ^ Compiler
- OS -> Provides interface between computer, devices and any running programs
- High Level Language -> Interacts with OS and 
    ^ Write a program
- Human Though -> writes a program


## Week One - Virtual Machine 1 - Stack Arithmetic

High-level programming is all built on abstractions. Someone at some point
in the past will have developed something to provide functionality
which is trivial to use from then on, hiding the complexity of it's contents
to a user.

Coming Up:
- Compilation (big picture)
- Virtualization
- VM abstraction
- Stack processing
- VM Implementation
- Pointers
- Programming

### Program Compilation

Java for example:
Tier 1: Virtual Machine
Java Program -> Java Compiler -> Creates -> VM Code (bytecode), An abstraction
Tier 2: JVM - Java Virtual Machine
VM Code -> JVM Translator -> Creates Machine language for target platform

#### Jack Compilation

Jack Program -> Jack Compiler -> VM Code -> VM Translator -> Hack Machine Language -> Target Platform (Hack Computer)

### VM Abstraction: The Stack

(Most important element)

The distance between each abstraction layer and target should be sufficiently small
to allow the compilation to be implemented without too much complexity.

The Stack Machine abstraction provides such commands.

A Stack has two allowable operations, push and pop,
- Push: add a plate at the stack's top,
- Pop: remove the top plate

The top pointer always points to the top of the stack,
and you can't take chunks of plates and remove blocks.

These operations are responsible for taking data to and from the
memory of the computer.

#### Stack Aritmetic

add: Pop's two top most values of stack, adds together then, pushes result on to top of the stack
neg: Pop top most value and convert to negative
eq: Pops two top most values, compares, pushes result, (or is the same)

Applying a function F on the stack:
- pops the argument(s) from the stack
- Computes f on the arguments
- Pushes the result onto the stack

e.g.
High Level:
  x = 17 + 19
becomes:
  push 17
  push 19
  add
  pop x

Stack machine, manipulated by:
- Arithmetic / logical commands
- Memory segment commands
- Branching commands
- Function commands

Arithmetic / Logical Commands

| Command | Return Value | Return Type
|---------|--------------|-------------
|   add   |    x + y     |   integer
|   sub   |    x - y     |   integer
|   neg   |     -y       |   integer
|   eq    |    x==0      |   boolean
|   gt    |    x > y     |   boolean
|   lt    |    x < y     |   boolean
|   and   |   x and y    |   boolean
|   or    |   x or y     |   boolean
|   not   |    not y     |   boolean

Observation: Any arithmetic or logical expression can
be expressed and evaluated by applying some sequence of the
above operations on a stack.

### VM Abstraction: Memory Segments

Variable Kinds:
- Argument Variables
- Local variables
- Static variables
- constant variables

Different Virtual memory stacks are created.
Therefore:

```javascript
class Foo {
  static int s1, s2;
  function int bar (int x, int y) {
    var int a, b, c;
    ...
    let c = s1 + y;
    ...
  }
}
```
becomes:
...
...
...
push static 0
push argument 1
add
pop local c
...
...

All references to variables are replaced by references to memory segments.

Syntax: push / pop *segment* i

There are 8 Memory Segments:
- local
- argument
- this
- that
- constant
- static
- pointer
- temp

Syntax: push *segment* i
- where segment is one of listed memory segments and,
- i is a non-negative integer

The stack interacts with memory segments using the interface defined earlier.

### VM Implementation: The Stack

In order to implement the VM Stack Abstraction we will need to use Pointer Manipulation
 
#### Pointer Manipulation

|   | RAM |
|---|-----|
| 0 |  6  | p
| 1 |  5  | q
| 2 |  10 |
| 3 |  12 |
| 4 |  0  |
| 5 | 124 |
| 6 | 237 |

Therefore "D = *p" // *p is the memory location p points at (6 => 237)

In hack "D = * p" is equivalent to:
@p
A=M
D=M

e.g.
D = *p // D becomes 237

p--    // RAM[0] becomes 5
D = *p // D becomes 124

*q = 9 // RAM[5] becomes 9
q++    // RAM[1] becomes 7

#### How to make a stack on a proper computer

"SP" means "Stack Pointer"
- SP is stored in RAM[0]
- Stack base addr = 256

Logic:
*SP = 17
SP++

Hack Assembly:
@17 // D=17
D=A
@SP // *SP=D
A=M
M=D
@SP // SP++
M=M+1

VM Code: push constant i
Assembly Code: *SP = i, SP++

### VM Implementation: Memory Segments.

Note: Symbols for Hack Machine:
- SP = 0, Stack Pointer
- LCL = 1, Local
- ARG = 2, Argument
- THIS = 3, This
- THAT = 4, That

Implementing Local:
Local can live anywherein RAM, base address of local
is stored in LCL.

Therefore ```pop local 2```
pushes value at *SP into *(LCL + 2)

In Psuedo Code:
addr = LCL+2
SP--
\*addr = \*SP

Hack Assembly: (My attempt)
@2
D = A // D = 2
@LCL
D = D + M // D = 2 + *LCL
@addr // 
M = D // RAM[16] = LCL + 2
@SP
M=M-1 // SP--
@SP
A=M // A register = address of SP
D=M // Store value of SP in D
@addr
A=M // A register = address set in RAM[16]
M=D // set memory to value in D

#### POP

VM Code:
pop local i

Assembly code: 
addr = LCL + i
SP--
*addr = *SP

#### Push

VM Code:
push local i

Assembly code: 
addr = LCL + i
\*SP = \*addr
SP++

#### Implementing local, argument, this, that

Same as local except the segment pointer name will refer
to the segment in question.

The segments can be located anywhere in RAM.

#### Constant

Constant can't be used with a pop operation as it can't
store new information.

push constant i => *SP = i, SP++

#### Static

When translating the high-level code of some method into VM Code
- maps the static variables that the method sees onto the static segment

Static variables are at higher level of program so we should store
them in some "global space"
- Have the VM Translator translate each VM reference *static i* (in the file Foo.vm) into an assembly reference Foo.i
e.g.
VM Code:
...
pop static 5
...
pop static 2
...

Becomes, Assembly code:

// D = stack.pop(code omitted)
@Foo.5
M=D
...
// D = stack.pop(code omitted)
@Foo.2
M=D
...

Static Variables live between 16 and 255. and live outside of the stack.
They appear in the order which the appear in your code.

#### Temp Segment

8 Place segment called temp that can be used when required. Mapped onto RAM
locations 5 to 12. Same as LCL except base address is 5.

#### Pointer

(Will make more sense when jack compiler is written)

VM Code:
push pointer 0/1 => *SP=THIS/THAT, SP++
pop point 0/1 => SP=--, THIS/THAT=*SP

At fixed, 2-place segment:
- accessing pointer 0 should result in accessing this
- accessing point 1 should result in accessing that

### The VM Emulator

Typical uses of VM Emulator:
- Running (compiled) Jack programs
- Testing programs (systematically)
- Experimenting with VM commands
- Observing the VM internals (stack, memory segments)
- Observing how the VM is realized on the host platform

#### The Test Scripts

Normally provided,
First command typically a .vm file to load,
then an output file,
then a compare file.

Some missing elements in project 7, due to functions and Branching
being handled in week 8. So are missing the 'function / return envelope'


#### The VM Implementation on the HACK Platform

VM Code:
push constant 2 =>

Hack Assembly Code:
@2 // Set A-register to 2
D=A // move A-register value of 2 to D-register
@SP // select stack in memory
A=M // set Memory location to current position of stack
M=D // set selected memory location to value in D (2)
@SP // select stack in memory
M=M+1 // increment stack position by 1

In Order to write a VM translator, we must be familiar with:
- The source language
- The target language
- The VM Mapping on the target platform

##### Source: VM Language

Arithmetic / Logical commands:
- add
- sub
- neg
- eq
- gt
- lt
- and
- or
- not

Memory Access commands
- pop segment i
- push segment i

Branching commands
- label label
- goto label
- if-goto label

Function commands
- function functionName nVars
- call functionName nArgs
- return

Target: Symbolic Hack Code (See PartOne.md)

Standard VM mapping on the Hack Platform

VM mapping decisions:
- How to map the VM's data structures using the host hardware platform
- How to express the VM's commands using the host machine language

Standard Mapping:
- Specifies how to do the mapping in an agreed-upon way
- Benefits:
  - Compatibility with other software systems
  - Standard testing

HACK RAM
0         SP
1         LCL
2         ARG
3         THIS
4         THAT
5..12     temp segment
13..15    general
16..255   static variables
256..2047 stack

_local, argument, this, that:_ Allocated dynamically to the RAM. The base address
of these allocations are kept in the semgent pointers LCL, ARG, THIS, THAT

accessing segment i should result in accessing RAM[*segmentPointer + i]

_constant:_ accessing constant i should result in supplying the constant i

_static_: accessing static i within file Foo.vm should result in accessing the assembly variable Foo.i

_temp_: fixed segment mapped on to RAM addresses 5-12

_pointer_: fixed segment mapped on RAM addresses 3-4. pointer 0 = THIS, pointer 1 = THAT

Symbols of the form Xxx.i will be assigned to RAM by the Hack Assembler as defined.

#### The VM Translator: Proposed Solution

Proposed Design:
- Parser: parses each VM command into its lexical elements
- CodeWriter: writes the assembly code that implements the parsed command
- Main: drives the process (VMTranslator)

Main(VMTranslator)
Input: fileName.vm
Output: fileName.asm

Main Logic:
- Constructs a Parser to handle the input file
- Constructs a CodeWriter to handle the output file
- Marches through the input file, parsing each line and generating code from it

Parser:
- Handles the parsing of a single .vm file
- Reads a VM command, parses the command into its lexical components, and provides convenient
  access to these components.
- Ignores all white space and comments

Routines
Constructor
hasMoreCommands
advance
commandType returns one of
- C_ARITHMETIC  - In project 7
- C_PUSH - In project 7
- C_POP - In project 7
- C_LABEL - Project 8
- C_GOTO - Project 8
- C_IF - Project 8
- C_FUNCTION - Project 8
- C_RETURNS - Project 8
- C_CALL - Project 8
arg1 - returns 2nd arg
arg2 - returns 3rd arg

CodeWriter:
- Generates assmebly code from the parsed VM command:

Routines
- Constructor
- writeArithmetic command (string)
- writePushPop command (C_PUSH or C_POP), segment (string), index (int)
- Close

#### Project 7: Building the VM Translator: Part One

5 Test Programs.

Most important one is the .vm file

- Write a VM to Hack translator that conforms to the standard defined.
- Generated .asm files should match compare file.

Recommended steps:

Play with program in VM Emulator. (using VME.tst file)

Some Testing Challenges: It's missing function return envelope, therefore,
the test script must be used to plug these holes manually.

#### Perspectives

JVM uses a register machine rather than the stack architecture
used in this course. Apparently suitable for mobile devices.

## Week 8 - Virtual Machine - Program Control

Functions provide a means to abstract underlying functionality.

It means a basic language can be extended at will.

Branching Commands:
- goto _label_
- if-goto _label_
- label _label_

Function commands
- call _function_
- function _function_
- return

Challenges:
- Understand the abstraction
- Building the implementation

To Learn:
- Branching
- Functions
- Function call-and-return
- Dynamic memory management
- Stack processing
- Pointers
- Completing the VM implementation

### Branching

You have two types of branching:
- Unconditional Branching
- Conditional Branching

e.g.

psuedo:
if-goto ENDLOOP

takes top value from stack, if true,
go to named loop

goto ENDLOOP, is unconditional

Also need the:
label _label_ command to give positions that the code can jump to.

### Functions: Abstraction

High-level programming languages can be extended using:
- Subroutines
- Functions
- Procedures
- Methods
...

High-level program:

...
sqrt(x - 17 + x * 5)
...

Becomes in VM:
...
push x
push 17
sub
push x
push 5
call Math.multiply
add
call Math.sqrt

The VM language features:
- Primitive operations (fixed)
- abstract operations (extensible): multiply, sqrt...

Calling a function and a built in command has the same look and feel

Defining:

High Level program:
int mult(int x, int y) {
  int sum = 0;
  int n = 1;
  while !(n > y) {
    sum += x;
    n++;
  }
  return sum;
}

Final VM Code:

function mult 2 // 2 local vars
  push constant 0 // sum = 0
  pop local 0
  push constant 1 // n = 1
  pop local 1
label LOOP
  push local 1 // if!(n>y) goto END
  push argument 1
  gt
  if-goto END
  push local 0 // sum += x
  push argument 0
  add
  pop local 0
  push local 1 // n++
  push constant 1
  add
  pop local 1
  goto LOOP
label END
  push local 0 // return sum
  return

Executing functions.
  call mult 2 => calls mult function
  and informs function that 2 arguments were placed
  onto the stack

The VM code knows to replace the number of arguments
passed with the result from the function

Implementation:

For each function call during run-time, the implementation has to...
- pass parameters from the calling function to the called function
- Determine the return address within the caller's code;
- Save the callers return address, stack and memory segments
- Jump to execute the called function

For each function _return_ during run-time, the implementation has to
- Return to the caller the value computed by the called function;
- Recycle the memory resources used by the called function;
- Reinstate the caller's stack and memory segments;
- Jump to the return address in the caller's code.

### Function Call and Return: Implementation Preview

How to implement the VM commands, call, function and return.
- A Computer program typically consists of many functions
- During a given point of time, only a few functions are executing.
- These active function create a calling chain.

- Each function uses a working stack + memory segments
- The working stack and some of the segments should be:
  - created when the function starts running,
  - maintained as long as the function is executing,
  - Recycled when the function returns.

The functions state - Calling pattern is LIFO (a stack)

VM Implementation
Call:
1. Set args: Given `call foo nArgs` We can set the base address of the args stack to the current address of the `SP minus nArgs`
2. Save the caller's frame:
  Need to save the frame of the caller (return address, saved LCL, saved ARG, saved THIS, saved THAT)
3. jump to foo
Entered:
1. Sets up the local segment of the called function.
2. Push nVars variable onto the stack
3. Carry out function
4. return - Copy return value onto argument 0
5. Restore segment pointers of the caller
6. Clear the stack
7. Sets the SP for the caller
8. Jumps to the return address within the callers code

The global stack will consist of many of these function blocks.

Any sufficiently advanced technology is indistinguishable from magic:
- Arthur C. Clarke

Example: Factorial

High-level:
```java
// Tests the factorial function
int main() {
  return factorial(3);
}

// Returns n!
int factorial(int n) {
  if (n==1)
    return 1;
  else
    return n * factorial(n-1);
}
```

Psuedo VM Code:
```javascript
function main
  push 3
  call factorial
  return
function factorial(n)
  push n
  push 1
  eq
  if-goto BASECASE
  push n
  push n
  push 1
  sub
  call factorial
  call mult
  return

label BASECASE
  push 1
  return

function mult(a, b)
  // code omitted...
```

VM Program:
```javascript
function main 0
  push constant 3
  call factorial 1
  return
function factorial 0
  push argument 0
  push constant 1
  eq
  if-goto BASECASE
  push argument 0
  push argument 0
  push constant 1
  sub
  call factorial 1
  call mult 2
  return

label BASECASE
  push constant 1
  return

function mult 2
  // code omitted...
```

### The Function Call and Return Implementation

Vm code might be generated from multiple files, with each
file or 'class' containing many methods / functions.

VM Function Comands:
- call functionName nArgs
- function functionName nVars
- return

Contract: the calling functions view
- Before calling another function, I must push as many arguments as the function expects to get
- Next, I invoke the function using call functionName nArgs
- After the called function returns, the argument values that I pushed before the call have disappeared from the stack, and the return value (that always exists) appears at the top of the stack;
- After the called function returns, all my memory segments are exactly the same as they were before the call.

Contract: The called function's view
- Before I start executing, my argument segment has been initialized with the argument values passed by the caller
- My local variables have been allocated and initialized to zeros
- My static segment has been set to the static segment of the VM file to which I belong
(memory segments this, that, pointer, and temp are undefined upon entry)
- My working stack is empty
- Before returning, I must push a value onto the stack.

The VM Implementation View
VM Code:
```javascript
function Foo.main 4
  ...
  // computes -(19 * (local 3))
  push constant 19
  push local 3
  call Bar.mult 2
  neg
  ...
function Bar.mult 2
  // Returns the product of two
  // arguments (result in local 1)
  ...
  push local 1
  return
```

Becomes:
(Foo.main)
  // assembly code that handles setting up of a function's
  // execution
  ...
  // assembly code that handles push constant 19
  // assembly code that handles push local 3
  // assembly code that saves the caller's state,
  // sets up for the function call, and then:
  goto Bar.mult // in assembly
(Foo$ret.1)
  // assembly code that handles neg
  ...
(Bar.mult)
  // assembly code that handles the setting up of
  // a function's execution
  ...
  // assembly code that handles push local 1
  // assembly code that moves the return value to the
  // caller, reinstates the caller's state, and then:
  goto Foo$ret.1 // in assembly

#### Handling Call

VM command: call functionName nArgs

Assembly Code:
push returnAddress // Using the label declared below
push LCL // saves the LCL of the caller
push ARG
push THIS
push THAT
ARG = SP-5-nArgs // Repositions Arg
LCL = SP // Repositions LCL
goto functionName // Transfers control to the called function
(returnAddress) // Declares a label for the return address

### Handling function

VM command: function functionName nVars

Assembly Code:
(functionName)      // declares a label for the function entry
repeat nVarsTimes:  // nVars = number of local variables
  push 0            // initializes the local variables to 0

### Handling return

Assembly code:
endFrame = LCL // endframe is a temporary variable
retAddr = *(endFrame - 5) // gets the return address
*ARG = pop()  // Repositions the return value for the caller
SP = ARG+1    // Repositions SP of the caller
THAT = *(endFrame - 1)  // Restores THAT of the caller
THIS = *(endFrame - 2)  // Restores THIS of the caller
ARG = *(endFrame - 3)  // Restores ARG of the caller
LCL = *(endFrame - 4)  // Restores LCL of the caller
goto retAddr  // goes to return address in the caller's code

Once SP is repositioned, anything below it becomes recycled and can be uesd by
memory

### VM Translator on the HACK platform

Program compilation and translation. Begin with multiple Jack files
which are converted into multiple .vm files. These are compiled into 
a single .asm file with functions being transformed into labels

#### Booting

##### VM Programming convention

One file in any VM program is expected to be named Main.vm;
one VM function in this file is expected to be named main.

##### VM implementation convention

When the VM implementation starts running, or is reset, it starts
executing the argument-less OS function Sys.init

Sys.init then calls main.main, and enters an infinite loop.

##### Hardware platform convention

Code below should be put in the Hack ROM, starting at address 0
```javascript
// Bootstrap code (should be written in assembly) 
SP=256 // sets stack pointer
Call Sys.init
```

##### Standard mapping of the VM on the Hack Platform

HACK RAM
0...15         Pointers and Register
16...255       Static Variables
256...2047     Stack
2048...16383   Heap
16384...24576  Memory mapped I/O
24577...32767  Unused space

##### Special Symbols

In addition to SP, LCL, ARG, THIS, THAT, R0-R15, we have
- _Xxx.i_ symbols: Each static variable i in file Xxx.vm is translated to Xxx.j where j is incremented each time a new static variable is encountered in the file Xxx.vm.

- _functionName $label_: let foo be a function within a VM file Xxx. Each label bar command within foo should generate and insert into the assembly code stream a symbol _Xxx.foo$bar_. When translating if-goto or goto statements, the full label must be used  .

- _functionName_: each function foo commands within a VM file Xxx should generate and insert into assembly code stream a symbol Xxx.foo that labels the entry point to the functions code.

- _functionName $ret.i_: let foo be a function within a VM file Xxx. Within foo, each function call command should generate and insert into the assembly code stream a symbol Xxx.foo$ret.i where i is a running integer (one such symbol should be generated for each call command within foo). Symbol serves as the return address to the calling function.

### VM Translator: Proposed Implementation

Takes existing VM Translator and augments it to include the functional and branching commands.

#### Main

Input:
- _fileName.vm_: The name of a single source file, or
- _directoryName_: The name of a directory containing one or more .vm source files.

Output:
- _fileName.asm_ file, or
- _directoryName.asm_ file

Process:
- Constructs a CodeWriter
- If input is a .vm file:
  - Constructs a Parser to handle the input file
  - Marches through the input file, parsing each line and generating code form it.
- If the input is a directory:
  - Handles every .vm file in the directory in the manner described above.

Should extend main written in project 7

#### Parser

Need to add ability to parse VM commands goto, if-goto, label, call, function and return

#### CodeWriter

Additional Functionality:
- setFileName, filename (string), informs the codeWriter that the translation of a new VM file has started. (called by main program)
- writeInit, (null), writes the bootstrap code. (must be at beginning)
- writeLabel, label (string)
- writeGoto, label (string)
- writeIf, label (string)
- writeFunction, functionName (string) numVars (int)
- writeCall, functionName (string) numArgs (int)
- writeReturn

#### Project 8: Building the VM Translator, Part 2

Test Programs:
- Program Flow
  - BasicLoop.vm (tests branching commands)
  - FibonacciSeries ()
- FunctionCalls:
  - SimpleFunction
  - nestedCall
  - FibonacciElement
  - StaticsTest

## Week 9 - The Jack Language

- A simple Java-like language
- Object based with no inheritance
- Multi-purpose
- Lends itself to interactive apps
- Can be learned quickly and easily

Three Kinds of comments
/* block comment */
/** API block comment */
// single line

Procedural Processing
- A jack prgram is a collection of one or more Jack Classes, one of which must be called Main.
-  The main class must have a single function called main
- Program's entry point: Main.main

Flow of control - if, while, do

Arrays:
- array is iomplemented as part of standard class library
- Jack arrays are not typed.

Operating System Services:
- Keyboard.readInt
- Output.printString
- Output.printInt
- More...

Jack Data Types:
- Primitives:
  1. int
  2. char
  3. boolean

- Class Types:
- OS: Array, String, ...
Program extensions as needed.

### Object based programming

Abstraction - Implementation
- Users of an abstraction need know nothing about its implementation
- All they need is the class interface (API)

Building a class
- What data do we need?
- Accessors - how to get a value from a class
- Public access of variables is disallowed in JACK
- Need a constructor to pass data into the class.
- need to return this from constuctor
- need to return from all functions regardless of whether they return a value.
- dispose - All objects need to use the dispose method in order to free up the memory used by the object. JACK has no garbage collection.

- Compiler, works ahead of time with OS to allocate memory to a program.

### List Processing

List definition
- The atom null, or
- an atom, followed by a list

Notation: (atom, list)

Examples:
null
(5, null)
(3, (5, null))
(1, ... , (n, null))
Abbreviated as: (), (5), (3, 5)

List example:
v - pointer variable points to base address of list.
each element consists of value and address of next value in list.
- constructor
- atom
Adding to a list involves passing a value and the base address of the previous item.

Sequential access:
- Use while loop to print value of current list item until it is null. Need to move list along each time.
- dispose: recursively disposes of the tail of the operation.

What makes the magic work?
- High-level: the constructor
- Low-level: when compiling the constructor, the compiler plants calls to OS routines that find, and allocate, available memory space for the new object.

### Jack Language Specification

#### Syntax

Elements:
- White space / comments
- keywords
- Symbols
- Constants
- Identifiers

##### Keywords

Program Components:
- class, constructor, method, function
Primitive Types:
- int, boolean, char, void
Variable declarations
- var, static, field
Statements
- let, do, if, else, while, return
Constant values
- true, false, null
Object Reference
- this

##### Symbols

() grouping
[] array indexing
{} groups programmatic units
, Variable list separator
; Statement terminator
= Assignment and comparison operator
. Class membership
+ - * / & | ~ < > Operators

##### Constants

Integer constants e.g. 0 5 100
String constants e.g. "hello"
Boolean - see above
null

##### identifiers

first char must be letter or _.

#### Data Types

Primitive Types:
- int: Non-negative 2's complement integer, 0 to 32767
- boolean: true or false
- char: Unicode character

Class Types:
- Can extend primitive types as required

##### Type Conversions
Number can be converted to character using the Unicode value.
e.g. var char c; let c = 65; // 'A' or/
var String s; let s = "A"; let c = s.charAt(0);

An integer can be assigned to a reference variable, in which case, 
it is treated as a memory address.

e.g. 
var Array arr;
let arr = 5000;
let arr[100] = 17;

An object can be converted into an Array and vice versa
var Fraction a;
var Array arr;
let arr = Array.new(2);
let arr[0] = 2; let arr[1] = 5;
let x = arr;
do x.print() // will print 2/5

#### Classes

- Class = basic complilation unit
- each class Foo is stored in a separate Foo.jack file
- The class name's first character must be an uppercase letter.

begins with field variable declarations
then static variable declarations
then subroutine declarations

Classes that provide functionality
- contain functions only
- Library of services

Classes that represent entities.
- Fractions, String etc

JACKS's standard class library / OS

Math
String
Array
Output
Screen
Keyboard
Memory
Sys

#### Methods

subroutines can be constructors methods or functions.

Must be typed and must return something.

You can have more than one constructor.

Variables:
- static variables - class level subroutines
- Field variables - Object properties, can be manipulated by the class constructors and methods.
- local variables - used by subroutines for local computations
- parameter variables - used to pass to subroutines, behaves like local variables.

Variables must be ...
- declared before they are used
- Typed

Subroutine calls:

Strings:
var String s;
var char c;

// hiding complexity of operations that do this
Compiler allows:
let s = "Hello world";

Arrays:
- instances (objects) of the OS class Array
- not typed
- uni-dimensional

Multi-dimensional arrays need to be Arrays, of arrays.

#### Peculiar features of JACK

The keyword let must be used in assignment.

The keyword let must be used for function calls outside an expression.

Body of a statement must be within curly brackets, even if it contains a single statement.

All subroutines must end with a return

No operator priority:
- The following is unpredictable: 2 + 3 * 4.
- Must used parentheses to force ordering of operations.
- Language is weakly typed.

### Developing Apps using the JACK Language and OS

Use JackCompiler to compile jack files and the VM emulator
to test the application.

Textual apps:
- Screen: 23 rows of 64 characters, b&w
- Font: featured by jack OS
- Output: Jack OS Output class

class Output {
  function void moveCursor(int i, int j)
  function void printChar(char c)
  function void printString(String s)
  function void printInt(int i)
  function void println()
  function void backSpace()  
}

Handling Output Graphics:
Graphical apps:
- Screen: 256 rows of 512 pixels, b&w
- Output: Jack OS Screen class (or do your own)

Handling Inputs
- Standard keyboard
- Input programming: use the OS Keyboard class

Class Keyboard {
  function char keyPressed()
  function char readChar()
  function String readLine(String message)
  function int readInt(String message)
}

class Memory {
  function int peek(int Address)
  function void poke(int address, int value)
  function Array alloc(int size)
  function void deAlloc()
}

Class Sys {
  function void halt()
  function void error(int errorCode)
  function void halt(int duration)
}

Sample Jack Programs:
- Square
- Pong
- Average
- Complex Arrays
- ConvertToBin

Best Practice:
- Watch some existing Jack apps
- Play with supplied apps, and review their code
- Understand UX limitations of the JACK IO
- plan your app carefully
- implement, test and have fun!

Technical
- Writing - use standard text editor
- Optimizing - see the graphics optimization lecture
- Documenting: use standard practice

### A sample jack App: Square Dance

Illustrates:
- OO Design
- A typical interactive application
- Handling inputs and outputs
- Using the OS

### Graphics Optimization

Games typically made from sprites.

Sprite: A two-dimensional bitmap, typically integrated into a larger scene.
Challenges:
- drawing sprites quickly
- Creating smooth animations

Solutions:
- Use the standard OS graphics library
- Use your own library

Can use memory class to peek and poke to select an address and change it.

Custom Drawing:
- Render image by writing numbers into addresses. 

## Week 4 - Compilers 1 - Syntax Analysis

As mentioned, JACK and java use intermediate languages and use a two tier compilation
system.

Take home lessons:
- Tokenizing
- Grammars
- Parsing
- Parse Tress
- XML / Mark up
- Compilation
- Handling data

### Lexical Analysis

Transforms a stream of characters into a stream of meaningful tokens.

Removes white-space and comments.

Five types of tokens:
- Keywords - class constructor function method field static var int char
    boolean void true false null this let do if else while return
- Symbols - { } ( ) [ ] . , ; + - * / & | < > = ~
- integerConstant - a decimal number in range 0..32767
- String Constant - A sequence of unicode characters between " "s,
- identifier - (starts with letter of '_')

TokenizerTest
- Takes stream of characters and outputs xml body of output

### Grammars

A set of rules, describing how tokens can be combined to create valid language constructs

Each rules consists of a left-hand side, listing a template's name, and a right-hand side 
describing how the template is composed.

It's a recursive structure.

#### A Jack Grammar is a set of statements.

e.g

      statement: ifStatement |
                 whileStatement |
                 letStatement
     statements: statement* // 1 of more.
    ifStatement: 'if' '(' expression ')'
                '{' statements '}'
 whileStatement: 'while' '(' expression ')'
                 '{' statements '}'
   letStatement: 'let' varName '=' expression ';'
     expression: term (op term)? // ? denotes 0 or more
           term: varName | constant
        varName: a string not beginning with a digit
       constant: a decimal number
             op: '+' '-' '=' '>' '<'

### Parse Trees

- Determine if the given input confirms to the grammar
- In the process, construct the grammatical structure of the input

It's a recursive tree structure where you encounter tokens or leaves of the tree
which represent the tokens of terminal statements of the syntax.

### Parser Logic

The compilation engine will consist of methods for each possible statement.

There is a set of compileXXX methods, one for (almost) each non-terminal rule xxx.

e.g. compileWhile()

Parsing logic:
- follow right hand side of the rule, parse the input accordingly.
- If the right-hand side specifies a non-terminal rule xxx, call compileXXX
- Do this recursively

Init:
- Advance the tokenizer

(see pic for example of while statement parsing)

compileWhileStatement() {
  eat('while'); code to handle 'while';
  eat('('); code to handle '('
  compileExpression();
  eat(')'); code to handle ')'
  ...
}

eat(string) {
  if (currentToken <> string)
    error...
  else
    advance...
}

- LL Grammar: can be parsed by a recursive descent parser without backtracking.
- LL(k) parser: a parser that needs to look ahead at most k tokens in order to determine
  which rule is applicable
- The grammar that we saw so far is LL(1)

### The JACK Grammar

5 Lexical elements - These are the terminal rules / tokens / atoms
from which JACK exists.

A Jack program is a collection of classes. Each appearing in a separate
file, and each compiled separately. Each class is structured as follows:

_xxx_* appears 0 or more times
_xxx_? appears 0 or 1 times

#### Lexical Elements 

(see 5 types of tokens above)

#### Program Structure
         class: 'class' className '{' classVarDec* subroutineDec* '}'

   classVarDec: ('static'|'field') type varName (',' varName)* ';'

          type: 'int' | 'char' | 'boolean' | className

 subroutineDec: ('constructor' | 'function' | 'method')
                ('void' | type) subroutineName '(' parameterList ')'
                subroutineBody
 parameterList: ((type varName) (, type varName)*)?

subroutineBody: '{' varDec* statements '}'

        varDec: 'var' type varName (',' varName)* ';'

     className: identifier
subroutineName: identifier
       varName: identifier

#### Statements
     statements: statement*
      statement: letStatement | whileStatement | ifStatement
                 | doStatement | returnStatement
   letStatement: 'let' varName('[' expression ']')? '=' expression ';'
    ifStatement: 'if' '(' expression ')' '{' statements '}'
 whileStatement: 'while' '(' expression ')' '{' statements '}'
    doStatement: 'do' subroutineCall ';'
returnStatement: 'return' expression;

#### Expressions
     expression: term (op term)*
           term: integerConstant | stringConstant | keywordConstant |
                 varName | varName '[' expression ']' | subroutineCall |
                 '(' expression ')' | unaryOp term
 subroutineCall: subroutineName '(' expressionList ')' | (className | varName)
                 '.' subroutineName '(' expressionList ')'
 expressionList: (expression (',' expression)*)?
             op: '+' | '-' | '*' | '/' | '&' | '|' | '<' | '>' | '>'
        unaryOp: '-' | '~'
KeywordConstant: 'true' | 'false' | 'null' | 'this'

#### varName Lookahead

When the current token is a varName (some identifier), it can be the first token in
any of these possibilities:
- foo
- foo[expression]
- foo.var(expressionList)
- Foo.bar(expressionList)
- bar(expressionList)

To resolve possibility, we are in, the parser should 'look ahead', save the currentToken, and advance
to get the next one.

Only time that the JACK language is LL(2)

### The JACK Analyzer

Takes input and (for now) generates XML Output which pertains to the
recursive body of the provided JACK code.

- The parser generates marked-up output
- The mark up created a textual parse tree
- Generated according to the Jack grammar

Handling inputs that correspond to terminal rules:

If we encounter a terminalElement xxx of type,
  keyword, symbol, integerConstant, stringConstant, or identifier

Parser generates the output:

<terminalElement> xxx </terminalElement>

If we encounter a non-terminal element, we generate:

<nonTerminal>{resursive output of non-terminal rule}</nonTerminal>

varNames simply generate identifiers.

### JACK: Proposed Implementation

Implementation Plan:
- JackTokenizer
- CompilationEngine
- JackAnalyzer (top-most module)

To run use command:
`node JackAnalyzer input`
where input is:
- a fileName.jack
- directoryName

#### Jack Tokenizer

Handles Lexical Elements

Allows:
- ignoring white space
- Advancing the input, one token at a time
- Getting the value and type of the current token

Example API:
- hasMoreTokens()
- advance()
- tokenType()

Compilation Engine consumes and drives the tokenizer.

#### Compilation Engine

- Gets its input from a JackTokenizer, and emits its output to
an output file.

- The output is generated by a series of compileXXX routines, one
for (almost) every non-terminal rule xxx in the grammar

- Each compileXXX routine is responsible for handling all the tokens
that make up xxx, advancing the tokenizer exactly beyond these tokens, and
outputing the parsing of xxx

API:
- Constructor
- compileClass
  - compileVlassVarDec
  - compileSubroutineDec
  - compileParameterList
  - compileSubroutineBody
  - compileVarDec
- compileStatements
  - compileLet
  - compileIf
  - compileWhile
  - compileDo
  - compileReturn
- compileExpression
  - compileTerm
  - compileExpressionList

Thse rules don't have specific methods:
- type
- className
- subroutineName
- variableName
- statement
- subroutineCall

(these are shallow, or easy to implement)

#### JackAnalyzer

- Top most module

receives file name or directory

Creates Tokenizer - reads file xxx.jack
Creates output file - outputs xxx.xml
Creates and uses compilation engine and uses it to
Create output generated from file given to tokenizer

### Project 10: Building a Syntax Analyser

Contract:
- implement syntax analyzer for the JACK language
- Use it to parse all the supplied test .jack class files
- For each test .jack file, your analyzer should generate an .xml
output file, identical to the supplied compare file

Tools & Resources:
- Test Program and Compare Files: nand2tetris/projects/10
- TextComparer: nand2tetris/tools
- XML file viewer: browser, text editor

Plans:
- Build a tokenizer
- Build a compilation engine
  - basic version (without expressions)
  - complete version

Should not output double-quotes

Following symbold need to be converted to htmlentitie:
'<' - &lt;
'>' - &gt;
'"' - &quot;
'&' - &amp;

compileSubroutineCall logic should be part of compileTerm