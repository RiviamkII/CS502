package com.nan.calculator.Model;

import java.math.BigInteger;


public class Parameters {

    private BigInteger x;
    private BigInteger y;

    public Parameters(int x, int y){
        this.x = new BigInteger(String.valueOf(x));
        this.y = new BigInteger(String.valueOf(y));
    }
/*
    public Parameters(String x, String y){
        this.x = new BigInteger(x);
        this.y = new BigInteger(y);
    }

    public Parameters(BigInteger x, BigInteger y) {
        this.x = x;
        this.y = y;
    }
*/

    public BigInteger getX() {
        return x;
    }

    public void setX(BigInteger x) {
        this.x = x;
    }

    public BigInteger getY() {
        return y;
    }

    public void setY(BigInteger y) {
        this.y = y;
    }
}
