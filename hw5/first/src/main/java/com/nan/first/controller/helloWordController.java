package com.nan.first.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class helloWordController {
    @RequestMapping("/helloWord")
    public ModelAndView index(){
        //return "hello,word";
        return new ModelAndView("/index.html");
    }
}