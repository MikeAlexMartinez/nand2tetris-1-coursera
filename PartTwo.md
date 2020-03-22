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

### VM Implementatoin: Memory Segments.