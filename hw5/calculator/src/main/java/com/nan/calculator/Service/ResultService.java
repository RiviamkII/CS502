package com.nan.calculator.Service;

import com.nan.calculator.Model.Result;
import com.nan.calculator.Repository.DefaultValue;
import org.springframework.beans.factory.annotation.Autowired;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.math.BigInteger;

@org.springframework.stereotype.Service
public class ResultService {

    @Autowired
    private DefaultValue defaultValue;

    public Result getResultWithoutDefault(String operator, String x, String y, String hashMode) {
        BigInteger numX;
        BigInteger numY;
        if (x == null || x.trim().equals("")) {
            numX = defaultValue.get(operator).getX();
        } else {
            numX = new BigInteger(x);
        }
        if (y == null || y.trim().equals("")) {
            numY = defaultValue.get(operator).getY();
        } else {
            numY = new BigInteger(y);
        }
        BigInteger res = getResult(operator, numX, numY);
        StringBuffer toHash = new StringBuffer();
        operator = changeOperator(operator);
        toHash.append(numX).append(operator).append(numY).append("=").append(res.toString());
        String hashedResult = SHA(toHash.toString(), hashMode);
        return new Result.Builder().X(numX.toString()).Y(numY.toString()).operator(operator)
                .result(res.toString()).hashMode(hashMode).hashedResult(hashedResult).build();
    }

    public Result getResultWithDefault(String operator, String x, String y, String hashMode) {
        BigInteger numX, numY;
        if (x == null || x.trim().equals("")) {
            numX = defaultValue.get(operator).getX();
        } else {
            numX = new BigInteger(x);
            defaultValue.get(operator).setX(numX);
        }
        if (y == null || y.trim().equals("")) {
            numY = defaultValue.get(operator).getY();
        } else {
            numY = new BigInteger(y);
            defaultValue.get(operator).setY(numY);
        }
        BigInteger res = getResult(operator, numX, numY);
        StringBuffer toHash = new StringBuffer();
        operator = changeOperator(operator);
        toHash.append(numX).append(operator).append(numY).append("=").append(res.toString());
        String hashedResult = SHA(toHash.toString(), hashMode);
        return new Result.Builder().X(numX.toString()).Y(numY.toString()).operator(operator)
                .result(res.toString()).hashMode(hashMode).hashedResult(hashedResult).build();
    }

    private BigInteger getResult(String operator, BigInteger numX, BigInteger numY) {
        BigInteger res = new BigInteger("0");
        switch (operator) {
            case "add":
                res = numX.add(numY);
                break;
            case "sub":
                res = numX.subtract(numY);
                break;
            case "mul":
                res = numX.multiply(numY);
                break;
            case "div":
                res = numX.divide(numY);
                break;
            case "pow":
                res = numX.pow(numY.intValue());
                break;
        }
        return res;
    }

    private String SHA(String strText, String strType) {
        // 返回值
        String strResult = null;

        // 是否是有效字符串
        if (strText != null && strText.length() > 0) {
            try {
                MessageDigest messageDigest = MessageDigest.getInstance(strType);
                // 传入要加密的字符串
                messageDigest.update(strText.getBytes());
                // 得到 byte 類型结果
                byte byteBuffer[] = messageDigest.digest();
                // 將 byte 轉換爲 string
                StringBuffer strHexString = new StringBuffer();
                // 遍歷 byte buffer
                for (byte aByteBuffer : byteBuffer) {
                    String hex = Integer.toHexString(0xff & aByteBuffer);
                    if (hex.length() == 1) {
                        strHexString.append('0');
                    }
                    strHexString.append(hex);
                }
                // 得到返回結果
                strResult = strHexString.toString();
            } catch (NoSuchAlgorithmException e) {
                e.printStackTrace();
            }
        }
        return strResult;
    }

    private String changeOperator(String operator) {
        switch (operator) {
            case "add":
                operator = "+";
                break;
            case "sub":
                operator = "-";
                break;
            case "mul":
                operator = "*";
                break;
            case "div":
                operator = "/";
                break;
            case "pow":
                operator = "^";
                break;
        }
        return operator;
    }
}
