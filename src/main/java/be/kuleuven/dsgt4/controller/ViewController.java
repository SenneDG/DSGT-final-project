package be.kuleuven.dsgt4.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ViewController {

    @GetMapping({"/", "/webshop", "/checkout", "/manager"})
    public String spa() {
        return "forward:/index.html";
    }

    @GetMapping("/_ah/warmup")
    public void warmup() {
    }
}
