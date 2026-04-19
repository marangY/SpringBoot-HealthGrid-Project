package com.example.HealthGrid.controller;

import com.example.HealthGrid.Form.LoginForm;
import com.example.HealthGrid.Form.OtpLoginForm;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@Slf4j
@ToString
@RequiredArgsConstructor
public class UserController {
    @GetMapping("/login")
    public String loginPage(Model model) {
        model.addAttribute("loginForm", new LoginForm());
        model.addAttribute("errorMessage", null); // 오류 시 메시지 전달
        return "login";
    }

    @PostMapping("/login")
    public String login(@ModelAttribute LoginForm form, HttpSession session, Model model) {
        // 비밀번호 로그인 처리
        // Spring Security 사용 시 SecurityConfig에서 처리
        return "login";
    }

    @PostMapping("/login/otp")
    public String loginOtp(@ModelAttribute OtpLoginForm form, Model model) {
        // OTP 로그인 처리
        return "login/otp";
    }
}
