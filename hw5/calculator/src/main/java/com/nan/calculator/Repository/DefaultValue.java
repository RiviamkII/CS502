package com.nan.calculator.Repository;

import com.nan.calculator.Model.Parameters;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;

@Repository
public class DefaultValue {

    private Map<String, Parameters> map = new HashMap<>();

    public DefaultValue() {
        map.put("add", new Parameters(0,0));
        map.put("sub", new Parameters(1,0));
        map.put("mul", new Parameters(2,3));
        map.put("div", new Parameters(4,1));
        map.put("pow", new Parameters(8,2));
    }

    public Parameters get(String operator) {
        return map.get(operator);
    }
}