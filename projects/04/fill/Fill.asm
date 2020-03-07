// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.

  @previous
  M=0 // previous = 0
  @LISTEN
  M;JMP // go to LISTEN loop

(LISTEN)
  @SCREEN
  D=M
  @filled
  M=D // filled = @SCREEN
  @KBD
  D=M
  @previous
  D=D-M
  @COMPARE
  D;JNE // if keyboard != previous goto COMPARE

(COMPARE)
  @KBD
  D=M
  @EMPTY
  D;JEQ // if keyboard === 0 goto EMPTY

  @filled
  D=M
  @FILL
  D;JEQ // if filled is 0 goto FILL

  @LISTEN
  0;JMP // goto listen

(FILL)
  @fillwith
  M=-1
  @STARTWRITE
  0;JMP // set fillwith to -1 then goto startwrite

(EMPTY)
  @fillwith
  M=0
  @STARTWRITE
  0;JMP // set fillwith to -1 then goto startwrite

(STARTWRITE)
  @i
  M=0 // i = 0
  @8191
  D=A
  @n
  M=D // n = 8191
  @WRITE
  0;JMP // goto WRITE

(WRITE)
  @i
  D=M
  @n
  D=D-M
  @LISTEN
  D;JGT // if i > n GOTO LISTEN

  @i
  D=M
  @SCREEN
  D=D+A // screen = screen + i
  @address
  M=D
  @fillwith
  D=M
  @address
  A=M
  M=D // RAM[address] = fillwith

  @i
  M=M+1 // i = i + 1
  @WRITE
  0;JMP // goto top of write section


// Pseudo code
//   // memoize the state of the KBD
//   previous = 0
//   goto listen
// 
// (LISTEN)
//   filled = @SCREEN // is the screen filled currently?
//   keyboard = @KBD
//   if keyboard != previous goto COMPARE
// 
// (COMPARE):
//   if keyboard === 0 goto EMPTY
//   // keyboard isn't empty and has changed
//   // therefore if filled is 0 we need to write to screen
//   if filled === 0 goto FILL
//   goto LISTEN
// 
// // These functions tell us which value the screen
// // will be filled with
// (FILL)
//   fillwith = -1
//   goto STARTWRITE
// 
// (EMPTY)
//   fillwith = 0
//   goto STARTWRITE
// 
// (STARTWRITE)
//   n = 8191 // number of registers in screen
//   i = 0 // initiate loop
//   goto FILLLOOP
// 
// (WRITE)
//   if i > n goto LISTEN
//   address = screen + i
//   RAM[address] = fillwith
//   i = i + 1
//   goto WRITE
