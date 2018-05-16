package com.nan.first.controller;

import com.nan.first.model.User;
import com.nan.first.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserContorller {
    private final UserRepository userRepository;

    @Autowired//write a class compile a class automatically, like in class implement the interface
    public UserContorller(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/person/save")
    public User save(@RequestParam String name){
        User user = new User();
        user.setName(name);
        if(userRepository.save(user)){
            System.out.println("User object: " + user);
        }
        return user;
    }
}