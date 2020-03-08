# Nand 2 Tetris Course - Part One - Coursera


## Week One - Boolean Functions and Gate Logic

Introduction to Boolean Functions and building gates

### Boolean Logic

AND - Given a and b, if a and b ar both 1 output 1 else 0
OR - Given a or b, if a or b, or both a and b are 1 output 1 else 0
NOT - Given a return the inverse of a, i.e 1 => 0 or 0 => 1

Truth Table - Identifies all possible combinations for given set of variables
and then defines the possible outputs when processed by a given Boolean function.

e.g. Given f(x, y, z) = (x AND y) OR (NOT(x) AND z)

| x | y | z | Output |
|---|---|---|--------|
| 0 | 0 | 0 |   0    |
| 0 | 0 | 1 |   1    |
| 0 | 1 | 0 |   0    |
| 0 | 1 | 1 |   1    |
| 1 | 0 | 0 |   0    |
| 1 | 0 | 1 |   0    |
| 1 | 1 | 0 |   1    |
| 1 | 1 | 1 |   1    |

#### Boolean Identities

Commutative Laws
- (x AND y) = (y AND x)
- (x OR y) = (y OR x)

Associative Laws
- (x AND (y AND z)) = ((x AND y) AND z)
- (x OR (y OR z)) = ((x OR y) OR z)

Distributive Laws
- (x AND (y OR z)) = (x AND y) OR (x AND z) i.e. x must be true
- (x OR (y AND z)) = (x OR y) AND (x OR z) i.e. x or y and z

De Morgan Laws
- NOT(x AND y) = NOT(x) OR NOT(y)
- NOT(x OR y) = NOT(x) AND NOT(y)

Boolean Algebra can be used to simplify expressions,
e.g.
NOT(NOT(x) AND NOT(x OR y)) becomes (using de morgan law)
NOT(NOT(x) AND NOT(x) AND NOT(y)) becomes (using Associative law)
NOT((NOT(x) AND NOT(x)) AND NOT(y)) becomes (using idempotency law)
NOT(NOT(x) AND NOT(y)) becomes (using double negation)
x OR y

Also possible to use a truth table given the variables and one can
figure out if the expression matches the truth table of another known
expression.

### Boolean Function Synthesis

To derive a function from a truth table you should create a function
for each line of the truth table that outputs a 1. And then you append
an Or between each line. Once this is done you can then simplify the statement
using the laws above.

Example f(x, y, z) = NOT(x AND y) AND NOT(z)



Any Boolean function can be represented using an expression containing AND, OR and NOT
operations.

therefore,

Any Boolean function can be represented using an expression containing AND and NOT
operations.

  Proof: (a OR b) = NOT(NOT(a) AND NOT(b))

#### the holy NAND

NAND(a, b) = NOT(a AND b)

| a | b | Out |
|---|---|-----|
| 0 | 0 |  1  |
| 0 | 1 |  1  |
| 1 | 0 |  1  |
| 1 | 1 |  0  |

Anu Boolean function can be represented using an expression containing only NAND operations.

Because all Boolean functions can be represented with NOT and AND gates, we just need
to prove that NOT and AND can be constructed with NAND

Proof:
1. NOT(x) = (x NAND x)
2. (x AND y) = NOT(x NAND y)

### Logic Gates




### HDL - Hardware Description Language



### Project 1 - Chips to Implement

Easy Chips
- And - Done
- Or - Done
- Not - Done
- Xor - Done
- Mux - Done
- DMux - Done

Buses
- And16 - Done
- Not16 - Done
- Or16 - Done
- Mux16 - Done

Splitters
- Or8Way - Done
- Mux4Way16 - Done
- Mux8Way16 - Done
- DMux4Way - Done
- DMux8Way - Done

## Week Two - Boolean Arithmetic and the ALU Roadmap

### Binary Numbers

Using binaries you can represent groups of binary values to represent
numbers.

Maximum with k bits is 1 + 2 + 3 + ... + $2^{k-1}$ = $2^{k}-1$

If you have 8 bits you can represent 256 different things.
Could be:
- 0 to 255 or
- -127 to 127

Decimal -> Binary, what is the largest power of 2 that fits into the current
number.

99 = 64 + 32 + 2 + 1 = 1100011

### Binary Addition

Maniplutating Binary Numbers.

Once you can add, you can almost do most operations. You can also postpone more
complex operations like multiplication to software, however, modern computers don't
necessarily do this in practice.

Adding in binary is the same in practice as base-10 numbers. you add two values together
and carry 1's when the value exceeds the allows number (1).

      01111101
    + 00110110
    = 10110011
carry  1111

Often when a number overflows we do nothing.

#### Building an Adder

##### Half Adder

Only cares about the following, a, b and the resulting sum and carry.
e.g. 1 + 1 = sum of 0, carry of 1

A half adder chip interface:

CHIP HalfAdder {
  IN a, b;
  OUT sum, carry;
  PARTS:
    // Put your code here
}

| a | b | sum | carry |
|---|---|-----|-------|
| 0 | 0 |  0  |   0   |
| 0 | 1 |  1  |   0   |
| 1 | 0 |  1  |   0   |
| 1 | 1 |  0  |   1   |

##### Full Adder

A full adder is similar to a half adder exep it also cares about the 
inital carry forward from any previous additions.

Therefore the chip truth table looks like so:

| a | b | c | sum | carry |
|---|---|---|-----|-------|
| 0 | 0 | 0 |  0  |   0   |
| 0 | 0 | 1 |  1  |   0   |
| 0 | 1 | 0 |  1  |   0   |
| 0 | 1 | 1 |  0  |   1   |
| 1 | 0 | 0 |  1  |   0   |
| 1 | 0 | 1 |  0  |   1   |
| 1 | 1 | 0 |  0  |   1   |
| 1 | 1 | 1 |  1  |   1   |

And it's interface:

CHIP FullAdder {
  IN a, b, c;
  OUT sum, carry;
  PARTS:
    // Put your code here
}

##### Multi-bit Adder

This first uses a half adder and then 
progresses on to use full adders for the remaining steps.

A 16-bit adder takes the following:
out = a + b, as 16-bit integers. (overflow ignored)

CHIP Add16 {
  IN a[16], b[16];
  OUT out[16];
  PARTS:
    // Put your code here
}

### Negative Numbers

Most simple approach for representing negative numbers in computers
starts by using left most bit to denote whether something is negative
or positive and then the rest of the numbers are represented as per normal using
the remaining bits. This approach can lead to issues as 0 will have to internal
representations and all logic needs to be aware of the sign of the sum.

A more common modern approach is called 2's complement.

0000 =  0
0001 =  1
0010 =  2
0011 =  3
0100 =  4
0101 =  5
0110 =  6
0111 =  7
1000 = -8 = 0 - $2^{n-1}$ where n = number of bits.
1001 = -7 = 1 - 8
1010 = -6 = 2 - 8
1011 = -5 = 3 - 8
1100 = -4 = 4 - 8 
1101 = -3 = 5 - 8
1110 = -2 = 6 - 8
1111 = -1 = 7 - 8


Represent the Negative number ising the positive number: $2^{n}-x$

The range is as follow:
- Positive numbers: $0 ... 2^{n-1}-1$
- Negative numbers: $-1 ... -2^{n-1}-1$

Addition in 2's Complement (for Free)

  -2      14       1110
+ -3    + 13    +  1101
= -5    = 11    = 11011

11011 = 27
 1011 = 11 which in 2's complement = -5

e.g. 7 + -5 = 2

         0111  
    +    1011
    = (1)0010 = 2 in 2's Complement
carry (1)111

#### Computing negative x

Given an input x we need to output -x

Idea: $2^{n} - x = 1 + (2^{n}-1) - x$

$2^{n} = 11111111$
to minus a number, you you can flip the bits, and then add a 1.

e.g.

Input: 4 = 0100

 1111
-0100 (flip the bits)
=1011
+   1 (add one)
=1100

Output: -4 = 1100

### Arithmetic Logic Unit

Von Neumann Architechure
              Computer System
       |-------------------------|
       |                  CPU    |
       |           ->            |
Input -|->  Memory        ALU   -|-> Output
       |           <-            |
       |               Control   |
       |-------------------------|

The ALU computes a function on the two inputs, and outputs the result

i.e. f(input1, input2) => Output

f: one out of a family of pre-defined arithmetic amnd logical functions
- Arithmetic Operations, integer addition, multiplication, division...
- Logical operations: And, Or, Xor, ...

Which operations should the ALU perform? A hardware / software tradeoff...

#### The Hack ALU

- Operates on two 16-bit, two's complement values
- Outputs a 16-bit, two's complement value
- Which function to compute is set by six 1-bit inputs
- Computes one out of a family of 18 functions
- Also outputs two 1-bit values (to be discussed)

Functional specification (truth table of chip) can be view in project comparison file.

Possible outputs:
Add truth table here 0
Add truth table here 1
Add truth table here -1
Add truth table here x
Add truth table here y
Add truth table here !x
Add truth table here !y
Add truth table here -x
Add truth table here -y
Add truth table here x+1
Add truth table here y+1
Add truth table here x-1
Add truth table here y-1
Add truth table here x+y
Add truth table here x-y
Add truth table here y-x
Add truth table here x&y
Add truth table here x|y

Control Bits: (These happen in order, so zx would be run before nx)
PreSetting Inputs:
- zx: if zx is 1 set x to 0
- nx: if nx then x = !x
- zy: if zy is 1 then set y to 0
- ny: if ny then y = !y
Compute setting:
- f: if f then out=x+y else out=x&y
Post-setting the output
- no: if no then out=!out

out(x, y)=...

x = 0
y = 1
out = 1
out = 0

output control bits
if out == 0 then zr = 1, else zr = 0
if out < 0 then ng = 1, else ng = 0

##### The Hack ALU is
- simple
- elegant
- easy to implement
  - set 16-bit value to 0000000000000000
  - set 16-bit value to 1111111111111111
  - Negate a 16-bit value (bit-wise)
  - Compute + or & on two 16-bit values

### Project 2

- You can use all chips developed thus far.

Need to build the following chips:
- HalfAdder
- FullAdder
- Add16
- Inc16
- ALU (no-stat)
- ALU

#### Half Adder

Can be built using two elementary gates

a -> Half Adder -> Sum
b ->            -> Carry

##### Chip starter code

CHIP HalfAdder {
  IN a, b;
  OUT sum, carry;

  PARTS:
  // Put your code here
}

##### Truth Table

| a | b | sum | carry |
|---|---|-----|-------|
| 0 | 0 |  0  |   0   |
| 0 | 1 |  1  |   0   |
| 1 | 0 |  1  |   0   |
| 1 | 1 |  0  |   1   |

#### Full Adder

Can be built from two half adders and some 'glue'

a ->            -> Sum
b -> Full Adder -> Carry
c ->

##### Chip starter code

/** Computes the sum of two bits. **/
CHIP FullAdder {
  IN a, b, c;
  OUT sum, carry;

  PARTS:
  // Put your code here
}

##### Truth Table

| a | b | c | sum | carry |
|---|---|---|-----|-------|
| 0 | 0 | 0 |  0  |   0   |
| 0 | 0 | 1 |  1  |   0   |
| 0 | 1 | 0 |  1  |   0   |
| 0 | 1 | 1 |  0  |   1   |
| 1 | 0 | 0 |  1  |   0   |
| 1 | 0 | 1 |  0  |   1   |
| 1 | 1 | 0 |  0  |   1   |
| 1 | 1 | 1 |  1  |   1   |

#### 16-bit adder

- An n-bit adder can be built from n full-adder chips
- The carry bit is "piped" from right to left
- The MSB carry bit is ignored

##### Chip starter code

/**
 * Adds two 16-bit, 2's-complement values.
 * The most-significant carry bit is ignored
 */
CHIP Add16 {
  IN a[16], b[16];
  OUT out[16];

  PARTS:
  // Put your code here
}

#### 16-bit incrementor

- Simple version of an adder.
- Single  

###### Chip starter code

/**
 * Outputs in + 1.
 * The most-significant carry bit is ignored
 */
CHIP Inc16 {
  IN in[16];
  OUT out[16];

  PARTS:
  // Put your code here
}

#### ALU -> See project files

You can build this chip using the 16 bit adder and various
chips from project 1. Can be build with less than 20 lines
of HDL code.

### Perspectives

You can speed up an adder by using carry lookahead.

## Week Three - Sequential Logic and RAM

Hello, time.
We want to use the same hardware over time.
We also want to remember state.
Computers have a finite speed.

The clock - The clock is an oscillator that allows us to conceptualise time
as a single round of oscillations from 1 to 0. So time is a series of 
integer steps.

Combinatorial Logic Vs. Sequential Logic

Combinatoral: out[t] = function( in[t] )
Sequential: out[t] = function( in[t-1] )

### Flip Flops

| Time  | 1    2    3
|-------|
| State | 

Moving information from time t-1 to time t is still missing. The element,
needs to remember a bit and carry it forward. It requires state. These types
of chips can flip and flop from 0 and to 1.

A Clocked Flip Flop.

in -> DFF -> Out

out[t] = in[t-1]. Triangle on chip indicates the chip has state.

Sequential Logic Implementation: Sits after Combinatorial logic and output, 
allowing us to store information or feed it back to the system as and when 
required.

Remembering Forever:
Goal: Remeber an input bit "forever" until requested to load a new value. 

1-Bit Register utilises a DFF and a Mux input to decide whehter to use the 
current input or the new input.

### Memory Units

Different Types of memory:
- Main memory: RAM,
- Secondary memory: disks, etc
- Volatile / non-volatile

RAM:
- Data
- Instructions

Perspective:
- Physical
- Logical

w (word width): 16-bit, 32-bit, 64-bit

Most basic memory unit is a register.

Registers State - The value which is currently stored inside the register.

To remember a value, the load needs to be set to 1, and the input will be 
the value that needs to be remembered. the output value will now be 
available as the new value on the next cycle.

RAM Abstaction: a sequence of n addressable registers, with addresses 0 to 
n-1.

At any point in time, only one register in the RAM is selected.

The input is called address.

k width of address input = k = log2n

RAM is a sequential chip, with a clocked behaviour.

To read register, set register to i, and the out will reflect this.

To set register:
- set address to i
- set in = v
- set load = 1

### Counters

- Computer must keep track of which instruction should be fetched and executed next
- This control mechanism can be realised by a Program Counter
- The PC contains teh address of the instruction that will be fetched and executed next
- Three possible control settings:
  1. Reset: fetch first instruction
  2. Next: Fetch next instruction
  3. GoTo: fetch instrcution n

A chip that realises the described abstraction.

### Project Overview - Week 3

Can use all build chips & Data Flip flop (DFF gate)

Goal: Build the following chips:
- 1-Bit
- Register
- RAM8
- RAM64
- RAM512
- RAM4K
- RAM16K
- PC

#### 1-Bit

Can be build from Dmux and DFF.

if load then {
  Bit's state = in
  // from next cycle onwards:
  out emits the new state
}
else out emits the same value as that of the previous cycle

#### Register (16-bit)

Add wiring to 16 1 bit registers

#### RAM8K

- Feed the in value to all the registers, simultaneously.
- Use  mux / demux chips to select the right register

#### RAM n K

- stack RAM chips to create larger RAM chips.
- Think about the rams address input as consisting of two fields;
  - One field can be used to select a RAM-part;
  - The other field can be used to seelct a register within the RAM-part
- Use mux / demux logic to affect this addressing issue

#### PC - Program Counter

Can be built from a register, an incrementor, and some logic gates.


## Week Four - Machine Languages

Same Hardware can run many different Software programs.

Universal Turing Machine - Can simulate any machine
Von Neumann Architecture - Puts Theory into practice

Hardware needs to know, what to do, and where to do it.

People use High level languages which are then compiled into
machine language which allows the hardware to know what to do.

Mnemonics : BReaks down collections of bits, into their
component instructions. e.g.

| 0100010 | 0011 | 0010 |
|----|---|---|
| ADD | R3 | R2 |

By allowing users to use machine language instructions by
converting symbolic language into the corresponding bits.

### Machine Language Elements

- Specification of the Hardware / Software interface
  - What are the supported operations
  - What do they operate on
  - How is the program controlled

- Usually in close correspondence to actual Hardware architecture
  - Not necesseraily so

- Cost-Performance Tradeoff
  - Silicon Area
  - Time to Complete Instruction

Machine Operations
- Usually correspond to whats implemented in the hardware
  - Arithmetic operations: add, subtract etc
  - Logical Operations: and, or
  - Flow Control: "goto instructionX', if C goto instruction Y

- Differences between machine languages
  - Richness of the set of operations
  - Data Types

- Addressing
  - Accessing memory is expensive
    - need to supply a long address
    - Getting the memory contents into the CPU takes time

You have sequence of memories that allow you to access certain
working memory faster. These are certain caches.

CPUs Normally have a few a very easy to access registers.

These could contain data, or even an address for memory that is contained
in a different part of the computer.

Addressing Modes:
- Register: Add R1, R2
- Direct: Add R2, M[200]
- Indirect: Add R1, @A
- Immediate: Add 73, R1

Input / Output

- Many types of input and output devices
  - Keyboard, mouse, camera, sensors, printers, screen, sound...
- CPU needs some kind of protocol to talk to each of them.
  - Software "Drivers" know these protocols
- One general method of interaction uses "memory mapping"
  - Memory location 12345 holds direction of the last movement
    of the mouse
  - Memory location 45678 is not a real memory location but a way to tell
    the printer which paper to use

Flow Control:
- Usually the cPU executes machine instructions in sequence
- Sometimes we need to jump unconditionally to another location
- Sometimes a loop might be conditional

### The Hack Computer and Machine Language

A 16-bit machine consisting of:
Instruction Memory -> CPU <-> Data memory

Data Memory RAM: a sequence of 16-bit registers:
  RAM[0], RAM[1]...

INstruction memory (ROM): a seuqence of 16-bit registers

CPU: performs 16-bit instructions

Instruction bus / data bus / address buses

Has a reset button

Hack Machine languages:
- 16-bit A-instructions
- 16-bit C-instructions

Hack program - sequence of instructions written in
  hack machine language

Control:
- The ROM is loaded with a HACK program
- The reset button is pushed
- The program is loaded into the ROM

HAck computer: 3 registers
A register - 16 bit
D register - 16 bit
M register - only one is every selected

The A instruction:
Syntax @Value
where value is either:
- a non-negative decimal constant or
- a symbol referring to such a constant (later)

Semantics:
- Set the A register to value
- Side Effect: RAM[A] becomes the selected RAM register

Example: @21
Effect
- sets the A register to 21
- RAM[21] becomes the selected RAM register
- M=-1 // RAM[21] = -1 (the selected memory now = -1)

The C instruction
dest = comp ; jump (both dest and jump are optional)

dest = null, M, D, MD, A, AM, AD, AMD

jump = null, JGT, JEQ, JGE, JLT, JNE, JLE, JMP

Semantics: 
- Computes the value of comp
- Stores the result in dest
- If the boolean expression (comp jump 0) is true,
- jumps to execture the instruction stored in ROM[A].

Example:
// set the D register to -1
D=-1
// Set RAM[300] to the value of the D register minus 1
@300
M=D-1
// If D-1==0 jump to execute the instruction stored in ROM[56]
@56 // A=56
D-1;JEQ // if (d-1==0) goto 56

// unconditional Jump
0; JMP

### Hack Language Specification

The A instruction

Symbolic = @value = @21
Binary = @value = 0 000000000010101

### C instruction
dest = comp; jump

bit
1 1 - opcode
2 1 - not used
3 1 - not used
a  comp bits
c1 
c2
c3
c4
c5
c6
d1 dest bits
d2
d3
j1 jump bits
j2
j3

#### Comp Truth Table

| comp ||       c1 | c2 | c3 | c4 | c5 | c6 |
| 0    |      | 1  | 0  | 1  | 0  | 1  | 0  |
| 1    |      | 1  | 1  | 1  | 1  | 1  | 1  |
| -1   |      | 1  | 1  | 1  | 0  | 1  | 0  |
| D    |      | 0  | 0  | 1  | 1  | 0  | 0  |
| A    | M    | 1  | 1  | 0  | 0  | 0  | 0  |
| !D   |      | 0  | 0  | 1  | 1  | 0  | 1  |
| !A   | !M   | 1  | 1  | 0  | 0  | 0  | 1  |
| -D   |      | 0  | 0  | 1  | 1  | 1  | 1  |
| -A   | -M   | 1  | 1  | 0  | 0  | 1  | 1  |
| D+1  |      | 0  | 1  | 1  | 1  | 1  | 1  |
| A+1  | M+1  | 1  | 1  | 0  | 1  | 1  | 1  |
| D-1  |      | 0  | 0  | 1  | 1  | 1  | 0  |
| A-1  | M-1  | 1  | 1  | 0  | 0  | 1  | 0  |
| D+A  | D+M  | 0  | 0  | 0  | 0  | 1  | 0  |
| D-A  | D-M  | 0  | 1  | 0  | 0  | 1  | 1  |
| A-D  | M-D  | 0  | 0  | 0  | 1  | 1  | 1  |
| D&A  | D&M  | 0  | 0  | 0  | 0  | 0  | 0  |
| DorA | DorM | 0  | 1  | 0  | 1  | 0  | 1  |
| a=0  | a=1  |

#### Dest mapping

| dest | d1 | d2 | d3 | effect: the value is stored in |
| null | 0 |  0 |  0 |  Value is not stored |
| M    | 0 |  0 |  1 |  M register |
| D    | 0 |  1 |  0 |  D register |
| MD   | 0 |  1 |  1 |  M register and D register |
| A    | 1 |  0 |  0 |  A register |
| AM   | 1 |  0 |  1 |  A register and M register |
| AD   | 1 |  1 |  0 |  A register and D register |
| AMD  | 1 |  1 |  1 |  A register, RAM[A] and D register |

#### Jump Mapping

| dest | j1 | j2 | j3 | effect |
| null | 0 |  0 |  0 |  jump |
| JGT  | 0 |  0 |  1 |  if out > 0 |
| JEQ  | 0 |  1 |  0 |  if out = 0 |
| JGE  | 0 |  1 |  1 |  if out >= 0 |
| JLT  | 1 |  0 |  0 |  if out < 0 |
| JNE  | 1 |  0 |  1 |  if out != 0 |
| JLE  | 1 |  1 |  0 |  if out <= 0 |
| JMP  | 1 |  1 |  1 |  unconditional |

### Hack Program

- A hack program is  a sequence of Hack instructions
- White space is permitted
- Comments are used to explain code
- There are better ways to write code (using symbols for example)

### Input / Output

Peripheral Devices
- Keyboard
- Screen

High-Level approach - Sophisticated software libraries enabling text, graphics, animation
audio, video, etc

Low-level - bits

#### Screen Memory map

Dedicated to manage a display unit
The physical display is continuosly refreshed from the memory map, many times per second.
Output is effected by writing code that manipulates the screen memory map.

Screen is 256x512, b/w. height by width.
Can only access 16-bits in one chunk.

8191 bytes of memory for screen (each bit corresponds to a single pixel)
32 bytes per row.

1. word = screen[32*row + col/16]
   word = RAM[16834(base-address) + 32*row + col/16]
2. Set the (col % 16)th bit of work to 0 or 1
3. Commit word to RAM

#### Keyboard memory map

The keyboard has a single register that contains any key
if any that is being pressed.

The HACK Character set is a smaller version of ASCII.

RAM[24576] is where the keyboard memory map lives in the HACK computer.

### The Hack Prgramming Language part one

You can use the CPU Emulator to test symbolic code.

4.6 - Working with registers and memory

D - data register
A - address / data register
M - The currently selected register

Examples:
// D=10
@10 // select D 10
D=A

// D++
D=D+1

// D=RAM[17]
@17
D=M

// RAM[17]=0
@17
M=0

// RAM[17]=10
@10
D=A
@17
M=D

// RAM[5] = RAM[3]
@3
D=M
@5
M=D

Best practice is to end program with an infinite loop.
Want to avoid noop attacks.

#### Built In Symbols
Hack assembly language has builtin symbols
R0 = 0
R1 = 1
R2 = 2
... ...
R15=15

These symbols can be used to denote "Virtual Registers"

instead of:
// RAM[5]=15
@15
D=A

@5
M=D

should use:
// RAM[5]=15
@15
D=A

@R5 // this becomes @5
M=D

!!! Hack is case-sensitive !!!

SCREEN = 16384
KDB = 24576

SP = 0
LCL = 1
ARG = 2
THIS = 3
THAT = 4

#### Hack Language Unit 2
4.7 - Branching, Variables and Iteration

Branching - Only one branching apparatus in ML
JUMP or GOTO

Example in Signum.asm

Even seemingly simple tasks in Machine code can result in
obtuse and difficult to understand code.

"Instead of imagining that our main task as programmers
is to instruct a computer what to do, let us
concentrate rather on explaining to human being what
we want a computer to do." - Donald Knuth

##### Labels

Label declarations can make the code more descriptive,
but do not generate a code / aren't translated

Each reference to a label is replaced with a reference
to the instruction number following that label's
declaration.

##### Variable

An abstraction to a container that has a name and a value

an example of
@temp - find an available register, and use it to represent the variable temp.

For example, the assembler might assign a variable to a specific memory address 

- A reference to a symbol that has no corresponding label declaration is treated as 
  a reference to a variable
- Variables are allocated from the RAM address 16 onward

You can load a program anywhere into memory as long as you know the base address of 
the program, i.e. once you know where it should begin and end.

Best Practice:
1. Design program in Psuedocode
2. Write the program in assembly language
3. Test the program (on paper) using the variable-value trace table

##### Iteration

// Program

#### 4.8 - Pointers, Input & Output

##### Pointers

- Variables that store memory addresses, like arr and i, are called pointers.

- Hack pointer logic: Whenever we have to access memory using a pointer we need an
instruction like A=M
- Typical pointer semantics: "set the address register to the contents of some memory
register"

Two standard input and output devices

Keyboard with keyboard in memory
- @KBD (RAM[24576])

Screen with screen memory map
- @SCREEN (RAM[16384]) base address of map

I/O programming example:
See Rectangle.asm

Check to see which key is pressed
If register = 0, no key is pressed.
Use inifinite loop to check if a key is being pressed

#### Compilation

A compiler allows you to use an abstraction of code
which is then converted to machine level language

#### Project

Mult.asm => Create a program that performs R2 = R0 * R1

## Week 5 - Computer Architecture

CPU of HACK compiuter will be made of Two elements, The ALU
and a handful of registers.

There is three types of information that passes thorughout the system.

The data -> The numbers being manipulated etc.
Addresses -> Which piece of data are we manipulating.
Control -> what to do where and when.

You have a number of buses.
- Data bus
- Control bus
- Address bus

The ALU
- Needs to accept data and send outwards.
- Control bus, to allow control what it needs to do.

The Registers
- Needs to be able to accept data.
- Sometimes needs to specify addresses.
- Lets the system know where a piece of data should be saved.

The Memory
- Stores the running programs and the data.
- Address bus specific what needs to be written to and read from.
- Program, needs to accept and address, and may give the data that is required.
- Program needs to be connected to control bus, to tell system that needs to be done.

### The Fetch Execute cycle

A computer fetches one instruction after the other, executing each one in turn.

Fetching
- Put the location of the next instruciton into the address of the program memeory,
- Get the instruction code itself by reading the memory contents at that location
- Normally the address of the instruction to execute is kept in a program counter.

The program counter, will normally be
- the old value, plus one, or, 
- A jump achieved by loading another value

Executing
- The instruction code specfies "what to do"
  - Which arithmetic or logical instruction
  - What memory to access
  - if / where to jump

- Often different subsets of the bits control different aspects
of the operation.
- Executing the operation involves also accessing registers and / or data memory.

Simpler Solution: Harvard Architecture
- Variant of von Neumann architecture
- Keep program and Data in two separate memory modules
- Complication avoided

Hack Central Processing Unit
- The centre-piece of every computing architecture
- The hub of computation and the seat of control.
- Which instruction should be fetched and executed.
- Given a 16-bit processor, designed to:
  - Execute the current instruction
  - Figure out which instruction to execute next
  (Machine language written in HACK machine language)

#### HACK CPU interface
IN
- inM 16, from data memory
- instruction 16, from Instruction memory
- reset 1, from the user
OUT
Next three go to Data memory
- outM 16 - Data value
- writeM 1 - Write to memory?
- addressM 15 - where to write
This goes to instruction memory
- pc 15 - Address of next instruction

#### Hack CPU implementation - see picture
contains the foolowing
Mux16
A Register
PC
Mux16
D Register
ALU
c = control bits

##### Instruction handing
contains Mux16, A register
- Receives A-Instruction (MSB is 0)
  - Decode into op-code + 15-bit value
  - Stores the value in the A-register
  - Outputs the value

- Receives C-instruction (MSB is 1)
  - Decoded into following
    - Op-code
    - ALU control bits
    - Destination load bits
    - Jump Bits

- Can receive from instruction, or
- from ALU output

ALU data inputs:
- From the D-register
- From the A-register / M-register
- 6 Control bits from instruction

Result of ALU, fed simultaneously to:
- D-register (routed internally)
- A-register (routed internally)
- M-register (output)

Which register received the output of the ALU
is determined by the instructions destination bits

ALU also outputs control bits
this controls the control logic of the CPU.

There is a reset button, if someone pushes the reset button,
The computer will start running the current program, if you decide to
reset the program, the computer will restart.

The PC received input from the A-register a load bit.

Program Counter Abstraction
- Emits the address of the next instruction
- To start / restart the programs execution: PC=0
- no jump: PC++
- goto: PC = A
- conditional goto: if the condition is true PC = A else PC++

PC logic
if (reset === 1) PC = 0
else
  // current instruction
  load = f(jump bits, ALU control outputs)
  if (load==1) PC=A
  else PC++

PC output
The address of the next instruction

### - The Hack Computer

Abstraction:
A computer capable of running programs in the
hack machine language.

Implementation:
Built from the Hack chip-set

