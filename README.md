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




