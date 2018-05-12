package com.zzkun.controller;

import com.zzkun.Util.NasHttpUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;

@Controller
@Slf4j
public class MainController {

    @RequestMapping(value = "/{name:\\w+}")
    @ResponseBody
    public void redirect(@PathVariable String name, HttpServletResponse resp) {
        try {
            String result = NasHttpUtil.toLong(name);
            if (result == null) {
                resp.sendRedirect("/#/notFount");
            } else {
                resp.sendRedirect(result);
            }
        } catch (Exception e) {
            log.error("redirect error", e);
        }
    }
}
