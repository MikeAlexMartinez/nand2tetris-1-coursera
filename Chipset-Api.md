# Hack Chipset API

## Elementary Gates

Nand(a= ,b= ,out= ); 
And(a= ,b= ,out= ); 
Not(in= ,out= ); 
Or(a= ,b= ,out= ); 
Xor(a= ,b= ,out= ); 
Mux(a= ,b= ,sel= ,out= ); 
DMux(in= ,sel= ,a= ,b= ); 

Or16(a= ,b= ,out= ); 
And16(a= ,b= ,out= ); 
Mux16(a= ,b= ,sel= ,out= ); 
Not16(in= ,out= ); 

Or8Way(in= ,out= ); 
Mux4Way16(a= ,b= ,c= ,d= ,sel= ,out= ); 
Mux8Way16(a= ,b= ,c= ,d= ,e= ,f= ,g= ,h= ,sel= ,out= ); 
DMux4Way(in= ,sel= ,a= ,b= ,c= ,d= ); 
DMux8Way(in= ,sel= ,a= ,b= ,c= ,d= ,e= ,f= ,g= ,h= ); 

HalfAdder(a= ,b= ,sum= , carry= ); 
FullAdder(a= ,b= ,c= ,sum= ,carry= );  
Add16(a= ,b= ,out= ); 
Inc16(in= ,out= ); 
ALU(x= ,y= ,zx= ,nx= ,zy= ,ny= ,f= ,no= ,out= ,zr= ,ng= );

ARegister(in= ,load= ,out= ); 
Bit(in= ,load= ,out= ); 
CPU(inM= ,instruction= ,reset= ,outM= ,writeM= ,addressM= ,pc= ); 
DFF(in= ,out= ); 
DRegister(in= ,load= ,out= ); 
Keyboard(out= ); 
Memory(in= ,load= ,address= ,out= ); 
PC(in= ,load= ,inc= ,reset= ,out= ); 
RAM16K(in= ,load= ,address= ,out= ); 
RAM4K(in= ,load= ,address= ,out= ); 
RAM512(in= ,load= ,address= ,out= ); 
RAM64(in= ,load= ,address= ,out= ); 
RAM8(in= ,load= ,address= ,out= ); 
Register(in= ,load= ,out= ); 
ROM32K(address= ,out= ); 
Screen(in= ,load= ,address= ,out= ); 