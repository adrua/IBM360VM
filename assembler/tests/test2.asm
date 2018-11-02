*0       1         2         3         4         5         6         7 
*2345678901234567890123456789012345678901234567890123456789012345678901
* //////////////////////////////////////////////////////////
* // Name: Peter M. Maurer
* // Program: Sieve of Eratosthenes
* // Due: Never
* // Language: BAL -- IBM 360 Assembly Language
* //////////////////////////////////////////////////////////
* 
SIEVEE  CSECT
        STM   14,12,12(13)   Save registers
        LR    12,15          Establish base register
        USING SIEVEE,12
        ST    13,MYSAVE+4    Link save area for I/O operations
        LA    11,MYSAVE
        ST    11,8(0,13)
        LR    13,11     
        SR    2,2            Master loop index 0-1000
        LA    3,CAND         Pointer to array
        MVI   CAND,0         Flag off 0 & 1
        MVI   CAND+1,0
        LA    7,CAND         Pointer past end of array 
        A     7,=F'1000'
L1      C     2,=F'1000'     Master loop test
        BNL   EL1
        CLI   0(3),0         Is this flagged off?
        BNE   PRIME          No, jump (Must be prime)
        LA    3,1(0,3)       Incr ptr & ctr
        LA    2,1(0,2)
        B     L1             To Master loop test
PRIME   EQU   *              Found a Prime
        LR    6,3            2 is stride 3 is array ptr
        AR    6,2
PLOOP   CR    6,7            Past end of array?
        BNL   EPLOOP
        MVI   0(6),0         Flag off 
        AR    6,2            Next stride
        B     PLOOP
EPLOOP  EQU   *
        LA    3,1(0,3)       Next candidate
        LA    2,1(0,2)
        B     L1             End of main loop
EL1     EQU   *
*Printing is a chore
        OPEN  (OUTDCB,(OUTPUT))
        LA    2,CAND
        SR    3,3
L4      C     3,=F'1000'     Print loop
        BE    RETURN         Done printing
        CLI   0(2),0
        BE    NEXT           Not prime skip
        CVD   3,PN           Print index #
        UNPK  VAL,PN+6(2)
        OI    VAL+2,X'F0'
        PUT   OUTDCB,MSG
NEXT    LA    3,1(0,3)       Next candidate
        LA    2,1(0,2)
        B     L4             To print loop
RETURN  CLOSE (OUTDCB)
        L     13,4(13)       Back out save area
        LM    14,12,12(13)   Restore regs
        SR    15,15          Return code 0
        BR    14             Return
MYSAVE  DC    18F'0'
MSG     DC    C' '           Printer control character
VAL     DS    CL3
	DC    C' is prime'
        DC    129C' '
PN      DS    D
OUTDCB  DCB   DSORG=PS,LRECL=133,RECFM=F,MACRF=PM,DDNAME=SYSOUT
CAND    DC    1000C'1'
        END
