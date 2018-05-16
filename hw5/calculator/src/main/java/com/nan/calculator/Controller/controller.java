package com.nan.calculator.Controller;

import com.nan.calculator.Exception.BadRequestException;
import com.nan.calculator.Model.Result;
import com.nan.calculator.Service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.Arrays;
import java.util.regex.Pattern;

@RestController
public class controller {

    @Autowired
    private ResultService resultService;

    @RequestMapping(value = "/calculator", method = RequestMethod.GET )
    public ModelAndView index(){
        return new ModelAndView("/index.html");
    }

    @RequestMapping(value = "/api/v1/{operator}", method = RequestMethod.GET)
    public Result calculate(@PathVariable String operator, @RequestHeader("hash-alg") String hashMode,
                            @RequestParam("x") String x, @RequestParam("y") String y) throws BadRequestException {
        checkValue(x, y, hashMode, operator);
        return resultService.getResultWithoutDefault(operator, x, y, hashMode);
    }

    @RequestMapping(value = "/api/v1/{operator}", method = RequestMethod.POST)
    public Result calculateWithDefault(@PathVariable String operator, @RequestHeader("hash-alg") String hashMode,
                                       @RequestParam("x") String x, @RequestParam("y") String y) throws BadRequestException {
        checkValue(x, y, hashMode, operator);
        return resultService.getResultWithDefault(operator, x, y, hashMode);
    }

    private boolean isInteger(String str) {
        if (null == str) {
            return false;
        }
        Pattern pattern = Pattern.compile("^[-\\+]?[\\d]*$");
        return pattern.matcher(str).matches();
    }

    private void checkValue(String x, String y, String hashMode, String operator) throws BadRequestException {
        String[] modeList = {"MD5","SHA-1","SHA-256","SHA-512"};
        String[] calModeList = {"add","sub","mul","div","pow"};
        boolean modeFlag = Arrays.asList(modeList).contains(hashMode);
        boolean calModeFlag = Arrays.asList(calModeList).contains(operator);
        if(!calModeFlag){
            throw new BadRequestException("Bad Request! The operation is not existed.");
        }
        if(!modeFlag){
            throw new BadRequestException("Bad Request! This hash mode is not existed.");
        }
        if(!isInteger(x)){
            throw new BadRequestException("Bad Request! x is not Integer");
        }
        if(!isInteger(y)){
            throw new BadRequestException("Bad Request! y is not Integer");
        }
        if(!y.equals("")){
            if(operator.equals("div") && Integer.parseInt(y)==0){
                throw new BadRequestException("Bad Request! when operator is div, y cannot be 0");
            }
        }
    }
}
