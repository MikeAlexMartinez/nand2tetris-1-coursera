// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// Put your code here.

  @sum
  M=0 // sum = 0

  @i
  M=0 // i = 0

  @R2
  M=0 // RAM[2] = 0

  @R0
  D=M
  @n
  M=D // n = RAM[0]

  @R1
  D=M
  @j
  M=D // j = RAM[1]


(LOOP)
  @i
  D=M
  @n
  D=D-M
  @SUM
  D;JEQ // if i === n GOTO SUM

  @j
  D=M
  @sum
  M=M+D // sum = sum + j
  @i
  M=M+1 // i = i + 1
  @LOOP
  0;JMP // go to beginning of loop

(SUM)
  @sum
  D=M
  @R2
  M=D // assign value of sum to R2
  @END
  0;JMP // goto end of program

(END)
  @END
  0;JMP // loop

// Pseudo Code
// sum = 0
// i = 1
// n = RAM[0]
// j = RAM[1]
// 
// LOOP:
//   if i > n goto SUM
//   sum = sum + j
//   i = i + 1
//   goto LOOP
// 
// SUM:
//   RAM[2] = sum
//   goto END
// 
// END:
//   goto END