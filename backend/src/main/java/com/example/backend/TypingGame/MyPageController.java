package com.example.backend.typinggame;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/mypages")
public class MyPageController{
    private final MyPageRepository mypageRepository;

    public MyPageController(MyPageRepository mypageRepository){
        this.mypageRepository = mypageRepository;
    }

    @PostMapping
    public MyPage saveMyPage(@RequestBody MyPage mypage){
        if(mypageRepository.findByName(mypage.getName()).isPresent()){
            throw new RuntimeException("Name already exists");
        }
        
        return mypageRepository.save(mypage);
    }

    @PutMapping("/{name}")
    public ResponseEntity<MyPage> updateMyPage(
        @PathVariable String name,
        @RequestBody MyPage mypage
    ) {
        return mypageRepository.findByName(name)
            .map(existing -> {
                existing.setLevel(mypage.getLevel());
                existing.setSoundVolume(mypage.getSoundVolume());
                existing.setProgramProblemRate(mypage.programProblemRate());
                existing.setKeyDisplayMode(mypage.setKeyDisplayMode());
                return ResponseEntity.ok(mypageRepository.save(existing));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{name}")
    public MyPage getMyPage(@PathVariable String name){
        System.out.println("GET NAME = " + name);
        return mypageRepository.findByName(name).orElseThrow(() -> new RuntimeException("User not found"));
    }
}