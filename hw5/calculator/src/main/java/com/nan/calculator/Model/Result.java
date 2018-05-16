package com.nan.calculator.Model;


public class Result {
    private String x;
    private String y;
    private String result;
    private String operator;
    private String hashedResult;
    private String hashMode;

    public Result(String x, String y, String result, String operator) {
        this.x = x;
        this.y = y;
        this.result = result;
        this.operator = operator;
    }

    public Result(Builder builder){
        this.x = builder.x;
        this.y = builder.y;
        this.operator = builder.operator;
        this.result = builder.result;
        this.hashedResult = builder.hashedResult;
        this.hashMode = builder.hashMode;
    }
    public String getX() {
        return x;
    }

    public void setX(String x) {
        this.x = x;
    }

    public String getY() {
        return y;
    }

    public void setY(String y) {
        this.y = y;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public String getHashedResult() {
        return hashedResult;
    }

    public void setHashedResult(String hashedResult) {
        this.hashedResult = hashedResult;
    }

    public String getHashMode() {
        return hashMode;
    }

    public void setHashMode(String hashMode) {
        this.hashMode = hashMode;
    }

    public static class Builder{
        private String x;
        private String y;
        private String result;
        private String operator;
        private String hashedResult;
        private String hashMode;

        public Builder X(String x) {
            this.x = x;
            return this;
        }

        public Builder Y(String y) {
            this.y = y;
            return this;
        }

        public Builder result(String result) {
            this.result = result;
            return this;
        }

        public Builder operator(String operator) {
            this.operator = operator;
            return this;
        }

        public Builder hashedResult(String hashedResult){
            this.hashedResult = hashedResult;
            return this;
        }

        public Builder hashMode(String hashMode){
            this.hashMode = hashMode;
            return this;
        }

        public Result build(){
            return new Result(this);
        }
    }
}
