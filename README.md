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

And - Done
Or - Done
Not - Done
Xor - Done
Mux - Done
DMux - Done

And16 - Done
Not16 - Done
Or16 - Done
Mux16 - Done

Or8Way - Done
Mux4Way16 - Done
Mux8Way16 - Done
DMux4Way - 
DMux8Way