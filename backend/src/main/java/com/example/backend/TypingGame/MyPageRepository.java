package com.example.backend.typinggame;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MyPageRepository extends JpaRepository<MyPage, Long>{
    Optional<MyPage> findByName(String name);
}