package com.example.HealthGrid.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "users")
public class UsersEntity {

    @Id
    @Column(name = "user_id")
    private int user_id;

    @Column(name = "login_id")
    private String login_id;

    @Column(name = "password")
    private String password;

    @Column(name = "name")
    private String name;

    @Column(name = "created_at")
    private Date created_at;
}
