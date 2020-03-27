// push constant 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1
// push constant 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1
// eq
@SP
AM=M-1
D=M
@SP
A=M-1
D=M-D
@NEXT.1
D; JEQ
@SP
A=M-1
M=0
@END.1
0; JMP
(NEXT.1)
@SP
A=M-1
M=-1
(END.1)
// push constant 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1
// push constant 16
@16
D=A
@SP
A=M
M=D
@SP
M=M+1
// eq
@SP
AM=M-1
D=M
@SP
A=M-1
D=M-D
@NEXT.2
D; JEQ
@SP
A=M-1
M=0
@END.2
0; JMP
(NEXT.2)
@SP
A=M-1
M=-1
(END.2)
// push constant 16
@16
D=A
@SP
A=M
M=D
@SP
M=M+1
// push constant 17
@17
D=A
@SP
A=M
M=D
@SP
M=M+1
// eq
@SP
AM=M-1
D=M
@SP
A=M-1
D=M-D
@NEXT.3
D; JEQ
@SP
A=M-1
M=0
@END.3
0; JMP
(NEXT.3)
@SP
A=M-1
M=-1
(END.3)
// push constant 892
@892
D=A
@SP
A=M
M=D
@SP
M=M+1
// push constant 891
@891
D=A
@SP
A=M
M=D
@SP
M=M+1
// lt
@SP
AM=M-1
D=M
@SP
A=M-1
D=M-D
@NEXT.4
D; JLT
@SP
A=M-1
M=0
@END.4
0; JMP
(NEXT.4)
@SP
A=M-1
M=-1
(END.4)
// push constant 891
@891
D=A
@SP
A=M
M=D
@SP
M=M+1
// push constant 892
@892
D=A
@SP
A=M
M=D
@SP
M=M+1
// lt
@SP
AM=M-1
D=M
@SP
A=M-1
D=M-D
@NEXT.5
D; JLT
@SP
A=M-1
M=0
@END.5
0; JMP
(NEXT.5)
@SP
A=M-1
M=-1
(END.5)
// push constant 891
@891
D=A
@SP
A=M
M=D
@SP
M=M+1
// push constant 891
@891
D=A
@SP
A=M
M=D
@SP
M=M+1
// lt
@SP
AM=M-1
D=M
@SP
A=M-1
D=M-D
@NEXT.6
D; JLT
@SP
A=M-1
M=0
@END.6
0; JMP
(NEXT.6)
@SP
A=M-1
M=-1
(END.6)
// push constant 32767
@32767
D=A
@SP
A=M
M=D
@SP
M=M+1
// push constant 32766
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1
// gt
@SP
AM=M-1
D=M
@SP
A=M-1
D=M-D
@NEXT.7
D; JGT
@SP
A=M-1
M=0
@END.7
0; JMP
(NEXT.7)
@SP
A=M-1
M=-1
(END.7)
// push constant 32766
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1
// push constant 32767
@32767
D=A
@SP
A=M
M=D
@SP
M=M+1
// gt
@SP
AM=M-1
D=M
@SP
A=M-1
D=M-D
@NEXT.8
D; JGT
@SP
A=M-1
M=0
@END.8
0; JMP
(NEXT.8)
@SP
A=M-1
M=-1
(END.8)
// push constant 32766
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1
// push constant 32766
@32766
D=A
@SP
A=M
M=D
@SP
M=M+1
// gt
@SP
AM=M-1
D=M
@SP
A=M-1
D=M-D
@NEXT.9
D; JGT
@SP
A=M-1
M=0
@END.9
0; JMP
(NEXT.9)
@SP
A=M-1
M=-1
(END.9)
// push constant 57
@57
D=A
@SP
A=M
M=D
@SP
M=M+1
// push constant 31
@31
D=A
@SP
A=M
M=D
@SP
M=M+1
// push constant 53
@53
D=A
@SP
A=M
M=D
@SP
M=M+1
// add
@SP
AM=M-1
D=M
@SP
A=M-1
M=M+D
// push constant 112
@112
D=A
@SP
A=M
M=D
@SP
M=M+1
// sub
@SP
AM=M-1
D=M
@SP
A=M-1
M=M-D
// neg
@SP
A=M-1
M=-M
// and
@SP
AM=M-1
D=M
@SP
A=M-1
M=D&M
// push constant 82
@82
D=A
@SP
A=M
M=D
@SP
M=M+1
// or
@SP
AM=M-1
D=M
@SP
A=M-1
M=D|M
// not
@SP
A=M-1
M=!M