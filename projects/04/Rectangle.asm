// Program: Rectangle.asm
// Draws a filled rectangle at the screen's top left corner.
// The rectangle's width is 16 pixels, and it's height is RAM[0].
// Usage: put a non-negative number (rectangle's hieght) in RAM[0].

  @R0
  D=M
  @n
  M=D // n = RAM[0]

  @i
  M=0 // i = 0

  @SCREEN
  D=A
  @address
  M=D // address = 16384 (base address of the hack screen)

(LOOP)
  @i
  D=M
  @n
  D=D-M
  @END
  D;JGT // if i > n GOTO END

  @address
  A=M
  M=-1 // RAM[address] = -1 (16 pixels) all set to 1

  @i
  M=M+1 // i = i + 1
  @32
  D=A
  @address
  M=M+D // address = address + 32
  @LOOP
  0;JMP // unconditionally jump to start of loop 

(END)
  @END
  0;JMP

// Pseudo code
//  addr = screen
//  n = RAM[0]
//  i = 0
// 
// LOOP:
//   if i > n goto END
//   RAM[addr] = -1
//   // advances to the next row
//   addr = addr + 32
//   i = i + 1
//   goto LOOP
//
// END:
//   goto END