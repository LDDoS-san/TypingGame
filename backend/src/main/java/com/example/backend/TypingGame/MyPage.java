package com.example.backend.typinggame;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class MyPage{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true)
    private String name;

    private int level;
    private int soundVolume = 70;
    private int programProblemRate = 30;
    private int keyDisplayMode = 0;

    public long getId(){
        return id;
    }



    public String getName(){
        return name;
    }

    public void setName(String name){
        this.name = name;
    }

    public int getLevel(){
        return level;
    }

    public void setLevel(int level){
        this.level = level;
    }



    public int getSoundVolume(){
        return soundVolume;
    }

    public void setSoundVolume(int soundVolume){
        this.soundVolume = soundVolume;
    }

    public int getProgramProblemRate(){
        return programProblemRate;
    }

    public void setProgramProblemRate(int programProblemRate){
        this.programProblemRate = programProblemRate;
    }

    public int getKeyDisplayMode(){
        return keyDisplayMode;
    }

    public void setKeyDisplayMode(int keyDisplayMode){
        this.keyDisplayMode = keyDisplayMode;
    }
}