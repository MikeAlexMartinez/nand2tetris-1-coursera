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

Hack Assembly:
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

#### The VM Translator: Proposed Solution

#### Project 7: Building the VM Translator: Part One
