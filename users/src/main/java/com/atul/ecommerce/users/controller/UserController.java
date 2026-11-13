package com.atul.ecommerce.users.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import com.atul.ecommerce.users.entity.User;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.ui.Model;
import com.atul.ecommerce.users.service.UserService;

import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
import com.atul.ecommerce.users.service.JWTService;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@Controller
public class UserController {

    UserService userService;
    JWTService jwtService;

    @Autowired
    UserController(UserService userService, JWTService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/auth/login")
    public ResponseEntity<Object> loginUser(@RequestBody User user) {
        boolean valid = userService.validateUser(user);
        if(valid) {
            user.setRole(userService.getUserByEmail(user.getEmail()).getRole()) ;
            String token = jwtService.generateToken(user.getEmail(), user.getRole());
            return ResponseEntity.ok(Map.of("token", token));
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        userService.add(user);
        return "redirect:/auth/login";
    }

}
